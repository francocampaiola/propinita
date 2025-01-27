import { createClient } from '@/src/utils/supabase/server'
import { getUserData } from '../dashboard/action'
import { Database } from '../types'
import { Onboarding } from './onboarding.types'

export const getUserRawData = async (): Promise<Onboarding> => {
  const supabase = createClient()

  try {
    const { error, data } = await (await supabase).auth.getUser()
    if (error) {
      throw error.message
    }
    return data?.user?.user_metadata as unknown as Onboarding
  } catch (error) {
    throw error
  }
}

export const editUser = async (
  adminData?: any
): Promise<Database['public']['Tables']['users']['Row']> => {
  const supabase = createClient()

  try {
    const admin = await getUserData()
    if (admin && !adminData) return admin
    const { error, data } = await (await supabase)
      .from('users')
      .update(adminData)
      .eq('fk_user', admin.id)
      .select()
    if (error) throw error.message
    return data[0]
  } catch (error) {
    throw error
  }
}
