'use server'

import { createClient } from '@/src/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function changePassword(currentPassword: string, newPassword: string) {
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

  // Verificar la contraseña actual
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword
  })

  if (signInError) {
    return {
      success: false,
      error: 'La contraseña actual es incorrecta.'
    }
  }

  // Cambiar la contraseña
  const { error } = await supabase.auth.updateUser({
    password: newPassword
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
