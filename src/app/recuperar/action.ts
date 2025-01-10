'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/src/utils/supabase/server'
import { IResponse } from '../types'
// import { IRecoveryPasswordResponse } from './types'

export const recoveryPassword = async ({
  email
}: {
  email: string
}): Promise<IResponse<any>> => {
  const supabase = createClient()
  const { error } = await (await supabase).auth.resetPasswordForEmail(email)
  if (error) {
    return { errorMessage: error.message }
  }
}