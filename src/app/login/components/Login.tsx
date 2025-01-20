import { useRouter } from "next/navigation"
import { useTransition } from 'react';
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { handleRequest } from "../../utils/functions"
import { login } from "../action"
import { Box, Button, Flex, Text } from "@chakra-ui/react"
import Input from "@/src/components/form/Input"
import Link from "next/link"

const Login = () => {
    const [isLoading, startTransition] = useTransition()
    const router = useRouter()

    const PasswordSchema = z.object({
        email: z.string().trim().email('Email inválido').max(100, 'Caracteres excedidos'),
        password: z.string().trim().max(100, 'Caracteres excedidos')
    })

    const methods = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        resolver: zodResolver(PasswordSchema)
    })

    const action = methods.handleSubmit(async (data) => {
        const { email, password } = data
        startTransition(async () => {
            const request = await handleRequest(() =>
                login({
                    email,
                    password
                })
            )
            if (request.success) {
                router.push('/dashboard')
            }
        })
    })

    return (
        <FormProvider {...methods}>
            <form onSubmit={action}>
                <Box mb={4}>
                    <Input placeholder='Correo electrónico' label='E-mail' name='email' size='lg' />
                </Box>
                <Input
                    label='Contraseña'
                    placeholder='Contraseña'
                    type='password'
                    name='password'
                    showPassword
                    size='lg'
                />
                <Flex my={'2.5'} mb={8}>
                    <Link href='/recuperar'>
                        <Text fontSize={'xs'} _hover={{ color: 'primary' }} cursor='pointer' transition={'100ms ease-in-out'}>
                            Olvidé mi contraseña
                        </Text>
                    </Link>
                </Flex>
                <Button
                    variant='primary'
                    w='100%'
                    type='submit'
                    isDisabled={!methods?.watch('email') || !methods?.watch('password')}
                >
                    Iniciar sesión
                </Button>
            </form>
        </FormProvider>
    )
}

export default Login