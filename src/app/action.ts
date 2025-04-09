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

export const getBalance = async (
  userId: number
): Promise<Database['public']['Tables']['wallets']['Row']> => {
  const supabase = createClient()

  const { data, error } = await supabase.from('wallets').select('*').eq('fk_user', userId).single()

  if (error) {
    console.error('Error fetching balance:', error)
    return null
  }

  return data
}

export const getTransactions = async (
  userId: number
): Promise<Database['public']['Tables']['transactions']['Row'][]> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('status', 'completed')
    .eq('fk_user', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching transactions:', error)
    return null
  }

  return data
}

export const logout = async () => {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error al cerrar sesión:', error.message)
  }
}
