import { NextRequest, NextResponse } from "next/server";
import api from "@/src/api";
import { createClient } from '@/src/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Obtener el código de la URL
    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
      return NextResponse.json({ error: "No se proporcionó el código de autorización" }, { status: 400 });
    }

    // Crear cliente de Supabase para el servidor
    const supabase = await createClient();

    // Obtener el usuario actual
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error de autenticación:', authError);
      return NextResponse.redirect(`${process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL}/onboarding`);
    }
    
    // Buscar al usuario en la tabla users del schema public
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('fk_user', user.id)
      .single();
    
    if (userError || !userData) {
      console.error('Error al obtener el usuario:', userError);
      return NextResponse.redirect(`${process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL}/onboarding`);
    }

    // Conectar al usuario con el code y obtener las credenciales
    const credentials = await api.user.connect(code);
    
    // Verificar si ya existen credenciales para este usuario
    const { data: existingCreds, error: existingError } = await supabase
      .from('oauth_mercadopago')
      .select('id')
      .eq('fk_user', userData.id)
      .single();
    
    let result;
    
    if (existingCreds) {
      // Actualizar credenciales existentes
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
        .eq('id', existingCreds.id);
    } else {
      // Insertar nuevas credenciales
      result = await supabase
        .from('oauth_mercadopago')
        .insert({
          fk_user: userData.id,
          mp_user_id: credentials.user_id,
          access_token: credentials.access_token,
          refresh_token: credentials.refresh_token,
          expires_in: credentials.expires_in,
          scope: credentials.scope,
          token_type: credentials.token_type,
          updated_at: new Date().toISOString()
        });
    }
    
    if (result.error) {
      console.error('Error al guardar credenciales:', result.error);
      return NextResponse.redirect(`${process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL}/onboarding`);
    }
    
    // Redirigir al usuario a la página del marketplace con éxito
    return NextResponse.redirect(`${process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL}/onboarding`);
  } catch (error) {
    console.error('Error en la conexión con MercadoPago:', error);
    return NextResponse.redirect(`${process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL}/onboarding`);
  }
}