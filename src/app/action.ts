import { createClient } from '../utils/supabase/client'
import { Database } from './types'

export const getUser = async (): Promise<Database['public']['Tables']['users']['Row']> => {
  const supabase = createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  const { data: userPublic, error } = await supabase
    .from('users')
    .select('*')
    .eq('fk_user', user?.id)
    .single()
  return userPublic
}

export const logout = async () => {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error al cerrar sesión:', error.message)
  }
}
