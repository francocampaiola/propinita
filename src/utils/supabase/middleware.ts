import { getUserData } from '@/src/app/dashboard/action'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        }
      }
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  /* TODO: Se comenta temporalmente el código referido al usuario autenticado */

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/recuperar') && 
    !request.nextUrl.pathname.startsWith('/nueva_clave')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si el usuario ya está logueado e intenta ingresar al login, lo redirigimos al home
  if (user && request.nextUrl.pathname.startsWith('/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  if (user) {
    try {
      const userData = await getUserData()
      /* si el registro de userData no existe en la base de datos o no terminó el onboarding lo redirige a /onboarding */
      if (
        (!userData || userData?.user_signup_status !== 'completed') &&
        request.nextUrl.pathname !== '/onboarding'
      ) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      } else {
        /* si el usuario ya pasó el onboarding e intenta ingresar a /login | /onboarding se redirige a /dashboard */
        if (
          userData?.user_signup_status === 'completed' &&
          !request.nextUrl.pathname.includes('dashboard')
        ) {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
