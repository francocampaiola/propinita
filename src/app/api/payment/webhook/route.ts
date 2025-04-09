import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

    const body = await request.json()
    console.log('📦 BODY RECIBIDO:', JSON.stringify(body))

    // Verificar si es una notificación de MercadoPago
    if (body.action === 'payment.created' || body.action === 'payment.updated') {
      console.log('✅ NOTIFICACIÓN DE MERCADOPAGO RECIBIDA:', body.action)

      // Obtener el ID del pago
      const paymentId = body.data.id
      console.log('💰 ID DEL PAGO:', paymentId)

      // Obtener detalles del pago desde la API de MercadoPago
      console.log('🔍 VERIFICANDO PAGO CON MERCADOPAGO, ID:', paymentId)
      console.log('🔍 URL DE VERIFICACIÓN:', `${process.env.MP_API_URL}/v1/payments/${paymentId}`)

      const response = await fetch(`${process.env.MP_API_URL}/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
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
    }
    // Manejar el formato antiguo de webhook
    else if (body.type === 'payment') {
      console.log('✅ FORMATO ANTIGUO DE WEBHOOK RECIBIDO')

      let payment = body.data
      console.log('💰 DATOS DEL PAGO:', JSON.stringify(payment))

      // Verificar si el pago es de MercadoPago
      if (!payment.id.startsWith('test_')) {
        console.log('🔍 VERIFICANDO PAGO CON MERCADOPAGO, ID:', payment.id)
        console.log(
          '🔍 URL DE VERIFICACIÓN:',
          `${process.env.MP_API_URL}/v1/payments/${payment.id}`
        )

        const response = await fetch(`${process.env.MP_API_URL}/v1/payments/${payment.id}`, {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
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

        payment = await response.json()
        console.log('✅ DETALLES DEL PAGO ACTUALIZADOS:', JSON.stringify(payment))
      }

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
      console.log('❌ TIPO DE NOTIFICACIÓN NO RECONOCIDO:', body.type || body.action)
      return NextResponse.json({ message: 'Tipo de notificación no reconocido' })
    }
  } catch (error) {
    console.error('❌ ERROR EN EL WEBHOOK:', error)
    return NextResponse.json({ error: 'El pago no se ha podido procesar' }, { status: 500 })
  }
}
