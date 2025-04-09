'use client'
import React, { createContext, useState, useEffect } from 'react'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import { StepStatus } from '@/src/app/onboarding/onboarding.types'
import { usePathname } from 'next/navigation'

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
  const { user, isLoading, refetch } = useGetUser()
  const [currentStep, setCurrentStep] = useState<StepStatus | null>(null)
  const [isLoadingSteps, setIsLoadingSteps] = useState(true)
  const [isApprovalSteps, setIsApprovalSteps] = useState(false)
  const pathname = usePathname()

  // Actualizar el paso actual cuando cambia el usuario
  useEffect(() => {
    if (!isLoading && user?.user_signup_status) {
      setCurrentStep(user.user_signup_status as StepStatus)
      setIsLoadingSteps(false)
    }
  }, [user, isLoading])

  // Refetch cuando cambia la ruta
  useEffect(() => {
    refetch()
  }, [pathname, refetch])

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
