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
import { FaCheck } from 'react-icons/fa'

export default function SuccessPage() {
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    toast({
      title: '¡Pago exitoso!',
      description: 'Tu propina ha sido enviada correctamente.',
      status: 'success',
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
              <FaCheck size={50} color='#48BB78' />
            </Box>
            <Heading size='lg' textAlign='center'>
              ¡Pago exitoso!
            </Heading>
            <Text textAlign='center' color='white'>
              Tu propina ha sido enviada correctamente.
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
