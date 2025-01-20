'use client'
import { OnboardingContext } from '@/src/context/OnboardingProvider'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import React, { useContext, useTransition } from 'react'
import { SignupStatus } from '../types'
import UserType from './components/UserType'
import { Box, Spinner } from '@chakra-ui/react'

const Onboarding = () => {
    const { currentStep, setCurrentStep, isApprovalSteps, setIsApprovalSteps, setIsLoadingSteps } = useContext(OnboardingContext)
    const { user, refetch: refetchUser } = useGetUser()
    const [loadingPrevStep, setTransition] = useTransition()

    const nextStep = async ({
        userData
    }: {
        userData: any
    }) => {
        if (currentStep + 1 === steps.length) return

    }

    const steps: {
        component: React.ReactElement,
        signup_status: SignupStatus
    }[] = [
            {
                component: <UserType nextStep={nextStep} />,
                signup_status: 'user_type'
            }
            // ,
            // {
            //     component: <UserPersonalData nextStep={nextStep} />,
            //     signup_status: 'user_personal_data'
            // },
            // {
            //     component: <UserBankData nextStep={nextStep} />,
            //     signup_status: 'user_bank_data'
            // },
            // {
            //     component: <UserSummary nextStep={nextStep} />,
            //     signup_status: 'user_summary'
            // }
        ]

    return (
        <Box width='100%'>
            {currentStep === null ? (
                <Spinner />
            ) : (
                steps[currentStep].component
            )}
        </Box>
    )
}

export default Onboarding