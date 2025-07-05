'use client'
import React, { useTransition, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import {
  Button,
  Divider,
  Flex,
  Text,
  InputGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Icon,
  useBreakpointValue
} from '@chakra-ui/react'
import { handleToast } from '@/src/utils/toast'
import PasswordConfirmPassword from '@/src/components/form/PasswordConfirmPassword'
import Input from '@/src/components/form/Input'
import { changePassword } from './actions'
import { FaArrowLeft } from 'react-icons/fa'

const ChangePasswordPage = () => {
  const [isLoading, startTransition] = useTransition()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [countdown, setCountdown] = useState(5)
  const isMobile = useBreakpointValue({ base: true, md: false })

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

  const startCountdown = () => {
    let count = 5
    setCountdown(count)
    onOpen()

    const timer = setInterval(() => {
      count--
      setCountdown(count)

      if (count === 0) {
        clearInterval(timer)
        window.location.href = '/login'
      }
    }, 1000)
  }

  const action = methods.handleSubmit(async (data) => {
    const { currentPassword, password } = data
    startTransition(async () => {
      const result = await changePassword(currentPassword, password)

      if (!result.success) {
        handleToast({
          title: 'Error',
          text: result.error,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      } else {
        methods.reset()
        startCountdown()
      }
    })
  })

  return (
    <>
      <Flex
        backgroundColor='gray.1000'
        borderRadius='15px'
        direction='column'
        justifyContent='space-between'
        flex={1}
        w={{ base: '100%', md: '50%' }}
        p={{ base: 4, md: 0 }}
      >
        <Flex justifyContent='space-between' alignItems={'center'} height={'58px'} mx={4}>
          <Flex alignItems={'center'} gap={2}>
            <FaArrowLeft
              size={16}
              style={{ marginRight: '5px' }}
              onClick={() => window.history.back()}
              cursor={'pointer'}
            />
            <Text fontWeight={700}>Cambiar contraseña</Text>
          </Flex>
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
                    fontSize={isMobile ? '16px' : undefined}
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
                      size: 'lg',
                      fontSize: isMobile ? '16px' : undefined
                    }
                  }}
                  confirmPassword={{
                    inputProps: {
                      label: 'Repetir nueva contraseña',
                      placeholder: 'Repetir nueva contraseña',
                      type: 'password',
                      name: 'confirmPassword',
                      size: 'lg',
                      fontSize: isMobile ? '16px' : undefined
                    }
                  }}
                />
              </Flex>
              <Flex
                gap={2}
                mt={8}
                justify='flex-end'
                direction={{ base: 'column', md: 'row' }}
                align={{ base: 'stretch', md: 'center' }}
              >
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

      <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent
          bg='gray.1000'
          borderRadius='15px'
          w={{ base: '95vw', md: '400px' }}
          maxW={{ base: '95vw', md: '400px' }}
          minW={{ base: '95vw', md: '400px' }}
        >
          <ModalBody textAlign='center' px={{ base: 4, md: 6 }} py={{ base: 6, md: 6 }}>
            <Text fontSize='xl' fontWeight='bold' mb={4}>
              Sesión finalizada
            </Text>
            <Text mb={6}>
              Tu contraseña ha sido actualizada exitosamente. Por seguridad, serás redirigido al
              inicio de sesión en {countdown} segundos.
            </Text>
            <Text color='primary' fontWeight='medium' mb={4}>
              Por favor, inicia sesión nuevamente con tu nueva contraseña.
            </Text>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              gap={2}
              justify='center'
              align='center'
              w='100%'
            >
              <Button variant='ghost' onClick={onClose} w={{ base: '100%', md: 'auto' }}>
                Cerrar
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ChangePasswordPage
