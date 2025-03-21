'use client'
import React, { useState, useContext } from 'react'
import dynamic from 'next/dynamic'
import { Box, Flex, Spinner } from '@chakra-ui/react'
import type { UserData, StepStatus } from './onboarding.types'
import { editUser } from './action'
import { OnboardingContext } from '@/src/context/OnboardingProvider'

// Componentes dinámicos
const UserType = dynamic(() => import('./components/UserType'), {
  ssr: false,
  loading: () => <Spinner size='xl' thickness='4px' />
})

const UserPersonalData = dynamic(() => import('./components/UserPersonalData'), {
  ssr: false,
  loading: () => <Spinner size='xl' thickness='4px' />
})

const UserBankData = dynamic(() => import('./components/UserBankData'), {
  ssr: false,
  loading: () => <Spinner size='xl' thickness='4px' />
})

const UserSummary = dynamic(() => import('./components/UserSummary'), {
  ssr: false,
  loading: () => <Spinner size='xl' thickness='4px' />
})

const steps = {
  user_type: {
    component: UserType,
    next: 'user_personal_data' as StepStatus,
    prev: null
  },
  user_personal_data: {
    component: UserPersonalData,
    next: 'user_bank_data' as StepStatus,
    prev: 'user_type' as StepStatus
  },
  user_bank_data: {
    component: UserBankData,
    next: 'user_summary' as StepStatus,
    prev: 'user_personal_data' as StepStatus
  },
  user_summary: {
    component: UserSummary,
    next: null,
    prev: 'user_bank_data' as StepStatus
  }
} as const

const Onboarding = ({ userData }: { userData: UserData }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<StepStatus>(userData.current_step || 'user_type')
  const { setCurrentStep: setContextStep } = useContext(OnboardingContext)

  const handleNext = async (data: Partial<UserData>) => {
    setIsLoading(true)
    try {
      const nextStep = steps[currentStep].next

      // Verifica si el paso actual es 'user_summary' y establece el estado a 'completed'
      if (currentStep === 'user_summary') {
        await editUser({ current_step: 'completed' })
        setContextStep('completed')
      } else if (nextStep) {
        await editUser({ ...data, current_step: nextStep })
        setCurrentStep(nextStep)
        setContextStep(nextStep)
      }
    } catch (error) {
      console.error('Error en handleNext:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrev = async () => {
    setIsLoading(true)
    try {
      const prevStep = steps[currentStep].prev
      if (prevStep) {
        await editUser({ current_step: prevStep })
        setCurrentStep(prevStep)
        setContextStep(prevStep)
      }
    } catch (error) {
      console.error('Error en handlePrev:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const StepComponent = steps[currentStep].component

  return (
    <Box width='100%' p={4}>
      {isLoading ? (
        <Flex justifyContent='center' alignItems='center' minH='300px'>
          <Spinner size='xl' thickness='4px' />
        </Flex>
      ) : (
        <StepComponent 
          userData={userData} 
          onNext={handleNext} 
          onBack={handlePrev}
          isLoading={isLoading} 
        />
      )}
    </Box>
  )
}

export default Onboarding
