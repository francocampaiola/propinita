// app/providers.tsx
'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider>{children}</ChakraProvider>
}