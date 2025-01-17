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
  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.log(error)
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
          <Image src={fullLogo} width={120} alt='Logo de megapix' />
          <Text fontSize={'xl'}>| Empecemos</Text>
        </Flex>
        <Box>
          <Button onClick={handleLogout} variant='icon'>
            <FiLogOut />
          </Button>
        </Box>
      </Flex>
      {/* Navbar Mobile */}
      <BoxColorMode p={4} display={{ base: 'block', md: 'none' }}>
        <Text mb={4}>{steps[currentStep - 1]?.label ? steps[currentStep - 1]?.label : null}</Text>
        <Flex>
          {steps.map((step, idx) => (
            <Box
              key={step.label}
              height='6px'
              width='100%'
              borderRadius='md'
              mr={idx + 1 !== steps.length && 1}
              background={currentStep > idx ? 'primary' : 'gray'}
            />
          ))}
        </Flex>
      </BoxColorMode>
    </>
  )
}

export default OnboardingNavbar
