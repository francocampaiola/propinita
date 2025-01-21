import React, { useEffect, useTransition } from 'react'
import { Box, Text, Button, Flex, Radio } from '@chakra-ui/react'
import { OnboardingComponent } from '../onboarding.types'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import { useForm, FormProvider } from 'react-hook-form'
import { UserType as UserTypes } from '../../types'

interface IRadioInputs {
  title: string
  description: string
  value: UserTypes
}

const UserType = ({ nextStep }: OnboardingComponent) => {
  const { user } = useGetUser()
  const methods = useForm()
  const [isLoading, startTransition] = useTransition()

  const action: () => void = methods.handleSubmit(async (data) => {
    const { user_type } = data
    if (!user_type) return

    startTransition(async () => {
      const formData = new FormData()
      formData.append('user_type', user_type)
      await nextStep({
        userData: {
          user_type
        }
      })
    })
  })

  useEffect(() => {
    if (!user?.user_type) return
    methods.setValue('user_type', user?.user_type)
  }, [methods, user?.user_type])  

  const radioInputs: IRadioInputs[] = [
    {
      title: 'Usuario',
      description:
        'Como trabajador independiente, me clasifico en categorías según mis ingresos y no tengo la opción de contratar empleados.',
      value: 'user'
    },
    {
      title: 'Proveedor',
      description:
        'Como representante de una entidad jurídica, poseo la capacidad de contratar terceros y no tengo límites de facturación. Estoy sujeto a regímenes impositivos más complejos.',
      value: 'provider'
    }
  ]

  return (
    <Box>
      <Text fontWeight='600' fontSize='2xl' mb={6}>
        Perfil de usuario
      </Text>
      <Text fontSize='lg'>Selecciona un perfil para comenzar a configurar tu cuenta</Text>
      <FormProvider {...methods}>
        <form action={action}>
          {radioInputs.map((el) => (
            <Box my={4} key={el.title}>
              <Box bg={['primary', 'secondary']} borderRadius='md'>
                <Box
                  onClick={() => methods.setValue('user_type', el.value)}
                  display='block'
                  as='label'
                  py={8}
                  px={10}
                  width='100%'
                  cursor='pointer'
                >
                  <Flex>
                    <Box mr={4}>
                      <Radio
                        {...methods.register('user_type')}
                        value={el.value}
                        isChecked={methods.watch('user_type') === el.value}
                        onChange={() => methods.setValue('user_type', el.value)}
                      />
                    </Box>
                    <Box ml={2}>
                      <Text fontSize='lg' fontWeight='600'>
                        {el.title}
                      </Text>
                      <Text color='#D2D2D2' mt={2} fontSize='sm'>
                        {el?.description}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </Box>
            </Box>
          ))}

          <Flex justifyContent='flex-end'>
            <Button
              variant='primary'
              type='submit'
              mt={4}
              size='lg'
              width={{ base: '100%', md: '3xs' }}
              // isDisabled={!methods.watch().company_type}
              isLoading={isLoading}
              loadingText='Enviando...'
            >
              Continuar
            </Button>
          </Flex>
        </form>
      </FormProvider>
    </Box>
  )
}

export default UserType
