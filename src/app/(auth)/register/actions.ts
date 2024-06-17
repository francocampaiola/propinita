'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function signup(formData: FormData) {
    const cookiesStore = cookies()
    const supabase = createClient(cookiesStore)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
        console.error('Error during sign up:', signUpError)
        redirect('/error')
    }

    const user = signUpData?.user
    if (!user) {
        console.error('No user data returned from sign up')
        redirect('/error')
    }

    const { error: insertError } = await supabase
        .from('users')
        .insert({
            fk_user: user.id,
            email: email,
            fk_role: 3,
            is_active: true,
            created_at: new Date().toISOString()
        })
        .single()

    if (insertError) {
        console.error('Error during inserting user data:', insertError)
        redirect('/error')
    }

    console.log('User data inserted successfully:', user.id)
    revalidatePath('/', 'layout')
    redirect('/')
}
