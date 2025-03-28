import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Verificar que es una notificación de pago
    if (body.type !== 'payment') {
      return NextResponse.json({ message: 'Not a payment notification' })
    }

    // Obtener el ID del pago
    const paymentId = body.data.id

    // Obtener detalles del pago de MercadoPago
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
      }
    })

    const payment = await response.json()

    if (!response.ok) {
      throw new Error('Error al obtener detalles del pago')
    }

    // Verificar que el pago fue aprobado
    if (payment.status !== 'approved') {
      return NextResponse.json({ message: 'Payment not approved' })
    }

    // Extraer el ID del proveedor del external_reference
    const providerId = payment.external_reference.split('_')[2]

    // Insertar la transacción en la base de datos
    const { error } = await supabase.from('transactions').insert({
      fk_user: providerId,
      amount: payment.transaction_amount,
      status: 'completed'
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ message: 'Payment processed successfully' })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 })
  }
}
