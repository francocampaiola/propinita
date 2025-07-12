'use client'
import React, { useContext } from 'react'
import { Box, Flex, Center } from '@chakra-ui/react'
import { OnboardingContext } from '@/src/context/OnboardingProvider'
import OnboardingNavbar from './OnboardingNavbar'
import OnboardingAside from './OnboardingAside'
import BoxColorMode from '@/src/components/BoxColorMode'

interface OnboardingLayoutProps {
  children: React.ReactNode
  showSuccess?: boolean
}

const OnboardingLayout = ({ children, showSuccess }: OnboardingLayoutProps) => {
  const context = useContext(OnboardingContext)
  const isApprovalSteps = context?.isApprovalSteps ?? false
  const steps: { label: string; number: number }[] = [
    {
      label: 'Datos personales',
      number: 1
    },
    {
      label: 'Cuenta bancaria',
      number: 2
    },
    {
      label: 'Resumen',
      number: 3
    }
  ]

  return (
    <>
      <OnboardingNavbar steps={isApprovalSteps ? steps.slice(0, steps.length - 1) : steps} />
      {/* Guarda animada de emojis de dinero */}
      <Box width='100%'>
        <div className='money-banner'>
          <div className='money-banner__inner'>
            <span className='emoji-row'>
              {Array.from({ length: 30 }).map((_, i) => {
                const emojis = ['💸', '💰', '🤑', '💵', '💲', '💳']
                return (
                  <span className='emoji' key={i}>
                    {emojis[i % emojis.length]}
                  </span>
                )
              })}
            </span>
            <span className='emoji-row'>
              {Array.from({ length: 30 }).map((_, i) => {
                const emojis = ['💸', '💰', '🤑', '💵', '💲', '💳']
                return (
                  <span className='emoji' key={i}>
                    {emojis[i % emojis.length]}
                  </span>
                )
              })}
            </span>
          </div>
        </div>
      </Box>
      <Flex
        minHeight={{ base: 'calc(100vh - 124px)', md: 'calc(100vh - 72px)' }}
        height={{ base: '100vh', md: 'auto' }}
        width='100%'
        overflow={{ base: 'hidden', md: 'hidden' }}
        position={{ base: 'relative', md: 'fixed' }}
        top={{ base: 0, md: '98px' }}
        left={0}
        right={0}
        bottom={0}
      >
        <OnboardingAside steps={steps} showSuccess={showSuccess} />
        <BoxColorMode
          bg={['white', 'gray.600']}
          color={['black', 'white']}
          flex={1}
          justifyContent={'center'}
          px={{ base: 4, sm: 8, md: 16 }}
          overflow='hidden'
          height='100%'
          position='relative'
        >
          <Flex
            flex={1}
            width='100%'
            p={{ base: 4, sm: 6, md: 8 }}
            height='100%'
            margin={0}
            overflow='hidden'
            position='relative'
          >
            <Center
              alignItems={{ base: 'flex-start', md: 'center' }}
              height='100%'
              mt={{ base: '2', md: '0' }}
              width='100%'
              p={{ base: 2, sm: 3, md: 4 }}
              overflow='auto'
              position='relative'
              maxHeight={{ base: 'calc(100vh - 124px)', md: 'calc(100vh - 98px)' }}
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none' // IE y Edge
              }}
              className='hide-scrollbar'
            >
              {children}
            </Center>
          </Flex>
        </BoxColorMode>
      </Flex>
    </>
  )
}

export default OnboardingLayout
