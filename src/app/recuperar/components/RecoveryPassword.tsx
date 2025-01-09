'use client'
import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { z } from "zod"
import { Box, Button, Heading, Text } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { handleRequest } from '../../utils/functions'
import { recoveryPassword } from '../action'
import Input from '@/src/components/form/Input'

// TODO: Falta incorporar el toast en el componente al momento de enviar el mail de recuperación de contraseña

const RecoveryPassword = () => {

  const [isLoading, startTransition] = useTransition()
  const router = useRouter()

  const PasswordSchema = z.object({
    email: z.string().trim().email('Email inválido').max(100, 'Caracteres excedidos')
  })

  const methods = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(PasswordSchema)
  })

  const action = methods.handleSubmit(async (data) => {
    const { email } = data
    startTransition(async () => {
      const request = await handleRequest(() =>
        recoveryPassword({
          email
        })
      )
      if (request.success) {
        router.push('/login')
      }
    })
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={action}>
        <Box>
          <Heading fontSize={'2xl'} mb={'2'}>Olvidé mi contraseña</Heading>
          <Text fontSize={'sm'} mb={4}>Ingresá tu correo electrónico para recibir un mail y restablecer tu contraseña</Text>
        </Box>
        <Box mb={4}>
          <Input placeholder='ejemplo@email.com' label='Correo electrónico' name='email' size='lg' />
        </Box>
        <Button
          variant='primary'
          w='100%'
          type='submit'
          isDisabled={!methods?.watch('email')}
        >
          Enviar mail
        </Button>
      </form>
    </FormProvider>
  )
}

export default RecoveryPassword