import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    // Verificar variables críticas
    if (!process.env.MP_API_URL) {
      console.error('MP_API_URL no está definida')
      return NextResponse.json({ error: 'MP_API_URL no configurada' }, { status: 500 })
    }

    if (!process.env.MP_ACCESS_TOKEN) {
      console.error('MP_ACCESS_TOKEN no está definida')
      return NextResponse.json({ error: 'MP_ACCESS_TOKEN no configurada' }, { status: 500 })
    }

    const body = await request.text()
    console.log('Webhook recibido:', body)

    const data = JSON.parse(body)
    console.log('Datos parseados:', data)

    let paymentId: string | undefined

    if (data.action === 'payment.created' || data.action === 'payment.updated') {
      paymentId = data.data?.id
    } else if (data.topic === 'payment' && data.resource) {
      paymentId = data.resource.replace(/\D/g, '')
    }

    if (!paymentId) {
      console.log('Payment ID no encontrado en:', data)
      return NextResponse.json({ message: 'Payment ID no encontrado' })
    }

    console.log('Payment ID:', paymentId)

    // Intentar obtener el pago de MercadoPago
    try {
      const response = await fetch(`${process.env.MP_API_URL}/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error MP API:', response.status, errorText)
        return NextResponse.json(
          {
            error: `Error MP API: ${response.status}`,
            details: errorText
          },
          { status: response.status }
        )
      }

      const payment = await response.json()
      console.log('Pago obtenido:', payment)

      if (payment.status !== 'approved') {
        return NextResponse.json({ message: `Pago no aprobado: ${payment.status}` })
      }

      if (!payment.external_reference) {
        return NextResponse.json({ error: 'Pago sin external_reference' }, { status: 400 })
      }

      const transactionId = parseInt(payment.external_reference)
      if (isNaN(transactionId)) {
        return NextResponse.json({ error: 'External reference inválido' }, { status: 400 })
      }

      // Actualizar transacción en Supabase
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          status: 'completed',
          mp_payment_id: payment.id.toString()
        })
        .eq('id', transactionId)

      if (updateError) {
        console.error('Error Supabase:', updateError)
        return NextResponse.json({ error: 'Error al actualizar transacción' }, { status: 500 })
      }

      return NextResponse.json({ message: 'Pago procesado correctamente' })
    } catch (mpError) {
      console.error('Error al conectar con MP:', mpError)
      return NextResponse.json({ error: 'Error de conexión con MercadoPago' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error general en webhook:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
