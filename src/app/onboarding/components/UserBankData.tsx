'use client'
import React, { useEffect, useTransition } from 'react'
import { Flex, Box, Text, Button } from '@chakra-ui/react'
import BoxColorMode from '@/src/components/BoxColorMode'
import { useForm, FormProvider } from 'react-hook-form'
import type { OnboardingComponent } from '../onboarding.types'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import { UserType as UserTypes } from '../../types'
import MercadoPagoLogo from '@/src/assets/onboarding/user_bank_data/mercadopago.png'
import Image from 'next/image'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

interface IUserTypeOption {
    title: string
    description: string
    value: UserTypes
    image: string
}

const UserBankData = ({ nextStep }: OnboardingComponent) => {
    const { user } = useGetUser()
    const methods = useForm()
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
            <Text fontWeight='600' fontSize='xl' mb={6} textTransform={'uppercase'}>Paso 3</Text>
            <Text fontWeight='600' fontSize='2xl' mb={1}>Cuenta bancaria</Text>
            <Text fontSize='sm'>Vinculá tu cuenta con MercadoPago para recibir o realizar tus pagos.</Text>
            <FormProvider {...methods}>
                <form action={action}>
                    <Flex direction='column' gap={4} my={4}>
                        <BoxColorMode bg={['primary', 'transparent']} borderRadius='md'>
                            <Box
                                as='button'
                                type='button'
                                //   onClick={() => methods.setValue('user_type', option.value)}
                                display='flex'
                                alignItems='center'
                                py={4}
                                px={6}
                                width='100%'
                                cursor='pointer'
                                border={'1px solid white'}
                                borderRadius={15}
                                textAlign={'left'}
                            >
                                <Image src={MercadoPagoLogo} alt={'MercadoPago'} width={50} height={50} />
                                <Box ml={4}>
                                    <Text fontSize='lg' fontWeight='600'>MercadoPago</Text>
                                    <Text color='#D2D2D2' fontSize='xs'>Vinculamos tu cuenta bancaria con un cifrado de extremo a extremo para facilitar el pago y recepción de tus propinas.</Text>
                                </Box>
                            </Box>
                        </BoxColorMode>
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
                            isDisabled={!methods.watch('user_type')}
                            rightIcon={<FaArrowRight />}
                        >
                            Siguiente
                        </Button>
                    </Flex>
                </form>
            </FormProvider>
        </Box>
    )
}

export default UserBankData