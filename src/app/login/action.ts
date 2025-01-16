'use server'

import { createClient } from '@/src/utils/supabase/server'
import { IResponse } from '../types'
import { ILoginResponse, IRegisterResponse } from './types'

export const login = async ({
  email,
  password
}: {
  email: string
  password: string
}): Promise<IResponse<ILoginResponse>> => {
  const supabase = createClient()
  const { error, data: session } = await (
    await supabase
  ).auth.signInWithPassword({
    email,
    password
  })
  if (error) {
    return { errorMessage: error.message }
  }
  const { data: user, error: userError } = await (await supabase).auth.getUser()
  if (userError) {
    return { errorMessage: userError.message }
  }
}

export const register = async ({
  email,
  password
}: {
  email: string
  password: string
}): Promise<IResponse<IRegisterResponse>> => {
  const supabase = createClient()

  const { data, error: registerError } = await (await supabase)
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (data) {
    return { errorMessage: 'Este correo ya está registrado.' };
  }

  const { error } = await (await supabase).auth.signUp({ email, password })
  if (error) {
    return { errorMessage: error.message }
  }
}
