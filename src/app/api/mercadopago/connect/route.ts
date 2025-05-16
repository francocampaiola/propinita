import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/src/utils/supabase/server'
import api from '@/src/api'

export async function GET(request: NextRequest) {
  console.log('=== TEST LOG ===')
  console.log('URL completa:', request.url)
  console.log('Parámetros:', Object.fromEntries(request.nextUrl.searchParams))

  try {
    console.log('Iniciando proceso de conexión con MercadoPago')
    const code = request.nextUrl.searchParams.get('code')
    console.log('Código de autorización recibido:', code ? 'Sí' : 'No')

    if (!code) {
      console.log('No se recibió código de autorización')
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/ajustes/metodos?error=no_code`
      )
    }

    const supabase = await createClient()
    console.log('Cliente Supabase creado')

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log('Error de autenticación:', authError?.message)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/ajustes/metodos?error=no_session`
      )
    }
    console.log('Usuario autenticado:', user.id)

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('fk_user', user.id)
      .single()

    if (userError || !userData) {
      console.log('Error al obtener datos del usuario:', userError?.message)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/ajustes/metodos?error=user_not_found`
      )
    }
    console.log('Datos del usuario obtenidos:', userData.id)

    console.log('Intentando conectar con MercadoPago...')
    const credentials = await api.user.connect(code)
    console.log('Credenciales recibidas de MercadoPago:', {
      user_id: credentials.user_id,
      scope: credentials.scope,
      token_type: credentials.token_type
    })

    const { data: existingCreds, error: existingError } = await supabase
      .from('oauth_mercadopago')
      .select('id')
      .eq('fk_user', userData.id)
      .single()

    let result
    if (existingCreds) {
      console.log('Actualizando credenciales existentes')
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
      console.log('Insertando nuevas credenciales')
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
      console.log('Error al guardar credenciales:', result.error.message)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/ajustes/metodos?error=db_error`
      )
    }

    console.log('Conexión completada exitosamente')
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/ajustes/metodos?success=connected`
    )
  } catch (error) {
    console.error('Error detallado en la conexión con MercadoPago:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/ajustes/metodos?error=unknown`
    )
  }
}
