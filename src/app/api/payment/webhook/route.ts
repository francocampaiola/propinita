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

    // Parsear el body para obtener solo los datos relevantes
    const data = JSON.parse(body)
    const relevantData = {
      action: data.action,
      api_version: data.api_version,
      data: data.data,
      id: data.id,
      live_mode: data.live_mode,
      type: data.type,
      user_id: data.user_id,
      ...(data.topic && { topic: data.topic }),
      ...(data.resource && { resource: data.resource })
    }

    // Crear el string para el hash según la documentación
    const stringToHash = `${timestamp}.${JSON.stringify(relevantData)}`
    console.log('🔍 STRING PARA HASH:', stringToHash)

    const expectedHash = crypto
      .createHmac('sha256', process.env.MP_WEBHOOK_SECRET!)
      .update(stringToHash)
      .digest('hex')

    console.log('🔑 HASH RECIBIDO:', receivedHash)
    console.log('🔑 HASH ESPERADO:', expectedHash)
    console.log('🔍 ¿COINCIDEN?:', expectedHash === receivedHash)

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
    let data
    try {
      data = JSON.parse(body)
    } catch (error) {
      console.error('❌ ERROR AL PARSEAR EL BODY:', error)
      return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
    }

    // Para merchant_order no verificamos firma
    if (data.topic === 'merchant_order') {
      console.log('✅ NOTIFICACIÓN DE MERCHANT ORDER RECIBIDA')
      return NextResponse.json({ message: 'Merchant order recibido' })
    }

    // Verificar firma para notificaciones de pago
    if (!mpSignature || !process.env.MP_WEBHOOK_SECRET) {
      console.error('❌ CONFIGURACIÓN DE WEBHOOK INCOMPLETA')
      return NextResponse.json({ error: 'Configuración incompleta' }, { status: 401 })
    }

    const isValid = verifySignature(mpSignature, body)
    if (!isValid) {
      console.error('❌ FIRMA DEL WEBHOOK INVÁLIDA')
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
    }

    // Procesar la notificación de pago
    let paymentId: string | undefined

    if (data.action === 'payment.created' || data.action === 'payment.updated') {
      paymentId = data.data.id
      console.log('✅ NOTIFICACIÓN DE PAGO RECIBIDA:', data.action)
    } else if (data.topic === 'payment' && data.resource) {
      paymentId = data.resource.replace(/\D/g, '')
      console.log('✅ NOTIFICACIÓN DE PAGO (RESOURCE) RECIBIDA')
    }

    if (!paymentId) {
      console.log('❌ TIPO DE NOTIFICACIÓN NO RECONOCIDO:', data.type || data.action)
      return NextResponse.json({ message: 'Tipo de notificación no reconocido' })
    }

    console.log('💰 ID DEL PAGO:', paymentId)

    // Obtener detalles del pago desde la API de MercadoPago
    const response = await fetch(`${process.env.MP_API_URL}/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
      }
    })

    if (!response.ok) {
      console.error('❌ ERROR AL OBTENER DETALLES DEL PAGO:', response.status)
      const errorText = await response.text()
      console.error('❌ ERROR DETALLES:', errorText)
      throw new Error(`Error al obtener detalles del pago: ${response.status}`)
    }

    const payment = await response.json()
    console.log('✅ DETALLES DEL PAGO:', JSON.stringify(payment))

    if (payment.status !== 'approved') {
      console.log('❌ EL PAGO NO FUE APROBADO, ESTADO:', payment.status)
      return NextResponse.json({ message: 'El pago no fue aprobado' })
    }

    // Validar que el external_reference sea un número válido
    const transactionId = parseInt(payment.external_reference)
    if (isNaN(transactionId)) {
      console.error('❌ EXTERNAL_REFERENCE INVÁLIDO:', payment.external_reference)
      return NextResponse.json({ error: 'External reference inválido' }, { status: 400 })
    }

    // Verificar que la transacción existe
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('status')
      .eq('id', transactionId)
      .single()

    if (fetchError || !transaction) {
      console.error('❌ ERROR AL BUSCAR TRANSACCIÓN:', fetchError)
      return NextResponse.json({ error: 'Transacción no encontrada' }, { status: 404 })
    }

    console.log('📊 ESTADO ACTUAL DE LA TRANSACCIÓN:', transaction.status)

    // Si la transacción ya está completada, no hacer nada
    if (transaction.status === 'completed') {
      console.log('✅ TRANSACCIÓN YA COMPLETADA')
      return NextResponse.json({ message: 'Transacción ya completada' })
    }

    // Actualizar la transacción
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: 'completed',
        mp_payment_id: payment.id.toString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', transactionId)

    if (updateError) {
      console.error('❌ ERROR AL ACTUALIZAR LA TRANSACCIÓN:', updateError)
      throw updateError
    }

    console.log('✅ TRANSACCIÓN ACTUALIZADA EXITOSAMENTE')
    return NextResponse.json({ message: 'El pago se ha procesado correctamente' })
  } catch (error) {
    console.error('❌ ERROR EN EL WEBHOOK:', error)
    return NextResponse.json({ error: 'El pago no se ha podido procesar' }, { status: 500 })
  }
}
