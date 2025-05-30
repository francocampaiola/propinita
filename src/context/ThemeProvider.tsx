'use client'
import React from 'react'
import {
  ChakraProvider,
  extendTheme,
  StyleFunctionProps
} from '@chakra-ui/react'
import { cookieStorageManager } from '@chakra-ui/react'
import theme from '../styles/themes/theme'
import { mode } from '@chakra-ui/theme-tools'

const ThemeProvider = ({
  children,
  colorMode
}: {
  children: React.ReactNode
  colorMode: 'light' | 'dark'
}) => {
  const customTheme = extendTheme({
    ...theme,
    config: {
      initialColorMode: colorMode,
      useSystemColorMode: false
    },
    styles: {
      global: (props: StyleFunctionProps) => ({
        body: {
          bg: mode('#ffffff', '#000000')(props),
          color: mode('#000000', '#ffffff')(props)
        }
      })
    }
  })

  return (
    <ChakraProvider
      colorModeManager={cookieStorageManager}
      theme={customTheme}
      resetCSS
    >
      {children}
    </ChakraProvider>
  )
}

export default ThemeProvider
