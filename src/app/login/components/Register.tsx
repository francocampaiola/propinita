import React, { useTransition } from 'react'
import {
  Button,
  Box,
  Text,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from '@chakra-ui/react'
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

  const { isOpen, onOpen, onClose } = useDisclosure()

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
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={'4xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Términos y condiciones</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box maxH='400px' overflowY='auto'>
              Bienvenido a <strong>Propinita</strong>. Antes de registrarte y utilizar nuestros
              servicios, te pedimos que leas atentamente los siguientes términos y condiciones. Al
              registrarte en Propinita, aceptas cumplir con estos términos y condiciones de uso.
              <br />
              <br />
              <strong>1. ACEPTACIÓN DE LOS TÉRMINOS</strong>
              <br />
              Al crear una cuenta en Propinita, aceptas y te comprometes a cumplir con estos
              términos y condiciones, así como con nuestra Política de Privacidad. Si no estás de
              acuerdo, no podrás utilizar nuestros servicios.
              <br />
              <br />
              <strong>2. REGISTRO DE USUARIO</strong>
              <br />
              Para acceder a los servicios de Propinita, debes registrarte proporcionando
              información veraz y actualizada. Eres responsable de mantener la confidencialidad de
              tu cuenta y contraseña.
              <br />
              <br />
              <strong>3. USO DE LOS SERVICIOS</strong>
              <br />
              Los usuarios se comprometen a utilizar Propinita de manera lícita y ética. No está
              permitido el uso de la plataforma para actividades fraudulentas, ilegales o que violen
              derechos de terceros.
              <br />
              <br />
              <strong>4. RESPONSABILIDAD DEL USUARIO</strong>
              <br />
              Eres responsable del uso que hagas de Propinita, incluyendo las interacciones con
              otros usuarios. En caso de incumplimiento de estos términos, Propinita podrá suspender
              o cancelar tu cuenta sin previo aviso.
              <br />
              <br />
              <strong>5. PROTECCIÓN DE DATOS PERSONALES</strong>
              <br />
              Propinita recopila y gestiona tus datos personales conforme a nuestra Política de
              Privacidad. Al registrarte, aceptas el tratamiento de tu información de acuerdo con
              dicha política.
              <br />
              <br />
              <strong>6. MODIFICACIONES A LOS TÉRMINOS</strong>
              <br />
              Propinita se reserva el derecho de modificar estos términos en cualquier momento. Te
              notificaremos sobre cambios relevantes y el uso continuo de nuestros servicios después
              de dichos cambios implicará tu aceptación de los mismos.
              <br />
              <br />
              <strong>7. TERMINACIÓN DEL SERVICIO</strong>
              <br />
              Podemos suspender o cancelar tu acceso a Propinita en caso de incumplimiento de estos
              términos o por razones operativas. Tú también puedes cancelar tu cuenta en cualquier
              momento.
              <br />
              <br />
              <strong>8. LIMITACIÓN DE RESPONSABILIDAD</strong>
              <br />
              Propinita no será responsable de daños directos o indirectos derivados del uso de la
              plataforma. Los usuarios asumen la responsabilidad por cualquier riesgo relacionado
              con su uso.
              <br />
              <br />
              <strong>9. LEGISLACIÓN APLICABLE</strong>
              <br />
              Estos términos y condiciones se rigen por las leyes aplicables en Argentina. Cualquier
              disputa será resuelta en los tribunales competentes de dicha jurisdicción.
              <br />
              <br />
              Para cualquier consulta sobre estos términos, puedes contactarnos en
              info@propinita.app
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
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
                  type: 'password'
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
            <Flex direction='column'>
              <Flex fontSize={{ base: 'xs', md: 'xs' }} alignItems='center' display={'flex'}>
                <Box mr={2}>
                  <Checkbox name='terms_conditions' />
                </Box>
                <Text>
                  Acepto{' '}
                  <span onClick={onOpen} style={{ cursor: 'pointer' }}>
                    <Text as='span' color='primary' mx={'0.25'}>
                      términos y condiciones
                    </Text>{' '}
                  </span>
                  de Propinita.
                </Text>
              </Flex>
              {formErrors?.terms_conditions?.message && (
                <Box fontSize='xs' color='red.400' mt={1} ml={6}>
                  <Text>{formErrors?.terms_conditions?.message as unknown as string}</Text>
                </Box>
              )}
            </Flex>
            <Button
              w='100%'
              //   type='submit'
              isDisabled={true}
              isLoading={isLoading}
              variant='primary'
            >
              Registrarse
            </Button>
          </Flex>
        </form>
      </FormProvider>
    </>
  )
}

export default RegisterForm
