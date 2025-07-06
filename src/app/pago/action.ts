'use server'

import { createClient } from '@supabase/supabase-js'
import { Tables } from '../types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function getUserData(userId: string): Promise<{
  data: Pick<Tables<'users'>, 'first_name' | 'last_name'> | null
  error: string | null
}> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('first_name, last_name')
      .eq('id', userId)
      .single()

    if (error) {
      return { data: null, error: 'Usuario no encontrado' }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Error al obtener datos del usuario' }
  }
}
