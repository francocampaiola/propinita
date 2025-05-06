'use server'

import { createClient } from '@/src/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function changePassword(password: string) {
  const cookieStore = cookies()
  const supabase = await createClient()

  // Verificar la autenticación del usuario
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      success: false,
      error: 'No estás autenticado. Por favor, inicia sesión nuevamente.'
    }
  }

  const { error } = await supabase.auth.updateUser({
    password
  })

  if (error) {
    return {
      success: false,
      error: 'No se pudo cambiar la contraseña. Por favor, intenta nuevamente.'
    }
  }

  // Desloguear al usuario
  const { error: signOutError } = await supabase.auth.signOut()

  if (signOutError) {
    return {
      success: false,
      error: 'Error al cerrar sesión. Por favor, intenta nuevamente.'
    }
  }

  return {
    success: true
  }
}
