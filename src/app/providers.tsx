'use client'

import { ChakraProvider, DarkMode } from '@chakra-ui/react'

export function Providers({ children }: { children: React.ReactNode }) {
    return <ChakraProvider theme={DarkMode}>{children}</ChakraProvider>
}