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
    // {
    //     label: 'Tipo de usuario',
    //     number: 1
    // },
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
      <Flex minHeight='calc(100vh - 72px)' width='100%'>
        <OnboardingAside steps={steps} showSuccess={showSuccess} />
        <BoxColorMode
          bg={['white', 'gray.600']}
          color={['black', 'white']}
          flex={1}
          justifyContent={'center'}
          px={16}
        >
          <Flex flex={1} width='100%' p={8} height={{ base: 'auto', md: '100%' }} margin={0}>
            <Center
              alignItems={{ base: 'flex-start', md: 'center' }}
              height='100%'
              mt={{ base: '2', md: '0' }}
              width='100%'
              p={4}
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
