import React, { useEffect, useTransition } from 'react'
import { Flex, Box, Text, Button } from '@chakra-ui/react'
import BoxColorMode from '@/src/components/BoxColorMode'
import { useForm, FormProvider } from 'react-hook-form'
import type { OnboardingComponent } from '../onboarding.types'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import { UserType as UserTypes } from '../../types'
import UserLogo from '@/src/assets/onboarding/user_type/user.svg'
import ProviderLogo from '@/src/assets/onboarding/user_type/provider.svg'
import Image from 'next/image'

interface IUserTypeOption {
  title: string
  description: string
  value: UserTypes
  image: string
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
      await nextStep({ userData: formData })
    })
  })

  useEffect(() => {
    if (!user?.user_type) return
    methods.setValue('company_type', user?.user_type)
  }, [])

  const userTypeOptions: IUserTypeOption[] = [
    {
      title: 'Usuario',
      description:
        'Voy a utilizar Propinita para vincular mi cuenta bancaria o billetera virtual y poder gestionar las propinas que brindo desde la aplicación.',
      value: 'user',
      image: UserLogo
    },
    {
      title: 'Proveedor',
      description:
        'Como proveedor, recibo ventajas en el régimen monotributista. Me clasifico en categorías según mis ingresos y no tengo la opción de contratar empleados.',
      value: 'provider',
      image: ProviderLogo
    }
  ]

  return (
    <Box w={'100%'}>
      <Text fontWeight='600' fontSize='xl' mb={6} textTransform={'uppercase'}>Paso 1</Text>
      <Text fontWeight='600' fontSize='2xl' mb={1}>¿Con qué perfil te identificás?</Text>
      <Text fontSize='sm'>Seleccioná una opción para que te podamos dar información precisa.</Text>
      <FormProvider {...methods}>
        <form action={action}>
          <Flex direction='column' gap={4} my={4}>
            {userTypeOptions.map((option) => (
              <BoxColorMode key={option.value} bg={['', 'megapixGray']} borderRadius='md'>
                <Box
                  as='button'
                  type='button'
                  onClick={() => methods.setValue('company_type', option.value)}
                  display='flex'
                  alignItems='center'
                  py={4}
                  px={6}
                  width='100%'
                  cursor='pointer'
                  border={methods.watch('company_type') === option.value ? '2px solid #B49B25' : '2px solid transparent'}
                >
                  <Image src={option.image} alt={option.title} width={50} height={50} />
                  <Box ml={4}>
                    <Text fontSize='md' fontWeight='600'>{option.title}</Text>
                    <Text color='#D2D2D2' mt={2} fontSize='xs'>{option.description}</Text>
                  </Box>
                </Box>
              </BoxColorMode>
            ))}
          </Flex>
          <Flex justifyContent='flex-end'>
            <Button
              variant='primary'
              type='submit'
              mt={4}
              size='lg'
              width={{ base: '100%', md: '3xs' }}
              isLoading={isLoading}
              loadingText='Enviando...'
              isDisabled={!methods.watch('company_type')}
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