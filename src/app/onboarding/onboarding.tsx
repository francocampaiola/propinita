'use client'
import React, { useEffect, useContext, useTransition } from 'react'
import { OnboardingContext } from '@/src/context/OnboardingProvider'
import { Box, Flex, Spinner } from '@chakra-ui/react'
import { SignupStatus } from '../types'
// import { editCompany } from '../action'
// import { editUser } from '../dashboard/usuarios/actions'
import { handleRequest } from '@/src/app/utils/functions'
/* hooks */
import { useGetUser } from '@/src/hooks/users/useGetUser'
/* components */
import UserType from './components/UserType'
import UserPersonalData from './components/UserPersonalData'
import UserBankData from './components/UserBankData'
import UserSummary from './components/UserSummary'
// import UserRegulations from './components/UserRegulations'
// import UserCompanyData from './components/UserCompanyData'
// import UserBankData from './components/UserBankData'
// import UserDocuments from './components/UserDocuments'
// import UserRevisionInternal from './components/UserRevisionInternal'
// import UserRevisionManteca from './components/UserRevisionManteca'
const Onboarding = () => {

    const { currentStep, setCurrentStep, isApprovalSteps, setIsApprovalSteps, setIsLoadingSteps } =
        useContext(OnboardingContext)

    const { user, refetch: refetchUser } = useGetUser()
    const [loadingPrevStep, setTransition] = useTransition()

    useEffect(() => {
        if (!user || !user.user_signup_status) return
        const idx = steps.findIndex((step) => step.signup_status === user.user_signup_status)
        setCurrentStep(idx)
        setIsLoadingSteps(false)
    }, [user?.user_signup_status])

    const nextStep = async ({
        companyData,
        userData
    }: {
        companyData?: FormData
        userData?: FormData
    }) => {
        if (currentStep + 1 === steps.length) return
        setCurrentStep((step: number) => step + 1)
    }

    const prevStep = async () => {
        // if (currentStep === 0) return
        // setTransition(async () => {
        //   const userFormData = new FormData()
        //   userFormData.append('signup_place_status', steps[currentStep - 1].signup_place_status)
        //   const request = await handleRequest(() => editUser({ id: user?.id, data: userFormData }))
        //   if (request.success) {
        //     await refetchUser()
        //     setCurrentStep((step: number) => step - 1)
        //   }
        // })
    }

    const steps: {
        component: React.ReactElement
        signup_status: SignupStatus
    }[] = [
            {
                component: <UserType nextStep={nextStep} />,
                signup_status: 'user_type'
            },
            {
                component: <UserPersonalData nextStep={nextStep} />,
                signup_status: 'user_personal_data'
            },
            {
                component: <UserBankData nextStep={nextStep} />,
                signup_status: 'user_bank_data'
            },
            {
                component: <UserSummary nextStep={nextStep} />,
                signup_status: 'user_summary'
            }
        ]

    return (
        <Box width='100%'>
            {currentStep === null ? (
                <Flex justifyContent={'center'} alignItems={'center'} mx={'auto'}>
                    <Spinner />
                </Flex>
            ) : (
                steps[currentStep].component
            )}
        </Box>
    )
}

export default Onboarding
