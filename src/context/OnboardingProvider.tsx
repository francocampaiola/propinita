'use client'
import React, { createContext, useState } from 'react'
const OnboardingContext = createContext(null)
const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(null)
  const [isLoadingSteps, setIsLoadingSteps] = useState(true)
  const [isApprovalSteps, setIsApprovalSteps] = useState(null)
  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        isApprovalSteps,
        setIsApprovalSteps,
        isLoadingSteps, setIsLoadingSteps
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export { OnboardingProvider, OnboardingContext }
