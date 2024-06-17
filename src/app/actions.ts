'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function signOut() {
    
    const cookiesStore = cookies()
    const supabase = createClient(cookiesStore)
    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Error signing out:', error.message)
        return
    }
  
    redirect('/login')
}
