import React, { useTransition } from 'react'
import { Button, Box, Text, Flex } from '@chakra-ui/react'
import Input from '@/src/components/form/Input'
import { z } from 'zod'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import PasswordConfirmPassword from '@/src/components/form/PasswordConfirmPassword'
import { handleRequest } from '../../utils/functions'
import { useRouter } from 'next/navigation'
import { register } from '../action'
import Checkbox from '@/src/components/form/Checkbox'
import { handleToast } from '@/src/utils/toast'

const RegisterForm = () => {

    const [isLoading, startTransition] = useTransition()
    const router = useRouter()

    const PasswordSchema = z
        .object({
            email: z.string().trim().email('Email inválido').max(100),
            password: z
                .string()
                .trim()
                .min(8, 'Mínimo de 8 caracteres')
                .regex(
                    new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
                    'Un carácter especial'
                ),
            confirmPassword: z.string().trim(),
            terms_conditions: z.boolean().refine((value) => value === true, {
                message: 'Debes aceptar los términos y condiciones antes de continuar'
            })
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
        const { email, password } = data
        startTransition(async () => {
            const request = await handleRequest(() =>
                register({
                    email,
                    password
                })
            )
            if (request.success) {
                handleToast({
                    title: 'Cuenta creada con éxito',
                    text: 'Confirmá tu correo electrónico para continuar',
                    status: 'success',
                    duration: 5000,
                    isClosable: true
                })
                setTimeout(() => {
                    location.reload()
                }, 3000)
            }
        })
    })

    const formErrors = methods.formState.errors

    return (
        <FormProvider {...methods}>
            <form onSubmit={action}>
                <Flex direction={'column'} gap={4}>
                    <Flex>
                        <Input
                            placeholder='Correo electrónico'
                            label='E-mail'
                            name='email'
                            id='email'
                            size='lg'
                        />
                    </Flex>
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
                    <Flex>
                        <Box mb={4} position={{ base: 'static', md: 'relative' }}>
                            <Flex fontSize={{ base: 'xs', md: 'xs' }} alignItems='center' display={'flex'}>
                                <Box mr={2}>
                                    <Checkbox name='terms_conditions' />
                                </Box>
                                <Text>
                                    Acepto{' '}
                                    <a href='/docs/terms_and_conditions.pdf' target='_blank' download>
                                        <Text as='span' color='primary' mx={'0.25'}>
                                            términos y condiciones
                                        </Text>{' '}
                                    </a>
                                    de Propinita.
                                </Text>
                            </Flex>
                            <Box
                                fontSize='xs'
                                color='red.400'
                                position={{ base: 'static', md: 'absolute' }}
                                left={0}
                                bottom={{ base: 0, md: -5 }}
                            >
                                <Text>{formErrors?.terms_conditions?.message as unknown as string}</Text>
                            </Box>
                        </Box>
                    </Flex>
                    <Button w='100%' type='submit' isDisabled={!methods.formState.isValid} 
                    isLoading={isLoading} variant='primary'>
                        Registrarse
                    </Button>
                </Flex>
            </form>
        </FormProvider>
    )
}

export default RegisterForm