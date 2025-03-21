import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/src/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const error_description = searchParams.get('error_description');

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?error=${encodeURIComponent(error_description || error)}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?error=No se recibió el código de autorización`
      );
    }

    // Crear cliente de Supabase para el servidor
    const supabase = await createClient();

    // Obtener el usuario actual
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?error=No se encontró una sesión válida`
      );
    }

    // Buscar al usuario en la tabla users del schema public
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('fk_user', user.id)
      .single();
    
    if (userError || !userData) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?error=Usuario no encontrado`
      );
    }

    // Obtener el token de acceso de MercadoPago
    const tokenResponse = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_secret: process.env.MERCADOPAGO_CLIENT_SECRET,
        client_id: process.env.MERCADOPAGO_CLIENT_ID,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?error=${encodeURIComponent(errorData.error_description || 'Error al obtener el token de acceso')}`
      );
    }

    const tokenData = await tokenResponse.json();

    // Obtener información del usuario de MercadoPago
    const userResponse = await fetch('https://api.mercadopago.com/users/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?error=Error al obtener información del usuario`
      );
    }

    const mpUserData = await userResponse.json();

    // Guardar las credenciales en la base de datos
    const { error: saveError } = await supabase
      .from('oauth_mercadopago')
      .upsert({
        fk_user: userData.id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        scope: tokenData.scope,
        mp_user_id: mpUserData.id,
        updated_at: new Date().toISOString(),
      });

    if (saveError) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?error=Error al guardar las credenciales`
      );
    }

    // Redirigir al onboarding con éxito
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?success=connected`
    );
  } catch (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?error=Error interno del servidor`
    );
  }
} 