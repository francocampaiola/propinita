import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function verifySignature(signature: string, body: string): boolean {
  try {
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

    // Crear el hash esperado
    const data = `${timestamp}.${body}`
    const expectedHash = crypto
      .createHmac('sha256', process.env.MP_WEBHOOK_SECRET!)
      .update(data)
      .digest('hex')

    console.log('🔐 VERIFICANDO FIRMA:')
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
    console.log('🔔 WEBHOOK RECIBIDO - URL:', request.url)

    // Registrar los headers para diagnóstico
    const headers = Object.fromEntries(request.headers.entries())
    console.log('📋 HEADERS RECIBIDOS:', JSON.stringify(headers))

    // Verificar si hay algún header específico de MercadoPago
    const mpSignature = request.headers.get('x-signature')
    console.log('🔐 FIRMA DE MERCADOPAGO:', mpSignature || 'No presente')

    const body = await request.text()
    console.log('📦 BODY RECIBIDO:', body)

    // Verificar la firma del webhook
    if (!mpSignature || !verifySignature(mpSignature, body)) {
      console.error('❌ FIRMA DEL WEBHOOK INVÁLIDA')
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
    }

    const data = JSON.parse(body)

    // Verificar si es una notificación de MercadoPago
    if (data.action === 'payment.created' || data.action === 'payment.updated') {
      console.log('✅ NOTIFICACIÓN DE MERCADOPAGO RECIBIDA:', data.action)

      // Obtener el ID del pago
      const paymentId = data.data.id
      console.log('💰 ID DEL PAGO:', paymentId)

      // Obtener detalles del pago desde la API de MercadoPago
      console.log('🔍 VERIFICANDO PAGO CON MERCADOPAGO, ID:', paymentId)
      console.log('🔍 URL DE VERIFICACIÓN:', `${process.env.MP_API_URL}/v1/payments/${paymentId}`)

      // Obtener el token del proveedor
      const { data: mpCredentials, error: mpError } = await supabase
        .from('oauth_mercadopago')
        .select('*')
        .eq('mp_user_id', data.user_id)
        .single()

      if (mpError || !mpCredentials) {
        console.error('❌ ERROR AL OBTENER CREDENCIALES DEL PROVEEDOR:', mpError)
        throw new Error('No se encontraron las credenciales del proveedor')
      }

      const response = await fetch(`${process.env.MP_API_URL}/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${mpCredentials.access_token}`
        }
      })

      if (!response.ok) {
        console.error(
          '❌ ERROR AL OBTENER DETALLES DEL PAGO:',
          response.status,
          await response.text()
        )
        throw new Error('Error al obtener detalles del pago')
      }

      const payment = await response.json()
      console.log('✅ DETALLES DEL PAGO ACTUALIZADOS:', JSON.stringify(payment))

      if (payment.status !== 'approved') {
        console.log('❌ EL PAGO NO FUE APROBADO, ESTADO:', payment.status)
        return NextResponse.json({ message: 'El pago no fue aprobado' })
      }

      const transactionId = parseInt(payment.external_reference)
      console.log('🔢 ID DE TRANSACCIÓN:', transactionId)

      const { data: existingTransaction, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single()

      if (fetchError) {
        console.error('❌ ERROR AL BUSCAR LA TRANSACCIÓN:', fetchError)
        throw new Error('No se encontró la transacción')
      }

      console.log('✅ TRANSACCIÓN ENCONTRADA:', JSON.stringify(existingTransaction))

      // Actualizar la transacción existente
      const { data: updatedTransaction, error: updateError } = await supabase
        .from('transactions')
        .update({
          status: 'completed',
          mp_payment_id: payment.id.toString()
        })
        .eq('id', transactionId)
        .select()
        .single()

      if (updateError) {
        console.error('❌ ERROR AL ACTUALIZAR LA TRANSACCIÓN:', updateError)
        throw updateError
      }

      console.log('✅ TRANSACCIÓN ACTUALIZADA:', JSON.stringify(updatedTransaction))
      return NextResponse.json({ message: 'El pago se ha procesado correctamente' })
    } else {
      console.log('❌ TIPO DE NOTIFICACIÓN NO RECONOCIDO:', data.type || data.action)
      return NextResponse.json({ message: 'Tipo de notificación no reconocido' })
    }
  } catch (error) {
    console.error('❌ ERROR EN EL WEBHOOK:', error)
    return NextResponse.json({ error: 'El pago no se ha podido procesar' }, { status: 500 })
  }
}
