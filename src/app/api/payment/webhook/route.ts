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
    console.log('🔑 SECRETO DE WEBHOOK:', process.env.MP_WEBHOOK_SECRET ? 'Presente' : 'Ausente')

    // El formato de la firma es: ts=timestamp,v1=hash
    const [tsPart, v1Part] = signature.split(',')
    console.log('🔍 PARTE TS:', tsPart)
    console.log('🔍 PARTE V1:', v1Part)

    const tsMatch = tsPart.match(/ts=(\d+)/)
    const v1Match = v1Part.match(/v1=([a-f0-9]+)/)

    if (!tsMatch || !v1Match) {
      console.error('❌ FORMATO DE FIRMA INVÁLIDO')
      return false
    }

    const timestamp = tsMatch[1]
    const receivedHash = v1Match[1]

    console.log('📅 TIMESTAMP:', timestamp)
    console.log('🔑 HASH RECIBIDO:', receivedHash)

    // Crear el string para el hash según la documentación de MP
    const stringToHash = `${timestamp}.${body}`
    console.log('🔍 STRING PARA HASH:', stringToHash)

    const expectedHash = crypto
      .createHmac('sha256', process.env.MP_WEBHOOK_SECRET!)
      .update(stringToHash)
      .digest('hex')

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
    console.log('🔔 WEBHOOK RECIBIDO - URL:', request.url)

    // Registrar los headers para diagnóstico
    const headers = Object.fromEntries(request.headers.entries())
    console.log('📋 HEADERS RECIBIDOS:', JSON.stringify(headers))

    // Verificar si hay algún header específico de MercadoPago
    const mpSignature = request.headers.get('x-signature')
    console.log('🔐 FIRMA DE MERCADOPAGO:', mpSignature || 'No presente')

    // Obtener el cuerpo del webhook como texto
    const body = await request.text()
    console.log('📦 BODY RECIBIDO (TEXTO):', body)

    // Verificar la firma del webhook
    if (!mpSignature) {
      console.error('❌ NO SE RECIBIÓ FIRMA DEL WEBHOOK')
      return NextResponse.json({ error: 'No se recibió firma' }, { status: 401 })
    }

    if (!process.env.MP_WEBHOOK_SECRET) {
      console.error('❌ NO SE CONFIGURÓ EL SECRETO DE WEBHOOK')
      return NextResponse.json({ error: 'Configuración incompleta' }, { status: 500 })
    }

    const isValid = verifySignature(mpSignature, body)
    if (!isValid) {
      console.error('❌ FIRMA DEL WEBHOOK INVÁLIDA')
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
    }

    // Parsear el cuerpo del webhook
    const data = JSON.parse(body)
    console.log('📦 BODY RECIBIDO (JSON):', JSON.stringify(data))

    // Verificar el tipo de notificación
    if (data.topic === 'merchant_order') {
      console.log('✅ NOTIFICACIÓN DE MERCHANT ORDER RECIBIDA')
      // Aquí puedes procesar la notificación de merchant_order si es necesario
      return NextResponse.json({ message: 'Merchant order recibido' })
    }

    // Verificar si es una notificación de MercadoPago
    if (data.action === 'payment.created' || data.action === 'payment.updated') {
      console.log('✅ NOTIFICACIÓN DE PAGO RECIBIDA:', data.action)
      console.log('💰 ID DEL PAGO:', data.data.id)
      console.log('👤 ID DEL USUARIO:', data.user_id)

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

      // Obtener detalles del pago desde la API de MercadoPago
      const response = await fetch(`${process.env.MP_API_URL}/v1/payments/${data.data.id}`, {
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
      console.log('✅ DETALLES DEL PAGO:', JSON.stringify(payment))

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
