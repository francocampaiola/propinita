'use client'
import React, { createContext, useState, useEffect } from 'react'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import { StepStatus } from '@/src/app/onboarding/onboarding.types'

interface OnboardingContextType {
  currentStep: StepStatus | null
  setCurrentStep: (step: StepStatus) => void
  isApprovalSteps: boolean
  setIsApprovalSteps: (value: boolean) => void
  isLoadingSteps: boolean
  setIsLoadingSteps: (value: boolean) => void
}

const OnboardingContext = createContext<OnboardingContextType>(null!)

const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useGetUser()
  const [currentStep, setCurrentStep] = useState<StepStatus | null>(null)
  const [isLoadingSteps, setIsLoadingSteps] = useState(true)
  const [isApprovalSteps, setIsApprovalSteps] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (user?.current_step) {
        setCurrentStep(user.current_step as StepStatus)
      } else {
        setCurrentStep('user_type')
      }
      setIsLoadingSteps(false)
    }
  }, [user, isLoading])

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        isApprovalSteps,
        setIsApprovalSteps,
        isLoadingSteps,
        setIsLoadingSteps
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export { OnboardingProvider, OnboardingContext }
