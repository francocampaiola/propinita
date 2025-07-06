import { Poppins } from 'next/font/google'
import ReactQueryProvider from '../context/ReactQueryProvider'
import ThemeProvider from '../context/ThemeProvider'
import { cookies } from 'next/headers'
import '@/src/styles/globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '400', '600', '700', '800'],
  display: 'swap'
})

export const metadata = {
  title: 'propinita | chau efectivo, hola gratitud',
  description:
    'La forma más fácil y digital de dar y recibir propinas. Olvidate del efectivo, agradecé con un click.',
  keywords: 'propinas, digital, agradecimiento, pagos, fintech, efectivo',
  authors: [{ name: 'Equipo Propinita' }],
  creator: 'Propinita',
  publisher: 'Propinita',
  openGraph: {
    title: 'propinita | chau efectivo, hola gratitud',
    description: 'La app que te permite dar y recibir propinas de manera digital, simple y segura.',
    url: 'https://propinita.app',
    siteName: 'Propinita',
    locale: 'es_AR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'propinita | chau efectivo, hola gratitud',
    description: 'La app que te permite dar y recibir propinas de manera digital, simple y segura.'
  },
  robots: {
    index: true,
    follow: true
  }
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = cookies()
  const defaultTheme = 'dark'
  const uiColorMode =
    ((await cookieStore).get('chakra-ui-color-mode')?.value as 'light' | 'dark') || defaultTheme

  return (
    <html
      lang='es'
      data-theme={uiColorMode}
      style={{ colorScheme: uiColorMode }}
      suppressHydrationWarning
      className={poppins.className}
    >
      <head>
        <link rel='icon' href='/favicon.png' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
        />
      </head>
      <body>
        <ThemeProvider colorMode={uiColorMode}>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
