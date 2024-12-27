import { Poppins } from 'next/font/google'
import ReactQueryProvider from '../context/ReactQueryProvider'
import ThemeProvider from '../context/ThemeProvider'
import { cookies } from 'next/headers'
import '@/src/styles/globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '400', '600', '700', '800'],
  display: 'swap',
})

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
      </head>
      <body>
        <ThemeProvider colorMode={uiColorMode}>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}