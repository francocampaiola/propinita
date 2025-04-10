import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function verifySignature(signature: string, body: string): boolean {
  try {
    const [tsPart, v1Part] = signature.split(',')
    const tsMatch = tsPart.match(/ts=(\d+)/)
    const v1Match = v1Part.match(/v1=([a-f0-9]+)/)

    if (!tsMatch || !v1Match) return false

    const timestamp = tsMatch[1]
    const receivedHash = v1Match[1]
    const stringToHash = `${timestamp}.${body}`

    const expectedHash = crypto
      .createHmac('sha256', process.env.MP_WEBHOOK_SECRET!)
      .update(stringToHash)
      .digest('hex')

    return expectedHash === receivedHash
  } catch (error) {
    return false
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const mpSignature = request.headers.get('x-signature')

    if (!mpSignature || !process.env.MP_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Configuración incompleta' }, { status: 401 })
    }

    const isValid = verifySignature(mpSignature, body)
    if (!isValid) {
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
    }

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
        mp_payment_id: payment.id.toString(),
        updated_at: new Date().toISOString()
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
