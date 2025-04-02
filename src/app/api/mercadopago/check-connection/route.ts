import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/src/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          connected: false,
          error: 'No se encontró una sesión válida'
        },
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('fk_user', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        {
          connected: false,
          error: 'Usuario no encontrado'
        },
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    const { data: mpCredentials, error: mpError } = await supabase
      .from('oauth_mercadopago')
      .select('*')
      .eq('fk_user', userData.id)
      .single()

    if (mpError || !mpCredentials) {
      return NextResponse.json(
        {
          connected: false
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    const tokenExpiration = new Date(mpCredentials.updated_at)
    tokenExpiration.setSeconds(tokenExpiration.getSeconds() + mpCredentials.expires_in)
    const isExpired = new Date() > tokenExpiration
    if (isExpired) {
      return NextResponse.json(
        {
          connected: false,
          error: 'Token expirado'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }
    try {
      const response = await fetch(`${process.env.MP_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${mpCredentials.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        await supabase.from('oauth_mercadopago').delete().eq('fk_user', userData.id)
        return NextResponse.json(
          {
            connected: false,
            error: 'Token inválido o revocado'
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      }

      const mpUserData = await response.json()

      let marketplaceLinked = false
      try {
        const marketplaceResponse = await fetch(`${process.env.MP_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${mpCredentials.access_token}`,
            'Content-Type': 'application/json'
          }
        })

        if (marketplaceResponse.ok) {
          const marketplaceData = await marketplaceResponse.json()
          marketplaceLinked = marketplaceData.status?.sell?.allow === true
        } else {
          const errorText = await marketplaceResponse.text()
          throw new Error(errorText)
        }
      } catch (error) {
        marketplaceLinked = false
        throw new Error(error as string)
      }

      return NextResponse.json(
        {
          connected: true,
          mp_user_id: mpUserData.id,
          expires_in: mpCredentials.expires_in,
          scope: mpCredentials.scope,
          token_status: 'valid',
          expiration_date: tokenExpiration.toISOString(),
          marketplace_linked: marketplaceLinked
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    } catch (error) {
      return NextResponse.json(
        {
          connected: false,
          error: 'Error al validar con MercadoPago'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        connected: false,
        error: 'Error interno del servidor'
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
