import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function verifySignature(signature: string, body: string): boolean {
  try {
    console.log('🔐 VERIFICANDO FIRMA:')
    console.log('🔑 FIRMA RECIBIDA:', signature)
    console.log('📦 BODY RECIBIDO:', body)

    // El formato de la firma es: ts=timestamp,v1=hash
    const [tsPart, v1Part] = signature.split(',')
    const tsMatch = tsPart.match(/ts=(\d+)/)
    const v1Match = v1Part.match(/v1=([a-f0-9]+)/)

    if (!tsMatch || !v1Match) {
      console.error('❌ FORMATO DE FIRMA INVÁLIDO')
      return false
    }

    const timestamp = tsMatch[1]
    const receivedHash = v1Match[1]

    // Crear el string para el hash según la documentación
    const stringToHash = `${timestamp}.${body}`
    const expectedHash = crypto
      .createHmac('sha256', process.env.MP_WEBHOOK_SECRET!)
      .update(stringToHash)
      .digest('hex')

    console.log('📅 TIMESTAMP:', timestamp)
    console.log('🔑 HASH RECIBIDO:', receivedHash)
    console.log('🔑 HASH ESPERADO:', expectedHash)

    return expectedHash === receivedHash
  } catch (error) {
    console.error('❌ ERROR AL VERIFICAR FIRMA:', error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    console.log('🔔 WEBHOOK RECIBIDO:', new Date().toISOString())

    // Obtener el cuerpo del webhook como texto
    const body = await request.text()
    console.log('📦 BODY RECIBIDO:', body)

    // Verificar si hay firma de MercadoPago
    const mpSignature = request.headers.get('x-signature')
    console.log('🔐 FIRMA DE MERCADOPAGO:', mpSignature || 'No presente')

    // Parsear el cuerpo del webhook
    const data = JSON.parse(body)

    // Para merchant_order no verificamos firma
    if (data.topic === 'merchant_order') {
      console.log('✅ NOTIFICACIÓN DE MERCHANT ORDER RECIBIDA')
      return NextResponse.json({ message: 'Merchant order recibido' })
    }

    // Para payment.created y payment.updated verificamos firma
    if (data.action === 'payment.created' || data.action === 'payment.updated') {
      // Verificar la firma solo para notificaciones de pago
      if (!mpSignature || !process.env.MP_WEBHOOK_SECRET) {
        console.error('❌ CONFIGURACIÓN DE WEBHOOK INCOMPLETA')
        return NextResponse.json({ error: 'Configuración incompleta' }, { status: 401 })
      }

      const isValid = verifySignature(mpSignature, body)
      if (!isValid) {
        console.error('❌ FIRMA DEL WEBHOOK INVÁLIDA')
        return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
      }

      console.log('✅ NOTIFICACIÓN DE PAGO RECIBIDA:', data.action)
      console.log('💰 ID DEL PAGO:', data.data.id)

      // Obtener detalles del pago desde la API de MercadoPago
      const response = await fetch(`${process.env.MP_API_URL}/v1/payments/${data.data.id}`, {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      })

      if (!response.ok) {
        console.error('❌ ERROR AL OBTENER DETALLES DEL PAGO:', response.status)
        throw new Error('Error al obtener detalles del pago')
      }

      const payment = await response.json()
      console.log('✅ DETALLES DEL PAGO:', JSON.stringify(payment))

      if (payment.status !== 'approved') {
        console.log('❌ EL PAGO NO FUE APROBADO, ESTADO:', payment.status)
        return NextResponse.json({ message: 'El pago no fue aprobado' })
      }

      const transactionId = parseInt(payment.external_reference)

      // Actualizar la transacción
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          status: 'completed',
          mp_payment_id: payment.id.toString()
        })
        .eq('id', transactionId)

      if (updateError) {
        console.error('❌ ERROR AL ACTUALIZAR LA TRANSACCIÓN:', updateError)
        throw updateError
      }

      return NextResponse.json({ message: 'El pago se ha procesado correctamente' })
    }

    console.log('❌ TIPO DE NOTIFICACIÓN NO RECONOCIDO:', data.type || data.action)
    return NextResponse.json({ message: 'Tipo de notificación no reconocido' })
  } catch (error) {
    console.error('❌ ERROR EN EL WEBHOOK:', error)
    return NextResponse.json({ error: 'El pago no se ha podido procesar' }, { status: 500 })
  }
}
