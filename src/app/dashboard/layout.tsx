import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '../components/Sidebar'

export default async function DashboardLayout( {
    children
 } : {
    children: JSX.Element

}) {

    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    return (
        <Sidebar>
            {children}
        </Sidebar>
    )
}
