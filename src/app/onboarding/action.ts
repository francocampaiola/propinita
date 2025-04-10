'use server'

import { createClient } from '@/src/utils/supabase/server'
import { UserData } from './onboarding.types'
import { Database } from '../types'

export const getUserRawData = async (): Promise<UserData> => {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error
    } = await supabase.auth.getUser()

    if (error) {
      throw new Error(error.message)
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select()
      .eq('fk_user', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (userError) {
      return {} as UserData
    }

    return {
      user_type: userData.user_type,
      first_name: userData.first_name,
      last_name: userData.last_name,
      civil_state: userData.civil_state,
      nationality: userData.nationality,
      phone: userData.phone,
      current_step: userData.user_signup_status
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    return {} as UserData
  }
}

export const editUser = async (userData: Partial<UserData>): Promise<UserData> => {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError) {
      throw new Error(authError.message)
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('fk_user', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const updateData = {
      fk_user: user.id,
      user_type: userData.user_type,
      first_name: userData.first_name,
      last_name: userData.last_name,
      civil_state: userData.civil_state,
      nationality: userData.nationality,
      phone: userData.phone,
      user_signup_status: userData.current_step
    }

    let result: Database['public']['Tables']['users']['Row']

    if (!existingUser) {
      const { data, error } = await supabase
        .from('users')
        .insert([updateData])
        .select()
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      if (error) throw error
      result = data
    } else {
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', existingUser.id)
        .select()
        .single()
      if (error) throw error
      result = data
    }

    return {
      user_type: result.user_type,
      first_name: result.first_name,
      last_name: result.last_name,
      civil_state: result.civil_state,
      nationality: result.nationality,
      phone: result.phone,
      current_step: result.user_signup_status
    }
  } catch (error) {
    console.error('Error in editUser:', error)
    throw error
  }
}
