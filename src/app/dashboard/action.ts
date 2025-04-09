'use server'
import { Database } from '../types'
import { createClient } from '@/src/utils/supabase/server'

export const getUserData = async (): Promise<Database['public']['Tables']['users']['Row']> => {
  const supabase = createClient()

  const {
    data: { user }
  } = await (await supabase).auth.getUser()

  const { data } = await (await supabase).from('users').select('*').eq('fk_user', user.id)
  return data[0]
}
