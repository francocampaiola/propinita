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
    console.log('🔑 SECRETO DE WEBHOOK:', process.env.MP_WEBHOOK_SECRET?.substring(0, 5) + '...')

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
    console.log('🔔 WEBHOOK RECIBIDO')
    const body = await request.text()
    console.log('📦 BODY:', body)

    const data = JSON.parse(body)
    console.log('📋 DATA PARSEADA:', data)

    let paymentId: string | undefined

    if (data.action === 'payment.created' || data.action === 'payment.updated') {
      paymentId = data.data.id
      console.log('💰 PAYMENT ID (ACTION):', paymentId)
    } else if (data.topic === 'payment' && data.resource) {
      paymentId = data.resource.replace(/\D/g, '')
      console.log('💰 PAYMENT ID (RESOURCE):', paymentId)
    }

    if (!paymentId) {
      console.log('❌ NO SE ENCONTRÓ PAYMENT ID')
      return NextResponse.json({ message: 'Tipo de notificación no reconocido' })
    }

    console.log('🔍 OBTENIENDO DETALLES DEL PAGO:', paymentId)
    const response = await fetch(`${process.env.MP_API_URL}/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ ERROR API MP:', response.status, errorText)
      throw new Error(`Error al obtener detalles del pago: ${response.status}`)
    }

    const payment = await response.json()
    console.log('✅ DETALLES DEL PAGO:', payment)

    if (payment.status !== 'approved') {
      console.log('❌ PAGO NO APROBADO:', payment.status)
      return NextResponse.json({ message: 'El pago no fue aprobado' })
    }

    const transactionId = parseInt(payment.external_reference)
    if (isNaN(transactionId)) {
      console.error('❌ EXTERNAL REFERENCE INVÁLIDO:', payment.external_reference)
      return NextResponse.json({ error: 'External reference inválido' }, { status: 400 })
    }

    console.log('🔍 BUSCANDO TRANSACCIÓN:', transactionId)
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('status')
      .eq('id', transactionId)
      .single()

    if (fetchError || !transaction) {
      console.error('❌ ERROR BUSCANDO TRANSACCIÓN:', fetchError)
      return NextResponse.json({ error: 'Transacción no encontrada' }, { status: 404 })
    }

    if (transaction.status === 'completed') {
      console.log('✅ TRANSACCIÓN YA COMPLETADA')
      return NextResponse.json({ message: 'Transacción ya completada' })
    }

    console.log('📝 ACTUALIZANDO TRANSACCIÓN:', transactionId)
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: 'completed',
        mp_payment_id: payment.id.toString()
      })
      .eq('id', transactionId)

    if (updateError) {
      console.error('❌ ERROR ACTUALIZANDO TRANSACCIÓN:', updateError)
      throw updateError
    }

    console.log('✅ TRANSACCIÓN ACTUALIZADA')
    return NextResponse.json({ message: 'El pago se ha procesado correctamente' })
  } catch (error) {
    console.error('❌ ERROR GENERAL:', error)
    return NextResponse.json({ error: 'El pago no se ha podido procesar' }, { status: 500 })
  }
}
