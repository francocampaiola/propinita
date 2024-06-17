import { cookies } from "next/headers"
import { Database } from "../../../database.types"
import { createClient } from "@/utils/supabase/server"

export const getUserData = async (): Promise<
  Database['public']['Tables']['users']['Row']
> => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user }
  } = await supabase.auth.getUser()

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('fk_user', user.id)
  return data[0]
}