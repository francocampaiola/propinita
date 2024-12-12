import ReactQueryProvider from '@/context/ReactQueryProvider'
import ThemeProvider from '@/context/ThemeProvider'
import { cookies } from 'next/headers'

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
    <html lang='es' data-theme={uiColorMode} style={{ colorScheme: uiColorMode }} suppressHydrationWarning>
      <head>
        <link
          href='https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@200;400;600;700;800&display=swap'
          rel='stylesheet'
        />
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
