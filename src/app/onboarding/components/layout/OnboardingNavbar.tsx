'use client'
import React, { useContext } from 'react'
import { Box, Flex, Text, Button } from '@chakra-ui/react'
import Image from 'next/image'
import { OnboardingContext } from '@/src/context/OnboardingProvider'
import fullLogo from '@/src/assets/logo.svg'
import { FiLogOut } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { logout } from '@/src/app/action'
import BoxColorMode from '@/src/components/BoxColorMode'

const OnboardingNavbar = ({ steps }: { steps: { label: string }[] }) => {
  const { currentStep } = useContext(OnboardingContext)
  const router = useRouter()

  const getCurrentStepIndex = (step: string | null): number => {
    if (!step) return 0
    const stepMap: Record<string, number> = {
      'user-type': 0,
      'personal-data': 1,
      'bank-data': 2,
      summary: 3,
      completed: 4
    }
    return stepMap[step] || 0
  }

  const currentStepIndex = getCurrentStepIndex(currentStep)

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      throw error
    }
  }

  return (
    <>
      {/* Navbar Desktop */}
      <Flex
        display={{ base: 'flex', md: 'flex' }}
        py={4}
        px={{ base: 8, md: 10 }}
        justifyContent='space-between'
        backgroundColor='#111111'
      >
        <Flex alignItems='center' gap={4}>
          <Image src={fullLogo} width={120} alt='Logo de propinita' />
          <Text
            fontSize={'xl'}
            display={{
              base: 'none',
              md: 'block'
            }}
          >
            | Empecemos
          </Text>
        </Flex>
        <Box>
          <Button onClick={handleLogout} variant='icon'>
            <FiLogOut />
          </Button>
        </Box>
      </Flex>
      {/* Navbar Mobile - Completamente oculto */}
      <BoxColorMode p={4} display='none'>
        <Text mb={4}>{steps[currentStepIndex]?.label || null}</Text>
        <Flex>
          {steps.map((step, idx) => (
            <Box
              key={step.label}
              height='6px'
              width='100%'
              borderRadius='md'
              mr={idx + 1 !== steps.length && 1}
              background={currentStepIndex > idx ? 'primary' : 'gray'}
            />
          ))}
        </Flex>
      </BoxColorMode>
    </>
  )
}

export default OnboardingNavbar
