'use client'
import BoxColorMode from '@/src/components/BoxColorMode'
import { OnboardingContext } from '@/src/context/OnboardingProvider'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import { Box, Center, CircularProgress, Container, Divider, Flex, Text } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { IoCheckmark } from 'react-icons/io5'

const OnboardingAside = ({ steps }: { steps: { label: string, number: number }[] }) => {
  const { currentStep } = useContext(OnboardingContext)
  const { user, isLoading } = useGetUser()

  const getStepCompletion = () => {
    if (!user?.user_signup_status) return -1

    const stepsMap: { [key: string]: number } = {
      'user_type': 0,
      'user_personal_data': 1,
      'user_bank_data': 2,
      'user_summary': 3
    }

    const stepIndex = stepsMap[user.user_signup_status] || -1
    return stepIndex
  }

  const completedSteps = getStepCompletion()

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
            {isLoading ? (
              <Center>
                <CircularProgress
                  size='32px'
                  color='aquamarine'
                  isIndeterminate
                  thickness='8px'
                />
              </Center>
            ) : (
              <Flex flexDirection='column'>
                {steps.map((step, idx: number) => (
                  <Flex alignItems='center' key={step.label} mb={4}>
                    <Center
                      mr={4}
                      height='32px'
                      width='32px'
                      borderRadius='50%'
                      zIndex='9'
                      position='relative'
                      border='1px solid gray'
                      bg={completedSteps > idx ? 'green.300' : 'gray.800'}
                    >
                      {idx + 1 !== steps.length && (
                        <Box
                          position='absolute'
                          height='16px'
                          bottom='-55%'
                          left='48%'
                          zIndex='8'
                        >
                          <Divider
                            border='1px solid'
                            color={completedSteps > idx ? 'secondary' : 'gray'}
                            orientation='vertical'
                          />
                        </Box>
                      )}
                      {idx < completedSteps ? (
                        <IoCheckmark color='black' />
                      ) : idx === currentStep ? (
                        <CircularProgress
                          size='18px'
                          color='primary'
                          isIndeterminate
                          thickness='8px'
                        />
                      ) : (
                        <Text color='white' fontSize='xs'>
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