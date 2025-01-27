'use client'
import { useEffect, useState, useTransition } from 'react'
import { Flex, Box, Text, Button, Spinner, Circle } from '@chakra-ui/react'
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa'
import { useForm, FormProvider } from 'react-hook-form'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import type { OnboardingComponent } from '../onboarding.types'

const UserSummary = ({ nextStep }: OnboardingComponent) => {
    const { user } = useGetUser()
    const methods = useForm()
    const [step, setStep] = useState(0)
    const [isLoading, startTransition] = useTransition()

    const action: () => void = methods.handleSubmit(async (data) => {
        const { user_type } = data
        if (!user_type) return

        startTransition(async () => {
            const formData = new FormData()
            formData.append('user_type', user_type)
            await nextStep({ userData: formData })
        })
    })

    useEffect(() => {
        if (!user?.user_type) return
        methods.setValue('user_type', user?.user_type)
    }, [])

    return (
        <Box w={'100%'}>
            {
                step === 0 ? (
                    <>
                        <Text fontWeight='600' fontSize='xl' mb={6} textTransform={'uppercase'}>
                            Paso 4
                        </Text>
                        <Text fontWeight='600' fontSize='2xl' mb={1}>
                            Resumen
                        </Text>
                        <Text fontSize='sm'>
                            Chequeá la información referida a tu cuenta antes de confirmar el envío de datos.
                        </Text>
                        <FormProvider {...methods}>
                            <form action={action}>
                                <Flex direction='column' gap={4} my={4}>
                                    <Flex
                                        wrap='wrap'
                                        gap={4}
                                        justify='space-between'
                                        p={4}
                                        border={'1px solid white'}
                                        borderRadius={15}
                                    >
                                        <Box w='48%'>
                                            <Text fontWeight='600' fontSize='lg'>
                                                Perfil
                                            </Text>
                                            <Text fontSize='sm'>
                                                {methods.watch('user_type') === 'user' ? 'Usuario' : 'Proveedor'}
                                            </Text>
                                        </Box>
                                        <Box w='48%'>
                                            <Text fontWeight='600' fontSize='lg'>
                                                Nacionalidad
                                            </Text>
                                            <Text fontSize='sm'>{user?.nationality}</Text>
                                        </Box>
                                        <Box w='48%'>
                                            <Text fontWeight='600' fontSize='lg'>
                                                Nombre y apellido
                                            </Text>
                                            <Text fontSize='sm'>
                                                {user?.first_name} {user?.last_name}
                                            </Text>
                                        </Box>
                                        <Box w='48%'>
                                            <Text fontWeight='600' fontSize='lg'>
                                                Estado civil
                                            </Text>
                                            <Text fontSize='sm'>{user?.civil_state}</Text>
                                        </Box>
                                        <Box w='48%'>
                                            <Text fontWeight='600' fontSize='lg'>
                                                Teléfono
                                            </Text>
                                            <Text fontSize='sm'>{user?.phone}</Text>
                                        </Box>

                                        <Box w='48%'>
                                            <Text fontWeight='600' fontSize='lg'>
                                                CVU
                                            </Text>
                                            <Text fontSize='sm'>{user?.email}</Text>
                                        </Box>
                                    </Flex>
                                </Flex>
                                <Flex justifyContent='flex-end'>
                                    <Button
                                        variant='secondary'
                                        type='submit'
                                        mt={4}
                                        mr={4}
                                        size='sm'
                                        isDisabled
                                        leftIcon={<FaArrowLeft />}
                                    >
                                        Volver
                                    </Button>
                                    <Button
                                        variant='primary'
                                        type='submit'
                                        mt={4}
                                        size='sm'
                                        isLoading={isLoading}
                                        // TODO: Agregar onclick
                                        // onClick={() => {
                                        //     setStep(1)
                                        // }}
                                        isDisabled={!methods.watch('user_type')}
                                        rightIcon={<FaArrowRight />}
                                    >
                                        Siguiente
                                    </Button>
                                </Flex>
                            </form>
                        </FormProvider>
                    </>
                ) : step === 1 ? (
                    <Flex justifyContent="center" alignItems="center" mx="auto" direction="column">
                        <Circle size="60px" bg="green.500" color="white" mb={4}>
                            <FaCheck size={32} color='white' />
                        </Circle>
                        <Text fontSize={'2xl'} fontWeight={'600'} mb={2}>Registro completado con éxito</Text>
                        <Text>Redirigiendo al dashboard</Text>
                        <Spinner color='primary' borderWidth={4} mt={4} />
                    </Flex>
                ) : null
            }

        </Box>
    )
}

export default UserSummary