'use client'
import { Box, Spinner } from '@chakra-ui/react'
import { useContext, useEffect, useState, useMemo } from 'react'
import { OnboardingContext } from '@/src/context/OnboardingProvider'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import UserType from './components/UserType'
import { SignupStatus } from '../types'

const Onboarding = () => {
    const { currentStep, setCurrentStep, setIsLoadingSteps } = useContext(OnboardingContext)
    const { user, isLoading } = useGetUser()

    // Fix #1: Move `if (isLoading)` after all hooks
    const [stepIndex, setStepIndex] = useState(currentStep)

    // Fix #2: Wrap `steps` in `useMemo` so it doesn't recreate on each render
    const steps = useMemo(() => [
        {
            component: <UserType nextStep={nextStep} />,
            signup_status: 'user_type'
        }
    ], [])

    useEffect(() => {
        if (user?.user_signup_status) {
            const idx = steps.findIndex((step) => step.signup_status === user.user_signup_status)
            setCurrentStep(idx)
            setIsLoadingSteps(false)
        }
    }, [user, setCurrentStep, setIsLoadingSteps, steps])

    // Fix #1: Ensure all hooks are called before an early return
    if (isLoading) {
        return <Spinner />
    }

    const nextStep = ({ userData }: { userData: any }): Promise<void> => {
        return new Promise((resolve) => {
            if (currentStep + 1 < steps.length) {
                setCurrentStep((step: number) => step + 1)
            }
            resolve()
        })
    }

    const prevStep = () => {
        if (stepIndex > 0) {
            setStepIndex((prev: number) => prev - 1)
        }
    }

    return (
        <Box>
            {steps[stepIndex].component}
        </Box>
    )
}

export default Onboarding