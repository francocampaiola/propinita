'use server'

import { revalidatePath } from 'next/cache'
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
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return { errorMessage: error.message }
    }
    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error) {
    return { errorMessage: 'Hubo un error inesperado' }
  }
}

export const register = async ({
  email,
  password
}: {
  email: string
  password: string
}): Promise<IResponse<IRegisterResponse>> => {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      return { errorMessage: 'Hubo un error intentando registrarse en la plataforma' }
    }
    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error) {
    return { errorMessage: error }
  }
}
