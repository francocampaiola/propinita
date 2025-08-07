import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useGetMercadoPago } from '@/src/hooks/mercadopago/useGetMercadoPago'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import mercadopagoImage from '@/src/assets/onboarding/user_bank_data/mercadopago.svg'

export const MercadoPagoBlocker = () => {
  const { mercadopago, isLoading } = useGetMercadoPago()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const pathname = usePathname()
  const [isCheckingConnection, setIsCheckingConnection] = useState(true)
  const [isConnected, setIsConnected] = useState(false)

  const isPaymentMethodsPage = pathname === '/dashboard/ajustes/metodos'

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/mercadopago/check-connection', {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Error al verificar la conexión')
      }

      const data = await response.json()
      setIsConnected(data.connected)
    } catch (error) {
      setIsConnected(false)
    } finally {
      setIsCheckingConnection(false)
    }
  }

  // Verificar conexión inicial
  useEffect(() => {
    if (!isLoading && !isPaymentMethodsPage) {
      checkConnection()
    }
  }, [isLoading, isPaymentMethodsPage])

  // Verificar conexión en cada cambio de ruta
  useEffect(() => {
    if (!isPaymentMethodsPage) {
      checkConnection()
    }
  }, [pathname])

  // Verificar conexión periódicamente
  useEffect(() => {
    if (!isPaymentMethodsPage) {
      const interval = setInterval(() => {
        checkConnection()
      }, 30000) // Verificar cada 30 segundos

      return () => clearInterval(interval)
    }
  }, [isPaymentMethodsPage])

  useEffect(() => {
    if (!isCheckingConnection && !isConnected && !isPaymentMethodsPage) {
      onOpen()
    }
  }, [isCheckingConnection, isConnected, onOpen, isPaymentMethodsPage])

  if (isLoading || isCheckingConnection || isConnected || isPaymentMethodsPage) {
    return null
  }

  return (
    <>
      <Box
        position='fixed'
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg='blackAlpha.700'
        backdropFilter='blur(4px)'
        zIndex={999}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        closeOnOverlayClick={false}
        closeOnEsc={false}
        initialFocusRef={undefined}
      >
        <ModalOverlay />
        <ModalContent bg='gray.800' color='white' mx={4}>
          <ModalBody py={6}>
            <Flex direction='column' align='center' textAlign='left' gap={4}>
              <Text fontSize='xl' fontWeight='bold'>
                Cuenta de MercadoPago requerida
              </Text>
              <Image src={mercadopagoImage} alt='MercadoPago' width={120} height={80} />
              <Text color='gray.300' fontSize='md'>
                Para continuar utilizando la aplicación, necesitas vincular tu cuenta de
                MercadoPago. <br />
                Esto es necesario para poder recibir y realizar pagos de manera segura.
              </Text>
              <Link href='/dashboard/ajustes/metodos' passHref>
                <Button variant={'primary'} autoFocus={false}>
                  Vincular cuenta
                </Button>
              </Link>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
