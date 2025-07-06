'use client'
import { useEffect, useState } from 'react'
import { Flex, Box, Text, Button, Spinner, Circle } from '@chakra-ui/react'
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import type { OnboardingStepProps } from '../onboarding.types'
import { useRouter } from 'next/navigation'
import { handleToast } from '@/src/utils/toast'

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

const options = [
  { label: 'Usuario', value: 'user' },
  { label: 'Proveedor', value: 'provider' }
]

const getLabel = (value: string, options: { value: string; label: string }[]) => {
  const option = options.find((option) => option.value === value)
  return option ? option.label : value
}

const UserSummary = ({
  userData,
  onNext,
  onBack,
  isLoading,
  isLoadingBack
}: OnboardingStepProps) => {
  const { user } = useGetUser()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [mpUserId, setMpUserId] = useState<string | null>(null)
  const [isLoadingMp, setIsLoadingMp] = useState(true)

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

  useEffect(() => {
    const checkMercadoPagoConnection = async () => {
      try {
        const connectionResponse = await fetch('/api/mercadopago/check-connection', {
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })

        if (!connectionResponse.ok) {
          throw new Error(`Error HTTP: ${connectionResponse.status}`)
        }

        const connectionData = await connectionResponse.json()

        if (connectionData.connected && connectionData.mp_user_id) {
          setMpUserId(connectionData.mp_user_id.toString())
        }
      } catch (error) {
        handleToast({
          title: 'Error',
          text: 'Hubo un problema al verificar la conexión con MercadoPago. Por favor, intenta nuevamente.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      } finally {
        setIsLoadingMp(false)
      }
    }

    checkMercadoPagoConnection()
  }, [])

  const onSubmit = handleSubmit((data) => {
    onNext(data)
    setStep(1)
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

  // Si estamos cargando el ID de MercadoPago, mostramos un spinner
  if (isLoadingMp) {
    return (
      <Flex justifyContent='center' alignItems='center' h='100%'>
        <Spinner color='primary' size='xl' />
      </Flex>
    )
  }

  return (
    <Box w={'100%'}>
      <Text fontWeight='600' fontSize='xl' mb={6} textTransform={'uppercase'}>
        Paso 3
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
            direction={{ base: 'column', md: 'row' }}
          >
            <Box w={{ base: '100%', md: '48%' }} mb={{ base: 2, md: 0 }}>
              <Text fontWeight='600' fontSize='lg'>
                Perfil
              </Text>
              <Text fontSize='sm'>{getLabel(watch('user_type') || '', options)}</Text>
            </Box>
            <Box w={{ base: '100%', md: '48%' }} mb={{ base: 2, md: 0 }}>
              <Text fontWeight='600' fontSize='lg'>
                Nacionalidad
              </Text>
              <Text fontSize='sm'>{getLabel(watch('nationality') || '', countries)}</Text>
            </Box>
            <Box w={{ base: '100%', md: '48%' }} mb={{ base: 2, md: 0 }}>
              <Text fontWeight='600' fontSize='lg'>
                Nombre y apellido
              </Text>
              <Text fontSize='sm'>
                {watch('first_name')} {watch('last_name')}
              </Text>
            </Box>
            <Box w={{ base: '100%', md: '48%' }} mb={{ base: 2, md: 0 }}>
              <Text fontWeight='600' fontSize='lg'>
                Estado civil
              </Text>
              <Text fontSize='sm'>{getLabel(watch('civil_state') || '', civil_state)}</Text>
            </Box>
            <Box w={{ base: '100%', md: '48%' }} mb={{ base: 2, md: 0 }}>
              <Text fontWeight='600' fontSize='lg'>
                Teléfono
              </Text>
              <Text fontSize='sm'>{watch('phone')}</Text>
            </Box>
            <Box w={{ base: '100%', md: '48%' }} mb={{ base: 2, md: 0 }}>
              <Text fontWeight='600' fontSize='lg'>
                ID MercadoPago
              </Text>
              <div className='flex items-center gap-2'>
                {isLoadingMp ? (
                  <Spinner size='sm' />
                ) : mpUserId ? (
                  <span className='text-sm font-medium text-gray-900'>{mpUserId}</span>
                ) : (
                  <span className='text-sm font-medium text-red-500'>No disponible</span>
                )}
              </div>
            </Box>
          </Flex>
        </Flex>
        <Flex justifyContent='flex-end'>
          <Button
            variant='secondary'
            type='button'
            mt={4}
            mr={4}
            size='sm'
            onClick={onBack}
            isLoading={isLoadingBack}
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
            rightIcon={<FaArrowRight />}
          >
            Finalizar
          </Button>
        </Flex>
      </form>
    </Box>
  )
}

export default UserSummary
