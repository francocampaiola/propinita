'use client'
import React, { useTransition, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { Button, Divider, Flex, Text, InputGroup } from '@chakra-ui/react'
import { handleToast } from '@/src/utils/toast'
import PasswordConfirmPassword from '@/src/components/form/PasswordConfirmPassword'
import Input from '@/src/components/form/Input'
import { changePassword } from './actions'

const ChangePasswordPage = () => {
  const [isLoading, startTransition] = useTransition()

  const PasswordSchema = z
    .object({
      currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
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
      const result = await changePassword(password)

      if (!result.success) {
        handleToast({
          title: 'Error',
          text: result.error,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      } else {
        handleToast({
          title: 'Contraseña cambiada correctamente',
          text: 'Tu contraseña fue actualizada. Serás redirigido al inicio de sesión.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
        methods.reset()
        window.location.href = '/login'
      }
    })
  })

  return (
    <Flex
      backgroundColor='gray.1000'
      borderRadius='15px'
      direction='column'
      justifyContent='space-between'
      flex={1}
      w='50%'
    >
      <Flex justifyContent='space-between' alignItems={'center'} height={'58px'} mx={4}>
        <Text fontWeight={700}>Cambiar contraseña</Text>
      </Flex>
      <Divider borderColor='components.divider' />
      <Flex flex={1} mx={4} mt={4} mb={4} direction='column' gap={4}>
        <FormProvider {...methods}>
          <form onSubmit={action}>
            <Flex direction='column' gap={4}>
              <InputGroup size='lg'>
                <Input
                  name='currentPassword'
                  label='Contraseña actual'
                  placeholder='Contraseña actual'
                  showPassword
                  size='lg'
                  type='password'
                />
              </InputGroup>
              <PasswordConfirmPassword
                methods={methods}
                newPassword={{
                  inputProps: {
                    name: 'password',
                    label: 'Nueva contraseña',
                    placeholder: 'Nueva contraseña',
                    type: 'password',
                    size: 'lg'
                  }
                }}
                confirmPassword={{
                  inputProps: {
                    label: 'Repetir nueva contraseña',
                    placeholder: 'Repetir nueva contraseña',
                    type: 'password',
                    name: 'confirmPassword',
                    size: 'lg'
                  }
                }}
              />
            </Flex>
            <Flex gap={2} mt={8} justify='flex-end'>
              <Button variant='ghost' onClick={() => window.history.back()}>
                Cancelar
              </Button>
              <Button
                variant='primary'
                type='submit'
                isDisabled={!methods?.formState.isValid}
                isLoading={isLoading}
              >
                Cambiar contraseña
              </Button>
            </Flex>
          </form>
        </FormProvider>
      </Flex>
    </Flex>
  )
}

export default ChangePasswordPage
