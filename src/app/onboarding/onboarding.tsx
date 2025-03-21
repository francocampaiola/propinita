'use client'
import React, { useState, useContext, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Box, Flex, Spinner, Circle, Text, useToast, Center } from '@chakra-ui/react'
import type { UserData, StepStatus } from './onboarding.types'
import { editUser } from './action'
import { OnboardingContext } from '@/src/context/OnboardingProvider'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import { useRouter } from 'next/navigation'
import { FaCheck } from 'react-icons/fa'
import OnboardingLayout from './components/layout/OnboardingLayout'

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

const steps: Record<StepStatus, {
  component: React.ComponentType<any>;
  next: StepStatus | null;
  prev: StepStatus | null;
}> = {
  user_type: {
    component: UserType,
    next: 'user_personal_data',
    prev: null
  },
  user_personal_data: {
    component: UserPersonalData,
    next: 'user_bank_data',
    prev: 'user_type'
  },
  user_bank_data: {
    component: UserBankData,
    next: 'user_summary',
    prev: 'user_personal_data'
  },
  user_summary: {
    component: UserSummary,
    next: null,
    prev: 'user_bank_data'
  },
  completed: {
    component: UserSummary,
    next: null,
    prev: null
  }
}

const Onboarding = ({ userData }: { userData: UserData }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBack, setIsLoadingBack] = useState(false)
  const { user } = useGetUser()
  const { setCurrentStep: setContextStep } = useContext(OnboardingContext)
  const [currentStep, setCurrentStep] = useState<StepStatus>(userData.current_step || 'user_type')
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()
  const toast = useToast()

  // Sincronizar el estado local con el contexto y el usuario
  useEffect(() => {
    if (user?.user_signup_status) {
      setCurrentStep(user.user_signup_status as StepStatus)
      setContextStep(user.user_signup_status as StepStatus)
    }
  }, [user, setContextStep])

  const handleNext = async (data: any) => {
    try {
      setIsLoading(true)
      const nextStep = steps[currentStep].next

      // Verifica si el paso actual es 'user_summary' y establece el estado a 'completed'
      if (currentStep === 'user_summary') {
        await editUser({ ...data, current_step: 'completed' })
        setCurrentStep('completed')
        setContextStep('completed')
        setShowSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else if (nextStep) {
        await editUser({ ...data, current_step: nextStep })
        setCurrentStep(nextStep)
        setContextStep(nextStep)
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Hubo un error al actualizar tus datos. Por favor, intenta nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = async () => {
    try {
      setIsLoadingBack(true)
      const prevStep = steps[currentStep].prev
      if (prevStep) {
        await editUser({ current_step: prevStep })
        setCurrentStep(prevStep)
        setContextStep(prevStep)
      }
    } catch (error) {
      console.error('Error en handleBack:', error)
      toast({
        title: 'Error',
        description: 'Hubo un error al volver al paso anterior. Por favor, intenta nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoadingBack(false)
    }
  }

  const StepComponent = steps[currentStep]?.component

  if (!StepComponent) {
    return (
      <OnboardingLayout showSuccess={showSuccess}>
        <Box width='100%' p={4}>
          <Center>
            <Spinner size='xl' thickness='4px' />
          </Center>
        </Box>
      </OnboardingLayout>
    )
  }

  return (
    <OnboardingLayout showSuccess={showSuccess}>
      <Box width='100%' p={4}>
        {showSuccess ? (
          <Flex justifyContent='center' alignItems='center' mx='auto' direction='column'>
            <Circle size='60px' bg='green.500' color='white' mb={4}>
              <FaCheck size={32} color='white' />
            </Circle>
            <Text fontSize={'2xl'} fontWeight={'600'} mb={2}>
              Registro completado con éxito
            </Text>
            <Text>Redirigiendo al dashboard</Text>
            <Spinner color='primary' borderWidth={4} mt={4} />
          </Flex>
        ) : (
          <StepComponent 
            userData={userData}
            onNext={handleNext}
            onBack={handleBack}
            isLoading={isLoading}
            isLoadingBack={isLoadingBack}
          />
        )}
      </Box>
    </OnboardingLayout>
  )
}

export default Onboarding
