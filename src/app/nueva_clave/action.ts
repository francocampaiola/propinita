'use server'

import { createClient } from '@/src/utils/supabase/server'
import { IResponse } from '../types'
import { translateError } from '../utils/translate/translateError'

export const updatePassword = async ({
  token,
  password
}: {
  token: string
  password: string
}): Promise<IResponse<any>> => {
  const supabase = createClient()
  const { data, error: verifyError } = await (
    await supabase
  ).auth.verifyOtp({ token_hash: token, type: 'recovery' })
  if (verifyError) {
    console.log(verifyError)
    return { errorMessage: translateError(verifyError.message) }
  }
  const { error } = await (
    await supabase
  ).auth.updateUser({
    password
  })
  if (error) {
    console.log(error)
    return { errorMessage: translateError(error.message) }
  }
}
