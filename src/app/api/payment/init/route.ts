import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

    // Obtener información del proveedor para el statement_descriptor
    const { data: providerData, error: providerError } = await supabase
      .from('users')
      .select('first_name, last_name')
      .eq('id', providerId)
      .single()

    if (providerError || !providerData) {
      throw new Error('No se encontró la información del proveedor')
    }

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
          id: `propina_${transaction.id}`, // Código del item (requerido por MP)
          title: `Propina - ${providerName}`,
          description: `Propina para ${providerName} por servicios prestados`, // Description del item
          category_id: 'services', // Categoría del item (services es apropiado para propinas)
          unit_price: numericAmount,
          quantity: 1,
          currency_id: 'ARS' // Moneda argentina
        }
      ],
      payer: {
        name: 'Usuario',
        surname: 'Propinita',
        email: 'usuario@propinita.com'
      },
      statement_descriptor: `${providerData.first_name} ${providerData.last_name}`, // Descripción que aparece en el resumen de tarjeta
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/pago/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/pago/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/pago/pending`
      },
      auto_return: 'approved',
      external_reference: transaction.id.toString(),
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
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
