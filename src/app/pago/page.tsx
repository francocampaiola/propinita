'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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
  Divider
} from '@chakra-ui/react'

export default function PagoPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const toast = useToast()
  const [monto, setMonto] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const providerId = searchParams.get('providerId')
  const providerName = searchParams.get('providerName')

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
          providerName
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

  return (
    <Container maxW='container.sm' py={8}>
      <Card>
        <CardHeader>
          <VStack spacing={4} align='stretch'>
            <Heading size='lg' textAlign='center'>
              Realizar Pago
            </Heading>
            <Text textAlign='center' color='gray.600'>
              Propina para {providerName}
            </Text>
          </VStack>
        </CardHeader>
        <Divider />
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Stack spacing={6}>
              <FormControl isRequired>
                <FormLabel>Monto de la propina</FormLabel>
                <Input
                  type='number'
                  min='1'
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder='Ingrese el monto'
                  disabled={isLoading}
                  size='lg'
                />
              </FormControl>

              <Button
                type='submit'
                colorScheme='yellow'
                size='lg'
                isLoading={isLoading}
                loadingText='Procesando...'
                disabled={isLoading || !monto}
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
