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
    return null
  }

  return data
}

export const getMercadoPago = async (
  userId: number
): Promise<Database['public']['Tables']['oauth_mercadopago']['Row'] | null> => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('oauth_mercadopago')
      .select('*')
      .eq('fk_user', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error('Error al obtener la información de MercadoPago')
    }

    return data
  } catch (error) {
    throw new Error('No se pudo obtener la información de MercadoPago')
  }
}

export const logout = async () => {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error('Error al cerrar sesión')
  }
}
