'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/src/utils/supabase/server'
import { IResponse } from '../types'
import { ILoginResponse } from './types'

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
      return { errorMessage: 'Hubo un error intentando ingresar a la plataforma' }
    }
    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error) {
    return { errorMessage: 'Hubo un error inesperado' }
  }
}
