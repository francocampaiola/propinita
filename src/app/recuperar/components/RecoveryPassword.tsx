'use client'
import React, { useState, useTransition } from 'react'
import { z } from "zod"
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { handleRequest } from '../../utils/functions'
import { recoveryPassword } from '../action'
import Input from '@/src/components/form/Input'
import { handleToast } from '@/src/utils/toast'
import { FaUserClock } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

const RecoveryPassword = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
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
    setEmail(email)
    startTransition(async () => {
      const request = await handleRequest(() =>
        recoveryPassword({
          email
        })
      )
      if (request.success) {
        handleToast({
          title: 'Email enviado correctamente',
          text: 'Recordá revisar spam/no deseado',
          status: 'success',
          duration: 9000,
          isClosable: true
        })
        setStep(2)
      }
    })
  })

  return (
    <>
      {step === 1 && (
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
              isLoading={isLoading}
            >
              Enviar mail
            </Button>
          </form>
        </FormProvider>)
      }
      {step === 2 && (
        <>
          <Flex justifyContent={'center'} alignItems={'center'} flexDir={'column'}>
            <Box
              borderRadius={'full'}
              w={'100px'}
              h={'100px'}
              background={'#D9D9D933'}
              display='flex'
              justifyContent='center'
              alignItems='center'
              mb={4}
            >
              <FaUserClock size={'60'} color='#B49B25' />
            </Box>
            <Box textAlign={'center'}>
              <Heading fontSize={'2xl'} mb={'2'}>Verificá tu correo</Heading>
              <Text fontSize={'sm'} mb={4}>Enviamos un correo a {email} para que puedas crear una nueva contraseña</Text>
            </Box>
            <Button
              variant='outline'
              onClick={() => router.push('/login')}
              w='50%'
            >
              Ir a iniciar sesión
            </Button>
          </Flex>
        </>
      )}
    </>
  )
}

export default RecoveryPassword