import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { amount, providerId, providerName } = await request.json()

    console.log('Datos recibidos:', { amount, providerId, providerName })

    // Obtener las credenciales de MercadoPago del mozo
    const { data: mpCredentials, error: mpError } = await supabase
      .from('oauth_mercadopago')
      .select('*')
      .eq('fk_user', providerId)
      .single()

    console.log('Credenciales de MercadoPago:', { mpCredentials, mpError })

    if (mpError || !mpCredentials) {
      throw new Error('No se encontraron las credenciales de MercadoPago del mozo')
    }

    // Crear preferencia de pago en MercadoPago
    const paymentPreference = {
      items: [
        {
          title: 'Propina para Mozo Restaurante',
          unit_price: amount,
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
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
      marketplace: process.env.MP_MARKETPLACE_ID,
      marketplace_fee: Math.round(amount * 0.1),
      binary_mode: true,
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }

    console.log('Preference data:', JSON.stringify(paymentPreference, null, 2))

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${mpCredentials.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentPreference)
    })

    const data = await response.json()
    console.log('MercadoPago response:', JSON.stringify(data, null, 2))

    if (!response.ok) {
      throw new Error(`Error al crear la preferencia de pago: ${JSON.stringify(data)}`)
    }

    return NextResponse.json({ initPoint: data.init_point })
  } catch (error) {
    console.error('Error completo:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
