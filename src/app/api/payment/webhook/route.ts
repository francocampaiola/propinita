import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.text()

    const data = JSON.parse(body)

    let paymentId: string | undefined

    if (data.action === 'payment.created' || data.action === 'payment.updated') {
      paymentId = data.data.id
    } else if (data.topic === 'payment' && data.resource) {
      paymentId = data.resource.replace(/\D/g, '')
    }

    if (!paymentId) {
      return NextResponse.json({ message: 'Tipo de notificación no reconocido' })
    }

    const response = await fetch(`${process.env.MP_API_URL}/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
      }
    })

    if (!response.ok) {
      await response.text()
      throw new Error(`Error al obtener detalles del pago: ${response.status}`)
    }

    const payment = await response.json()

    if (payment.status !== 'approved') {
      return NextResponse.json({ message: 'El pago no fue aprobado' })
    }

    const transactionId = parseInt(payment.external_reference)
    if (isNaN(transactionId)) {
      return NextResponse.json({ error: 'External reference inválido' }, { status: 400 })
    }

    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('status')
      .eq('id', transactionId)
      .single()

    if (fetchError || !transaction) {
      return NextResponse.json({ error: 'Transacción no encontrada' }, { status: 404 })
    }

    if (transaction.status === 'completed') {
      return NextResponse.json({ message: 'Transacción ya completada' })
    }

    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: 'completed',
        mp_payment_id: payment.id.toString()
      })
      .eq('id', transactionId)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ message: 'El pago se ha procesado correctamente' })
  } catch (error) {
    return NextResponse.json({ error: 'El pago no se ha podido procesar' }, { status: 500 })
  }
}
