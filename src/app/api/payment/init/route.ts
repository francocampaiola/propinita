import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { amount, providerId, providerName } = await request.json()

    // Crear preferencia de pago en MercadoPago
    const preference = {
      items: [
        {
          title: `Propina para ${providerName}`,
          unit_price: Number(amount),
          quantity: 1
        }
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/pago/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/pago/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/pago/pending`
      },
      auto_return: 'approved',
      external_reference: `tip_${Date.now()}_${providerId}`,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`
    }

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error('Error al crear la preferencia de pago')
    }

    return NextResponse.json({ initPoint: data.init_point })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al procesar el pago' }, { status: 500 })
  }
}
