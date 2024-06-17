'use client'

import { CircularProgress, Flex, Step, StepIndicator, Stepper, StepSeparator, StepStatus, StepTitle, useSteps } from "@chakra-ui/react"

import UserType from "./steps/UserType"
import UserPersonalData from "./steps/UserPersonalData"
import UserBankData from "./steps/UserBankData"
import Details from "./steps/Details"
import { IoCheckmark } from "react-icons/io5"
import { useState } from "react"

const steps = [
    { title: 'Tipo de usuario', component: UserType },
    { title: 'Datos personales', component: UserPersonalData },
    { title: 'Cuenta bancaria', component: UserBankData },
    { title: 'Detalles', component: Details },
]

export default function Onboarding() {

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    };

    const handleBack = () => {
        setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
    };

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
            <Flex w={'70%'} bg={'#1E1E1E'}>
                <Flex>
                    <StepComponent onNext={handleNext} />
                </Flex>
            </Flex>
        </Flex>
    )
}
