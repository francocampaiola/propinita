import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import QRCode from 'qrcode'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { amount, providerId, providerName } = await request.json()

    const numericAmount = Number(amount)
    const { data: mpCredentials, error: mpError } = await supabase
      .from('oauth_mercadopago')
      .select('*')
      .eq('fk_user', providerId)
      .single()

    if (mpError || !mpCredentials) {
      throw new Error('No se encontraron las credenciales de MercadoPago del proveedor')
    }

    // Crear la transacción en la base de datos
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        fk_user: providerId,
        amount: numericAmount,
        status: 'pending'
      })
      .select()
      .single()

    if (transactionError) {
      throw new Error('Error al crear la transacción')
    }

    const paymentPreference = {
      items: [
        {
          title: `Propina - ${providerName}`,
          unit_price: numericAmount,
          quantity: 1
        }
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/pago/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/pago/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/pago/pending`
      },
      auto_return: 'approved',
      external_reference: transaction.id.toString(),
      notification_url: 'https://www.propinita.app/api/payment/webhook',
      marketplace: process.env.MP_MARKETPLACE_ID,
      marketplace_fee: Math.round(numericAmount * 0.1),
      binary_mode: true,
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }

    const response = await fetch(`${process.env.MP_API_URL}/checkout/preferences`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${mpCredentials.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentPreference)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al generar la preferencia de pago')
    }

    // Ya no generamos el QR en el servidor
    // Devolvemos solo la URL de pago para que el cliente genere el QR
    return NextResponse.json({
      initPoint: data.init_point,
      transactionId: transaction.id
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al generar el pago' },
      { status: 500 }
    )
  }
}
