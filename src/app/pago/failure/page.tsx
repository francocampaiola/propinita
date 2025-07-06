'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Divider
} from '@chakra-ui/react'
import { FaTimes } from 'react-icons/fa'

export default function FailurePage() {
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    toast({
      title: 'Error en el pago',
      description: 'Hubo un problema al procesar tu propina.',
      status: 'error',
      duration: 5000,
      isClosable: true
    })
  }, [toast])

  return (
    <Container maxW='container.sm' py={8}>
      <Card>
        <CardHeader>
          <VStack spacing={4} align='stretch'>
            <Box display='flex' justifyContent='center'>
              <FaTimes size={50} color='#E53E3E' />
            </Box>
            <Heading size='lg' textAlign='center'>
              Error en el pago
            </Heading>
            <Text textAlign='center' color='white'>
              Hubo un problema al procesar tu propina. Por favor, intenta nuevamente.
            </Text>
          </VStack>
        </CardHeader>
        <Divider />
        <CardBody>
          <VStack spacing={4}>
            <Button colorScheme='yellow' size='lg' width='100%' onClick={() => router.push('/')}>
              Volver al inicio
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  )
}
