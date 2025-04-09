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

    // Verificar si el pago es de MercadoPago
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

    const transactionId = parseInt(payment.external_reference)

    const { data: existingTransaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single()

    if (fetchError) {
      console.error('Error al buscar la transacción:', fetchError)
      throw new Error('No se encontró la transacción')
    }

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
      console.error('Error al actualizar la transacción:', updateError)
      throw updateError
    }

    return NextResponse.json({ message: 'El pago se ha procesado correctamente' })
  } catch (error) {
    return NextResponse.json({ error: 'El pago no se ha podido procesar' }, { status: 500 })
  }
}
