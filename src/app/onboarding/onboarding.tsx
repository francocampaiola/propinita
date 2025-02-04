'use client'
import { useState } from 'react'
import { Box } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { UserData, StepStatus } from './onboarding.types'
import { editUser } from './action'

const UserType = dynamic(() => import('./components/UserType'))
const UserPersonalData = dynamic(() => import('./components/UserPersonalData'))
const UserBankData = dynamic(() => import('./components/UserBankData'))
const UserSummary = dynamic(() => import('./components/UserSummary'))

const steps = {
  user_type: {
    component: UserType,
    next: 'user_personal_data' as StepStatus
  },
  user_personal_data: {
    component: UserPersonalData,
    next: 'user_bank_data' as StepStatus
  },
  user_bank_data: {
    component: UserBankData,
    next: 'user_summary' as StepStatus
  },
  user_summary: {
    component: UserSummary,
    next: null
  }
} as const

const Onboarding = ({ userData }: { userData: UserData }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<StepStatus>(userData.current_step || 'user_type')

  const handleNext = async (data: Partial<UserData>) => {
    setIsLoading(true)
    try {
      console.log(data)
      const nextStep = steps[currentStep].next

      // Verifica si el paso actual es 'user_summary' y establece el estado a 'completed'
      if (currentStep === 'user_summary') {
        await editUser({
          ...data,
          current_step: 'completed' // Cambia a 'completed' al finalizar el resumen
        })
      } else {
        await editUser({
          ...data,
          current_step: nextStep
        })
        if (nextStep) setCurrentStep(nextStep)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <Box width='100%' maxW='800px' mx='auto' p={4}>
      <CurrentStepComponent userData={userData} onNext={handleNext} isLoading={isLoading} />
    </Box>
  )
}

export default Onboarding
