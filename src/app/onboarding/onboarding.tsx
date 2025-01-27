'use client'
import React, { useContext, useEffect, useTransition } from 'react'
import { OnboardingContext } from '@/src/context/OnboardingProvider'
import { Box, Flex, Spinner } from '@chakra-ui/react'
import type { Onboarding } from './onboarding.types'
import type { SignupStatus } from '../types'
import dynamic from 'next/dynamic'
import { editUser } from './action'

const UserType = dynamic(() => import('./components/UserType'), {
    ssr: false,
    loading: () => <>Cargando...</>
})
const UserPersonalData = dynamic(
    () => import('./components/UserPersonalData'),
    {
        ssr: false,
        loading: () => <>Cargando...</>
    }
)
const UserBankData = dynamic(() => import('./components/UserBankData'), {
    ssr: false,
    loading: () => <>Cargando...</>
})

const Onboarding = ({ userData }: { userData: Onboarding }) => {
    const { currentStep, setCurrentStep } =
        useContext(OnboardingContext)
    const { user_data } = userData

    const [loadingPrevStep, setTransition] = useTransition()
    const nextStep = async ({
        userData
    }: {
        userData?: any
    }): Promise<void> => {
        if (currentStep + 1 === steps.length) return
        try {
            await editUser(
                userData
                    ? {
                        ...userData,
                        signup_status: steps[currentStep + 1].signup_status
                    }
                    : { signup_status: steps[currentStep + 1].signup_status }
            )
            setCurrentStep((step: number) => step + 1)
        } catch (error) {
            console.log(error)
        }
    }

    const prevStep = async () => {
        // if (currentStep === 0) return
        // setTransition(async () => {
        //   try {
        //     await editAdmin({
        //       signup_status: steps[currentStep - 1].signup_status
        //     })
        //     await editUserRawData({
        //       admin_data: {
        //         ...admin_data,
        //         signup_status: steps[currentStep - 1].signup_status
        //       }
        //     })
        //     setCurrentStep((step: number) => step - 1)
        //   } catch (error) {
        //     console.log(error)
        //   }
        // })
    }

    const steps: {
        component: React.ReactElement
        signup_status: SignupStatus
    }[] = [
            {
                component: <UserType userData={userData} nextStep={nextStep} />,
                signup_status: 'user_type' as SignupStatus
            },
            {
                component: (
                    <UserPersonalData
                        nextStep={nextStep}
                        prevStep={prevStep}
                        loadingPrevStep={loadingPrevStep}
                        userData={userData}
                    />
                ),
                signup_status: 'user_personal_data' as SignupStatus
            },
            {
                component: (
                    <UserBankData
                        prevStep={prevStep}
                        loadingPrevStep={loadingPrevStep}
                        nextStep={nextStep}
                        userData={userData}
                    />
                ),
                signup_status: 'user_bank_data' as SignupStatus
            }
        ]

    /* setea el step dependiendo del signup_status */
    useEffect(() => {
        if (!user_data?.signup_status) {
            setCurrentStep(0)
        } else {
            const stepIdx = steps.findIndex(
                (el: any) => el.signup_status === user_data?.signup_status
            )
            setCurrentStep(stepIdx)
        }
    }, [])

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
