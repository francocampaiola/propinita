'use client'
import { useEffect, useState } from 'react'
import { Flex, Box, Text, Button, Spinner, Circle } from '@chakra-ui/react'
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import type { OnboardingStepProps } from '../onboarding.types'
import { useRouter } from 'next/navigation'

const countries = [
  { label: 'Argentina', value: 'AR' },
  { label: 'Brasil', value: 'BR' },
  { label: 'Chile', value: 'CL' },
  { label: 'Colombia', value: 'CO' },
  { label: 'México', value: 'MX' },
  { label: 'Perú', value: 'PE' },
  { label: 'Uruguay', value: 'UY' },
  { label: 'Venezuela', value: 'VE' }
]

const civil_state = [
  { label: 'Soltero/a', value: 'single' },
  { label: 'Casado/a', value: 'married' },
  { label: 'Divorciado/a', value: 'divorced' },
  { label: 'Viudo/a', value: 'widowed' }
]

const getLabel = (value: string, options: { value: string; label: string }[]) => {
  const option = options.find((option) => option.value === value)
  return option ? option.label : value
}

const UserSummary = ({ userData, onNext, isLoading }: OnboardingStepProps) => {
  const { user } = useGetUser()
  const router = useRouter()
  const [step, setStep] = useState(0)

  const { handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      user_type: userData.user_type,
      first_name: userData.first_name,
      last_name: userData.last_name,
      nationality: userData.nationality,
      civil_state: userData.civil_state,
      phone: userData.phone,
      birthdate: userData.birthdate
    }
  })

  const onSubmit = handleSubmit((data) => {
    onNext(data)
    setStep(1)
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  })

  useEffect(() => {
    if (userData) {
      setValue('user_type', userData.user_type)
      setValue('first_name', userData.first_name)
      setValue('last_name', userData.last_name)
      setValue('nationality', userData.nationality)
      setValue('civil_state', userData.civil_state)
      setValue('phone', userData.phone)
      setValue('birthdate', userData.birthdate)
    }
  }, [userData, setValue])

  return (
    <Box w={'100%'}>
      {step === 0 ? (
        <>
          <Text fontWeight='600' fontSize='xl' mb={6} textTransform={'uppercase'}>
            Paso 4
          </Text>
          <Text fontWeight='600' fontSize='2xl' mb={1}>
            Resumen
          </Text>
          <Text fontSize='sm'>
            Chequeá la información referida a tu cuenta antes de confirmar el envío de datos.
          </Text>
          <form onSubmit={onSubmit}>
            <Flex direction='column' gap={4} my={4}>
              <Flex
                wrap='wrap'
                gap={4}
                justify='space-between'
                p={4}
                border={'1px solid white'}
                borderRadius={15}
              >
                <Box w='48%'>
                  <Text fontWeight='600' fontSize='lg'>
                    Perfil
                  </Text>
                  <Text fontSize='sm'>
                    {watch('user_type') === 'user' ? 'Usuario' : 'Proveedor'}
                  </Text>
                </Box>
                <Box w='48%'>
                  <Text fontWeight='600' fontSize='lg'>
                    Nacionalidad
                  </Text>
                  <Text fontSize='sm'>{getLabel(user?.nationality, countries)}</Text>
                </Box>
                <Box w='48%'>
                  <Text fontWeight='600' fontSize='lg'>
                    Nombre y apellido
                  </Text>
                  <Text fontSize='sm'>
                    {user?.first_name} {user?.last_name}
                  </Text>
                </Box>
                <Box w='48%'>
                  <Text fontWeight='600' fontSize='lg'>
                    Estado civil
                  </Text>
                  <Text fontSize='sm'>{getLabel(user?.civil_state, civil_state)}</Text>
                </Box>
                <Box w='48%'>
                  <Text fontWeight='600' fontSize='lg'>
                    Teléfono
                  </Text>
                  <Text fontSize='sm'>{user?.phone}</Text>
                </Box>

                <Box w='48%'>
                  <Text fontWeight='600' fontSize='lg'>
                    CVU
                  </Text>
                  <Text fontSize='sm'>{user?.id}</Text>
                </Box>
              </Flex>
            </Flex>
            <Flex justifyContent='flex-end'>
              <Button
                variant='secondary'
                type='submit'
                mt={4}
                mr={4}
                size='sm'
                isDisabled
                leftIcon={<FaArrowLeft />}
              >
                Volver
              </Button>
              <Button
                variant='primary'
                type='submit'
                mt={4}
                size='sm'
                isLoading={isLoading}
                // TODO: Agregar onclick
                // onClick={() => {
                //     setStep(1)
                // }}
                // isDisabled={!watch('user_type')}
                rightIcon={<FaArrowRight />}
              >
                Siguiente
              </Button>
            </Flex>
          </form>
        </>
      ) : step === 1 ? (
        <Flex justifyContent='center' alignItems='center' mx='auto' direction='column'>
          <Circle size='60px' bg='green.500' color='white' mb={4}>
            <FaCheck size={32} color='white' />
          </Circle>
          <Text fontSize={'2xl'} fontWeight={'600'} mb={2}>
            Registro completado con éxito
          </Text>
          <Text>Redirigiendo al dashboard</Text>
          <Spinner color='primary' borderWidth={4} mt={4} />
        </Flex>
      ) : null}
    </Box>
  )
}

export default UserSummary
