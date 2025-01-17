'use client'
import { OnboardingContext, OnboardingProvider } from '@/src/context/OnboardingProvider'
import React, { useContext } from 'react'
import OnboardingNavbar from './OnboardingNavbar'

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <OnboardingProvider>
            <OnboardingContainer>
                {children}
            </OnboardingContainer>
        </OnboardingProvider>
    )
}

const OnboardingContainer = ({ children }: { children: React.ReactNode }) => {
    const { isApprovalSteps } = useContext(OnboardingContext)
    const steps: { label: string, number: number }[] = [
        {
            label: 'Tipo de usuario',
            number: 1
        },
        {
            label: 'Datos personales',
            number: 2
        },
        {
            label: 'Cuenta bancaria',
            number: 3
        },
        {
            label: 'Resumen',
            number: 4
        }
    ]

    return (
        <>
            <OnboardingNavbar
                steps={
                    isApprovalSteps ? steps.slice(0, steps.length - 1) : steps
                }
            />
        </>
    )
}

export default OnboardingLayout