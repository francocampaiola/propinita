'use client'
import { useContext } from 'react'
import { OnboardingContext, OnboardingProvider } from '@/src/context/OnboardingProvider'
import OnboardingNavbar from './OnboardingNavbar'
import OnboardingAside from './OnboardingAside'
import { Box, Center, Container, Flex } from '@chakra-ui/react'
import BoxColorMode from '@/src/components/BoxColorMode'

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <OnboardingProvider>
            <OnboardingContainer>{children}</OnboardingContainer>
        </OnboardingProvider>
    )
}

const OnboardingContainer = ({ children }: { children: React.ReactNode }) => {
    const { isApprovalSteps } = useContext(OnboardingContext)
    const steps: { label: string; number: number }[] = [
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
            <OnboardingNavbar steps={isApprovalSteps ? steps.slice(0, steps.length - 1) : steps} />
            <Flex minHeight='calc(100vh - 72px)' width='100%'>
                <OnboardingAside steps={steps} />
                <Box
                    bg={['white', '#111111']}
                    color={['black', 'white']}
                    width={'100%'
                    }
                >
                    <Container width='100%' height={{ base: 'auto', md: '100%' }} margin={0}>
                        <Center
                            width='100%'
                            alignItems={{ base: 'flex-start', md: 'center' }}
                            height='100%'
                            mt={{ base: '2', md: '0' }}
                        >
                            {children}
                        </Center>
                    </Container>
                </Box>
            </Flex>
        </>
    )
}

export default OnboardingLayout
