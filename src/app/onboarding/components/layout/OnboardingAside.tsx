'use client'
import BoxColorMode from '@/src/components/BoxColorMode'
import { OnboardingContext } from '@/src/context/OnboardingProvider'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import { Box, Center, Container, Divider, Flex, Spinner, Text } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { IoCheckmark } from 'react-icons/io5'
import { StepStatus } from '@/src/app/onboarding/onboarding.types'

interface OnboardingAsideProps {
  steps: { label: string, number: number }[];
  showSuccess?: boolean;
}

const OnboardingAside = ({ steps, showSuccess }: OnboardingAsideProps) => {
  const context = useContext(OnboardingContext)
  const currentStep = context?.currentStep ?? 'user_type'
  const isLoadingSteps = context?.isLoadingSteps ?? true
  const { user } = useGetUser()

  const getStepIndex = () => {
    const stepsMap: { [key: string]: number } = {
      'user_type': 0,
      'user_personal_data': 1,
      'user_bank_data': 2,
      'user_summary': 3,
      'completed': 4
    }
    return stepsMap[currentStep || 'user_type']
  }

  const currentStepIndex = getStepIndex()

  const isStepCompleted = (idx: number) => {
    if (currentStep === 'completed') {
      return true
    }
    return currentStepIndex > idx
  }

  const isCurrentStep = (idx: number) => {
    if (currentStep === 'completed') {
      return false
    }
    return currentStepIndex === idx
  }

  return (
    <BoxColorMode
      bg={['white', '#111111']}
      color={['black', 'white']}
      width='30%'
      display={{ base: 'none', md: 'block' }}
    >
      <Center flexDirection='column' pt={10} height='100%'>
        <Box fontSize='sm' width='fit-content' margin='0 auto'>
          <Container maxW='sm'>
            {isLoadingSteps ? (
              <Center h="full">
                <Spinner />
              </Center>
            ) : (
              <Flex flexDirection="column">
                {steps.map((step, idx) => (
                  <Flex alignItems="center" key={step.label} mb={4}>
                    <Center
                      mr={4}
                      height="32px"
                      width="32px"
                      borderRadius="50%"
                      zIndex="9"
                      position="relative"
                      border="1px solid gray"
                      bg={isStepCompleted(idx) ? 'green.300' : 'gray.800'}
                    >
                      {idx + 1 !== steps.length && (
                        <Box
                          position="absolute"
                          height="16px"
                          bottom="-55%"
                          left="48%"
                          zIndex="8"
                        >
                          <Divider
                            border="1px solid"
                            color={isStepCompleted(idx) ? 'secondary' : 'gray'}
                            orientation="vertical"
                          />
                        </Box>
                      )}
                      {isStepCompleted(idx) ? (
                        <IoCheckmark color="black" />
                      ) : isCurrentStep(idx) ? (
                        <Spinner size="xs" color="white" />
                      ) : (
                        <Text color="white" fontSize="xs">
                          {step.number}
                        </Text>
                      )}
                    </Center>
                    <Text>{step.label}</Text>
                  </Flex>
                ))}
              </Flex>
            )}
          </Container>
        </Box>
      </Center>
    </BoxColorMode>
  )
}

export default OnboardingAside