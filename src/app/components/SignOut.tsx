'use client'

import { signOut } from '../actions'

const SignOut = () => {

    const handleSignOut = async () => {
        await signOut()
        document.cookie = 'supabase-auth-token=; Max-Age=0; path=/;'
    }

    return (
        <button onClick={handleSignOut}>Cerrar sesión</button>
    )
}

export default SignOut