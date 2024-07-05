import React from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import Sidebar from '../components/Sidebar'
import { getUserData } from './actions'

export default async function DashboardLayout({
    children
}: {
    children: JSX.Element
}) {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    const userData = await getUserData()

    return (
        <Sidebar userData={userData}>
            {children}
        </Sidebar>
    )
}
