import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/src/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Crear cliente de Supabase para el servidor
    const supabase = await createClient();

    // Obtener el usuario actual
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        connected: false, 
        error: 'No se encontró una sesión válida' 
      }, { status: 401 });
    }
    
    // Buscar al usuario en la tabla users del schema public
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('fk_user', user.id)
      .single();
    
    if (userError || !userData) {
      return NextResponse.json({ 
        connected: false, 
        error: 'Usuario no encontrado' 
      }, { status: 404 });
    }

    // Verificar si ya existen credenciales para este usuario
    const { data: mpCredentials, error: mpError } = await supabase
      .from('oauth_mercadopago')
      .select('*')
      .eq('fk_user', userData.id)
      .single();
    
    if (mpError || !mpCredentials) {
      return NextResponse.json({ 
        connected: false 
      });
    }
    
    // Verificar si el token está vencido
    const tokenExpiration = new Date(mpCredentials.updated_at);
    tokenExpiration.setSeconds(tokenExpiration.getSeconds() + mpCredentials.expires_in);
    
    const isExpired = new Date() > tokenExpiration;
    
    return NextResponse.json({
      connected: !isExpired,
      mp_user_id: mpCredentials.mp_user_id,
      expires_in: mpCredentials.expires_in,
      scope: mpCredentials.scope,
      token_status: isExpired ? 'expired' : 'valid',
      expiration_date: tokenExpiration.toISOString()
    });
  } catch (error) {
    console.error('Error al verificar conexión con MercadoPago:', error);
    return NextResponse.json({ 
      connected: false, 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}