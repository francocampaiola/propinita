'use client'
import React, { useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import { handleRequest } from '@/src/app/utils/functions'
import { handleToast } from '@/src/utils/toast'
import PasswordConfirmPassword from '@/src/components/form/PasswordConfirmPassword'
import { updatePassword } from '../action'

const RecoveryPassword = () => {
    const [isLoading, startTransition] = useTransition()
    const router = useRouter()
    const searchParams = useSearchParams()
    const accessToken = searchParams.get('code')
    const PasswordSchema = z
        .object({
            password: z
                .string()
                .trim()
                .min(8, 'Mínimo de 8 caracteres')
                .regex(
                    new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
                    'Un carácter especial'
                ),
            confirmPassword: z.string().trim()
        })
        .superRefine((data, customError) => {
            if (data.password !== data.confirmPassword) {
                customError.addIssue({
                    path: ['confirmPassword'],
                    code: z.ZodIssueCode.custom,
                    message: 'Las contraseñas no coinciden'
                })
            }
        })

    const methods = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        resolver: zodResolver(PasswordSchema)
    })

    const action = methods.handleSubmit(async (data) => {
        const { password } = data
        startTransition(async () => {
            const request = await handleRequest(() =>
                updatePassword({ password, token: accessToken })
            )
            if (request.success) {
                handleToast({
                    title: 'Contraseña cambiada correctamente',
                    text: 'Volvé a iniciar sesión con tu nueva contraseña',
                    status: 'success',
                    duration: 5000,
                    isClosable: true
                })
                setTimeout(() => {
                    router.push('/login')
                }, 3000)
            }
        })
    })

    return (
        <FormProvider {...methods}>
            <form onSubmit={action}>
                <Flex direction={'column'} gap={4}>
                    <Box>
                        <Heading fontSize={'2xl'} mb={'2'}>Nueva contraseña</Heading>
                        <Text fontSize={'sm'}>Debido a que recuperaste la misma, te solicitamos que coloques una nueva contraseña.</Text>
                    </Box>
                    <PasswordConfirmPassword
                        methods={methods}
                        newPassword={{
                            inputProps: {
                                name: 'password',
                                label: 'Contraseña',
                                placeholder: 'Contraseña',
                                type: 'password',
                            }
                        }}
                        confirmPassword={{
                            inputProps: {
                                label: 'Confirmar la contraseña',
                                placeholder: 'Confirma la contraseña',
                                type: 'password',
                                name: 'confirmPassword',
                                size: 'lg'
                            }
                        }}
                    />
                    <Button
                        variant='secondary'
                        w='100%'
                        type='submit'
                        isDisabled={!methods?.formState.isValid}
                        isLoading={isLoading}
                    >
                        Continuar
                    </Button>
                </Flex>
            </form>
        </FormProvider>
    )
}

export default RecoveryPassword