'use client'
import React, { useEffect, useState } from 'react'
import { Flex, Box, Text, Button, useToast, Badge } from '@chakra-ui/react'
import BoxColorMode from '@/src/components/BoxColorMode'
import { useForm } from 'react-hook-form'
import type { OnboardingStepProps } from '../onboarding.types'
import MercadoPagoLogo from '@/src/assets/onboarding/user_bank_data/mercadopago.svg'
import Image from 'next/image'
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa'
import api from '@/src/api'
import { useSearchParams } from 'next/navigation'

// Tipo para la información de MercadoPago
interface MercadoPagoInfo {
  connected: boolean
  marketplaceLinked?: boolean
  userInfo?: {
    user_id: string
    expires_in: number
    scope?: string
  }
}

const UserBankData = ({
  userData,
  onNext,
  onBack,
  isLoading,
  isLoadingBack
}: OnboardingStepProps) => {
  const { handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      birthdate: userData.birthdate || ''
    }
  })

  const searchParams = useSearchParams()
  const toast = useToast()
  const [authorizationUrl, setAuthorizationUrl] = useState<string | null>(null)
  const [mpInfo, setMpInfo] = useState<MercadoPagoInfo>({ connected: false })
  const [checkingConnection, setCheckingConnection] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [isLoadingConnection, setIsLoadingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>(
    'disconnected'
  )
  const [mpUserId, setMpUserId] = useState<string | null>(null)

  // Establecer valor predeterminado para birthdate si no existe
  useEffect(() => {
    if (!userData.birthdate) {
      setValue('birthdate', '1997-10-08')
    }
  }, [setValue, userData.birthdate])

  // Marcar el componente como montado
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Verificar parámetros de redirección
  useEffect(() => {
    if (!isMounted) return

    const success = searchParams.get('success')
    const error = searchParams.get('error')

    if (success === 'connected') {
      toast({
        title: 'Cuenta vinculada',
        description: 'Tu cuenta de MercadoPago se ha vinculado correctamente.',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } else if (error) {
      let errorMessage = 'Hubo un problema al vincular tu cuenta.'
      switch (error) {
        case 'permisos_invalidos':
          errorMessage = 'No se pudieron verificar los permisos de tu cuenta de MercadoPago.'
          break
        case 'sin_permisos_venta':
          errorMessage =
            'Tu cuenta de MercadoPago no tiene permisos para recibir pagos. Por favor, habilita la opción de recibir pagos en tu cuenta.'
          break
        default:
          errorMessage = `Hubo un problema al vincular tu cuenta: ${error}`
      }
      toast({
        title: 'Error de conexión',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }, [searchParams, toast, isMounted])

  // Verificar si el usuario ya tiene una cuenta conectada
  useEffect(() => {
    if (!isMounted) return

    const checkConnection = async () => {
      try {
        setIsLoadingConnection(true)
        const response = await fetch('/api/mercadopago/check-connection', {
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }

        const data = await response.json()

        if (data.connected) {
          setMpUserId(data.mp_user_id)
          setConnectionStatus('connected')
          setMpInfo({
            connected: true,
            marketplaceLinked: data.marketplace_linked,
            userInfo: {
              user_id: data.mp_user_id,
              expires_in: data.expires_in || 0,
              scope: data.scope
            }
          })
        } else {
          setConnectionStatus('disconnected')
          setMpInfo({ connected: false })
        }
      } catch (error) {
        setConnectionStatus('error')
        setMpInfo({ connected: false })
        toast({
          title: 'Error',
          description:
            'No se pudo verificar la conexión con MercadoPago. Por favor, intenta nuevamente.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      } finally {
        setIsLoadingConnection(false)
        setCheckingConnection(false)
      }
    }

    checkConnection()
  }, [isMounted, toast])

  // Obtener URL de autorización
  useEffect(() => {
    if (!isMounted || mpInfo.connected) return

    const fetchAuthorizationUrl = async () => {
      try {
        const url = await api.user.authorize()
        setAuthorizationUrl(url)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo obtener el enlace de conexión con MercadoPago.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    }

    fetchAuthorizationUrl()
  }, [isMounted, mpInfo.connected, toast])

  const onSubmit = handleSubmit((data) => {
    onNext(data)
  })

  // Renderizar un placeholder mientras el componente no está montado
  if (!isMounted) {
    return (
      <Box w={'100%'}>
        <Text fontWeight='600' fontSize='xl' mb={6} textTransform={'uppercase'}>
          Paso 3
        </Text>
        <Text fontWeight='600' fontSize='2xl' mb={1}>
          Cuenta bancaria
        </Text>
        <Text fontSize='sm'>
          Vinculá tu cuenta con MercadoPago para recibir o realizar tus pagos.
        </Text>
        <Flex direction='column' gap={4} my={4}>
          <BoxColorMode bg={['primary', 'transparent']} borderRadius='md'>
            <Flex
              justifyContent='center'
              alignItems='center'
              p={6}
              border={'1px solid white'}
              borderRadius={15}
            >
              <Text>Cargando...</Text>
            </Flex>
          </BoxColorMode>
        </Flex>
      </Box>
    )
  }

  return (
    <Box w={{ base: '100%', md: '100%' }} px={{ base: 2, md: 0 }}>
      <Text fontWeight='600' fontSize={{ base: 'lg', md: 'xl' }} mb={4} textTransform={'uppercase'}>
        Paso 2
      </Text>
      <Text fontWeight='600' fontSize={{ base: 'xl', md: '2xl' }} mb={1}>
        Cuenta bancaria
      </Text>
      <Text fontSize={{ base: 'sm', md: 'md' }}>
        Vinculá tu cuenta con MercadoPago para recibir o realizar tus pagos.
      </Text>
      <form onSubmit={onSubmit}>
        <Flex direction='column' gap={4} my={{ base: 2, md: 4 }}>
          <BoxColorMode bg={['primary', 'transparent']} borderRadius='md'>
            {checkingConnection ? (
              <Flex
                justifyContent='center'
                alignItems='center'
                p={{ base: 3, md: 6 }}
                border={'1px solid white'}
                borderRadius={15}
              >
                <Text fontSize={{ base: 'sm', md: 'md' }}>Verificando estado de conexión...</Text>
              </Flex>
            ) : mpInfo.connected ? (
              <Box
                flexDirection={{ base: 'column', md: 'row' }}
                alignItems={{ base: 'flex-start', md: 'center' }}
                py={{ base: 2, md: 4 }}
                px={{ base: 3, md: 6 }}
                width='100%'
                border={'1px solid white'}
                borderRadius={15}
                textAlign={'left'}
              >
                <Flex
                  direction='row'
                  alignItems='flex-start'
                  mb={2}
                  width={{ base: '100%', md: 'auto' }}
                >
                  <Image
                    src={MercadoPagoLogo}
                    alt={'MercadoPago'}
                    width={50}
                    height={50}
                    priority
                    style={{ marginRight: 12 }}
                  />
                  <Box>
                    <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='600'>
                      MercadoPago
                    </Text>
                    <Badge
                      colorScheme='green'
                      display='flex'
                      alignItems='center'
                      fontSize={{ base: 'xs', md: 'sm' }}
                      mt={1}
                    >
                      <FaCheck size={10} style={{ marginRight: '5px' }} /> Conectada
                    </Badge>
                  </Box>
                </Flex>
                <Box width='100%' mt={2}>
                  <Text color='#D2D2D2' fontSize='xs' mb={1}>
                    Tu cuenta de MercadoPago ha sido vinculada correctamente.
                  </Text>
                  {mpInfo.userInfo?.user_id && (
                    <Text as='span' color='green.300' fontSize='xs' mb={1}>
                      ID: {mpInfo.userInfo.user_id}
                    </Text>
                  )}
                  {mpInfo.marketplaceLinked ? (
                    <Text as='span' color='green.300' fontSize='xs' display='block'>
                      ✓ Vinculada al marketplace
                    </Text>
                  ) : (
                    <Text as='span' color='red.300' fontSize='xs' display='block'>
                      ✗ No vinculada al marketplace. Por favor, asegúrate de que tu cuenta de
                      MercadoPago tenga permisos para recibir pagos.
                    </Text>
                  )}
                </Box>
              </Box>
            ) : (
              <Box
                as='a'
                href={authorizationUrl || '#'}
                display='flex'
                flexDirection={{ base: 'column', md: 'row' }}
                alignItems={{ base: 'flex-start', md: 'center' }}
                py={{ base: 2, md: 4 }}
                px={{ base: 3, md: 6 }}
                width='100%'
                cursor='pointer'
                border={'1px solid white'}
                borderRadius={15}
                textAlign={'left'}
              >
                <Image
                  src={MercadoPagoLogo}
                  alt={'MercadoPago'}
                  width={100}
                  height={50}
                  priority
                  style={{ marginBottom: 12 }}
                />
                <Box ml={{ base: 0, md: 4 }}>
                  <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='600'>
                    MercadoPago
                  </Text>
                  <Text color='#D2D2D2' fontSize='xs'>
                    Vinculamos tu cuenta bancaria con un cifrado de extremo a extremo para facilitar
                    el pago y recepción de tus propinas.
                  </Text>
                </Box>
              </Box>
            )}
          </BoxColorMode>
        </Flex>
        <Flex justifyContent='flex-end' gap={2}>
          <Button
            variant='secondary'
            type='button'
            mt={4}
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
            isDisabled={!mpInfo.connected}
            rightIcon={<FaArrowRight />}
          >
            Continuar
          </Button>
        </Flex>
      </form>
    </Box>
  )
}

export default UserBankData
