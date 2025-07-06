'use server'

import { createClient as createServerClient } from '@/src/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { IResponse } from '../types'
import { ILoginResponse, IRegisterResponse } from './types'

export const login = async ({
  email,
  password
}: {
  email: string
  password: string
}): Promise<IResponse<ILoginResponse>> => {
  const supabase = await createServerClient()
  const { error, data: sessionData } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) {
    return { errorMessage: error.message }
  }
  if (!sessionData || !sessionData.session || !sessionData.user) {
    return { errorMessage: 'No se pudo obtener la sesión de usuario.' }
  }
  return {
    data: {
      access_token: sessionData.session.access_token,
      token_type: sessionData.session.token_type,
      expires_in: sessionData.session.expires_in,
      expires_at: sessionData.session.expires_at,
      refresh_token: sessionData.session.refresh_token,
      user: sessionData.user as any // Ajuste para evitar error de tipos
    }
  }
}

export const register = async ({
  email,
  password
}: {
  email: string
  password: string
}): Promise<IResponse<IRegisterResponse>> => {
  // Usamos el service role para poder crear usuarios y acceder a la tabla users
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Primero verificamos si el usuario ya existe en la tabla users
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    // Si hay datos, significa que el usuario ya existe
    if (existingUser) {
      return {
        errorMessage:
          'Este correo electrónico ya está registrado. Por favor, intenta iniciar sesión.'
      }
    }

    // Si no hay datos pero hay un error que no sea "no encontrado", es un error real
    if (checkError && checkError.code !== 'PGRST116') {
      return {
        errorMessage: 'Error al verificar el usuario existente. Por favor, intenta nuevamente.'
      }
    }

    // Procedemos con el registro usando el service role
    const { data, error: registerError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Confirmar el email automáticamente
    })

    if (registerError) {
      // Manejo específico de errores comunes de Supabase
      if (
        registerError.message.includes('already registered') ||
        registerError.message.includes('already been registered')
      ) {
        return {
          errorMessage:
            'Este correo electrónico ya está registrado. Por favor, intenta iniciar sesión.'
        }
      }
      if (registerError.message.includes('password')) {
        return { errorMessage: 'La contraseña no cumple con los requisitos de seguridad.' }
      }
      if (registerError.message.includes('email')) {
        return { errorMessage: 'El formato del correo electrónico no es válido.' }
      }
      return { errorMessage: registerError.message }
    }

    if (!data.user) {
      return { errorMessage: 'Error al crear la cuenta. Por favor, intenta nuevamente.' }
    }

    // Retornamos éxito con los datos del usuario
    return {
      data: data.user as IRegisterResponse,
      successMessage: 'Cuenta creada exitosamente. Ya puedes iniciar sesión con tu nueva cuenta.'
    }
  } catch (error) {
    console.error('Error en registro:', error)
    return { errorMessage: 'Error inesperado al crear la cuenta. Por favor, intenta nuevamente.' }
  }
}
