import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (body.type !== 'payment') {
      return NextResponse.json({ message: 'No es un pago' })
    }

    let payment = body.data

    if (!payment.id.startsWith('test_')) {
      const response = await fetch(`${process.env.MP_API_URL}/v1/payments/${payment.id}`, {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al obtener detalles del pago')
      }

      payment = await response.json()
    }

    if (payment.status !== 'approved') {
      return NextResponse.json({ message: 'El pago no fue aprobado' })
    }

    const fk_user = parseInt(payment.external_reference.split('_')[2])

    const { error } = await supabase.from('transactions').insert({
      fk_user: fk_user,
      amount: payment.transaction_amount,
      status: 'completed',
      external_reference: payment.external_reference,
      mp_payment_id: payment.id.toString()
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ message: 'El pago se ha procesado correctamente' })
  } catch (error) {
    return NextResponse.json({ error: 'El pago no se ha podido procesar' }, { status: 500 })
  }
}
