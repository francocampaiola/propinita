'use server'

import { redirect } from 'next/navigation'
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
  const { error } = await (await supabase).auth.signInWithPassword({ email, password })
  if (error) {
    return { errorMessage: error.message }
  }
  redirect('/dashboard')
}

export const register = async ({
  email,
  password
}: {
  email: string
  password: string
}): Promise<IResponse<IRegisterResponse>> => {
  const supabase = createClient()
  const { error } = await (await supabase).auth.signUp({ email, password })
  if (error) {
    return { errorMessage: error.message }
  }
  redirect('/dashboard')
}
