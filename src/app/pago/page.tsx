'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
  useToast,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Alert,
  AlertIcon,
  useBreakpointValue
} from '@chakra-ui/react'
import { getUserData } from './action'
import logo from '@/src/assets/logo.svg'

export default function PagoPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const toast = useToast()
  const [monto, setMonto] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<{
    first_name: string | null
    last_name: string | null
  } | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [userError, setUserError] = useState<string | null>(null)

  const providerId = searchParams.get('providerId')
  const providerName = searchParams.get('providerName')

  // Responsive values
  const containerPadding = useBreakpointValue({ base: 4, md: 8 })
  const cardPadding = useBreakpointValue({ base: 4, md: 6 })
  const headingSize = useBreakpointValue({ base: 'md', md: 'lg' })

  useEffect(() => {
    const fetchUserData = async () => {
      if (!providerId) {
        setUserError('ID de proveedor no proporcionado')
        setIsLoadingUser(false)
        return
      }

      try {
        const result = await getUserData(providerId)
        if (result.error) {
          setUserError(result.error)
        } else {
          setUserData(result.data)
        }
      } catch (error) {
        setUserError('Error al cargar los datos del usuario')
      } finally {
        setIsLoadingUser(false)
      }
    }

    fetchUserData()
  }, [providerId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/payment/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: monto,
          providerId,
          providerName: userData ? `${userData.first_name} ${userData.last_name}` : providerName
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pago')
      }

      // Redirigir al usuario a la página de pago de MercadoPago
      window.location.href = data.initPoint
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al procesar el pago. Por favor, intenta nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      router.push('/pago/failure')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingUser) {
    return (
      <Container maxW='container.sm' py={containerPadding} px={4}>
        <Card>
          <CardBody p={cardPadding}>
            <VStack spacing={4}>
              <Spinner size='lg' />
              <Text>Cargando información del proveedor...</Text>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    )
  }

  if (userError) {
    return (
      <Container maxW='container.sm' py={containerPadding} px={4}>
        <Alert status='error'>
          <AlertIcon />
          {userError}
        </Alert>
      </Container>
    )
  }

  const displayName = userData
    ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim()
    : providerName || 'Proveedor'

  return (
    <Container maxW='container.sm' py={containerPadding} px={4}>
      <Card>
        <CardHeader p={cardPadding}>
          <VStack spacing={4} align='stretch'>
            {/* Logo de Propinita */}
            <Box display='flex' justifyContent='center' mb={2}>
              <Image
                src={logo}
                alt='Propinita'
                width={120}
                height={40}
                style={{ objectFit: 'contain' }}
              />
            </Box>

            <Heading size={headingSize} textAlign='center'>
              Realizar Pago
            </Heading>
            <Text textAlign='center' color='gray.600' fontSize={{ base: 'sm', md: 'md' }}>
              Propina para {displayName}
            </Text>
          </VStack>
        </CardHeader>
        <Divider />
        <CardBody p={cardPadding}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={6}>
              <FormControl isRequired>
                <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Monto de la propina</FormLabel>
                <Input
                  type='number'
                  min='1'
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder='Ingrese el monto'
                  disabled={isLoading}
                  size={{ base: 'md', md: 'lg' }}
                />
              </FormControl>

              <Button
                type='submit'
                colorScheme='yellow'
                size={{ base: 'md', md: 'lg' }}
                isLoading={isLoading}
                loadingText='Procesando...'
                disabled={isLoading || !monto}
                fontSize={{ base: 'sm', md: 'md' }}
              >
                Pagar con MercadoPago
              </Button>
            </Stack>
          </form>
        </CardBody>
      </Card>
    </Container>
  )
}
