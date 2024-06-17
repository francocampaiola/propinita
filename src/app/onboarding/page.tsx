'use client'

import { CircularProgress, Flex, Step, StepIndicator, Stepper, StepSeparator, StepStatus, StepTitle, useSteps } from "@chakra-ui/react"

import UserType from "./steps/UserType"
import UserPersonalData from "./steps/UserPersonalData"
import UserBankData from "./steps/UserBankData"
import Details from "./steps/Details"
import { IoCheckmark } from "react-icons/io5"

export default function Onboarding() {
    const steps = [
        { title: 'Tipo de usuario', component: UserType },
        { title: 'Datos personales', component: UserPersonalData },
        { title: 'Cuenta bancaria', component: UserBankData },
        { title: 'Detalles', component: Details },
    ]

    const { activeStep } = useSteps({
        index: 0,
        count: steps.length,
    })

    const StepComponent = steps[activeStep].component;

    return (
        <Flex justify={'center'} align={'center'} direction={'row'}>
            <Flex w={'30%'} direction={'column'} alignItems={'center'} justifyContent={'center'}>
                <Stepper index={activeStep} colorScheme="yellow" orientation='vertical' height='250px' gap='0'>
                    {steps.map((step, index) => (
                        <Step key={index}>
                            <StepIndicator style={{ borderColor: 'black' }}>
                                <StepStatus
                                    complete={<IoCheckmark color="black" />}
                                    incomplete={<CircularProgress size={25} isIndeterminate color='#B39B24' />}
                                    active={<CircularProgress size={25} isIndeterminate color='#B39B24' />}
                                />
                            </StepIndicator>
                            <Flex flexShrink='0' mt={1}>
                                <StepTitle style={{ color: 'white', fontSize: '1rem' }}>{step.title}</StepTitle>
                            </Flex>
                            <StepSeparator />
                        </Step>
                    ))}
                </Stepper>
            </Flex>
            <Flex w={'70%'} h={'90vh'} bg={'#1E1E1E'}>
                <Flex >
                    <StepComponent />
                </Flex>
            </Flex>
        </Flex>
    )
}
