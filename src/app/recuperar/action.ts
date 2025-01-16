'use server'

import { createClient } from '@/src/utils/supabase/server'
import { IResponse } from '../types'

export const recoveryPassword = async ({
  email
}: {
  email: string
}): Promise<IResponse<any>> => {
  const supabase = createClient()
  const { error } = await (await supabase).auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:3000/nueva_clave'
  })
  if (error) {
    return { errorMessage: error.message }
  }
}