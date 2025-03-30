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
  Divider,
  Spinner
} from '@chakra-ui/react'
import { FaClock } from 'react-icons/fa'

export default function PendingPage() {
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    toast({
      title: 'Pago en proceso',
      description: 'Tu propina está siendo procesada.',
      status: 'info',
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
              <FaClock size={50} color='#4299E1' />
            </Box>
            <Heading size='lg' textAlign='center'>
              Pago en Proceso
            </Heading>
            <Text textAlign='center' color='gray.600'>
              Tu propina está siendo procesada. Te notificaremos cuando esté lista.
            </Text>
            <Box display='flex' justifyContent='center'>
              <Spinner size='xl' color='yellow.500' />
            </Box>
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
