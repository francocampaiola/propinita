import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/src/utils/supabase/server'
import api from '@/src/api'

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code')
    if (!code) {
      return NextResponse.json(
        { error: 'No se proporcionó el código de autorización' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/onboarding`)
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('fk_user', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/onboarding`)
    }

    const credentials = await api.user.connect(code)

    const { data: existingCreds, error: existingError } = await supabase
      .from('oauth_mercadopago')
      .select('id')
      .eq('fk_user', userData.id)
      .single()

    let result

    if (existingCreds) {
      result = await supabase
        .from('oauth_mercadopago')
        .update({
          mp_user_id: credentials.user_id,
          access_token: credentials.access_token,
          refresh_token: credentials.refresh_token,
          expires_in: credentials.expires_in,
          scope: credentials.scope,
          token_type: credentials.token_type,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingCreds.id)
    } else {
      result = await supabase.from('oauth_mercadopago').insert({
        fk_user: userData.id,
        mp_user_id: credentials.user_id,
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token,
        expires_in: credentials.expires_in,
        scope: credentials.scope,
        token_type: credentials.token_type,
        updated_at: new Date().toISOString()
      })
    }

    if (result.error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/onboarding`)
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/onboarding`)
  } catch (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/onboarding`)
  }
}
