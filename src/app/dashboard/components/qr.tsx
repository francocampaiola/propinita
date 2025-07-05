import React, { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
import { Divider, Flex, Text, Spinner, VStack, Box } from '@chakra-ui/react'
import { IoRefreshSharp } from 'react-icons/io5'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import { handleToast } from '@/src/utils/toast'

const QrComponent = () => {
  const [qrUrl, setQrUrl] = useState<string>('')
  const [qrText, setQrText] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useGetUser()

  const generateQR = useCallback(async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Construir la URL de pago con los datos del proveedor
      const paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pago?providerId=${
        user?.id
      }&providerName=${encodeURIComponent(
        `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Proveedor'
      )}`

      const options: QRCode.QRCodeToDataURLOptions = {
        margin: 2,
        width: 250,
        errorCorrectionLevel: 'H',
        rendererOpts: {
          quality: 1
        },
        color: {
          dark: '#B49B25',
          light: '#00000000'
        },
        maskPattern: Math.floor(Math.random() * 8) as QRCode.QRCodeMaskPattern
      }

      const qrDataUrl = await QRCode.toDataURL(paymentUrl, options)
      setQrUrl(qrDataUrl)
      setQrText(paymentUrl)
    } catch (err) {
      handleToast({
        title: 'Error',
        text: 'No se pudo generar el código QR. Por favor, intenta nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      generateQR()
    }
  }, [user, generateQR])

  return (
    <>
      {/* Desktop Version - Mantiene el diseño original */}
      <Box display={{ base: 'none', md: 'block' }}>
        <Flex
          backgroundColor='components.qr.bg'
          width='80'
          height='80'
          borderRadius='md'
          direction={'column'}
          justifyContent='space-between'
        >
          <Flex justifyContent='space-between' alignItems={'center'} height={'15%'} mx={4}>
            <Text fontWeight={700}>Mi QR</Text>
            <IoRefreshSharp
              size='1.5rem'
              style={{
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1
              }}
              onClick={() => !isLoading && generateQR()}
            />
          </Flex>
          <Divider borderColor='components.divider' />
          <Flex flex={1} alignItems='center' justifyContent='center'>
            {isLoading ? (
              <VStack spacing={4}>
                <Spinner size='xl' color='#B49B25' thickness='4px' />
                <Text color='white' fontSize='sm' fontWeight='medium'>
                  Generando código QR...
                </Text>
              </VStack>
            ) : (
              qrUrl && (
                <Flex direction={'column'} alignItems={'center'} justifyContent={'center'}>
                  <Image src={qrUrl} alt='QR' width={220} height={220} />
                  {/* TODO: Eliminar el enlaces de la URL, es temporal para el desarrollo
                  <Text color='white' fontSize='xs' fontWeight='medium'>
                    {qrText}
                  </Text> */}
                </Flex>
              )
            )}
          </Flex>
        </Flex>
      </Box>

      {/* Mobile Version - Diseño centrado y compacto */}
      <Box display={{ base: 'block', md: 'none' }}>
        <Flex
          backgroundColor='components.qr.bg'
          width='100%'
          borderRadius='md'
          direction={'column'}
          alignItems='center'
          p={4}
        >
          {/* Header */}
          <Flex justifyContent='space-between' alignItems='center' width='100%' mb={3}>
            <Text fontWeight={700} fontSize='lg'>
              Mi QR
            </Text>
            <IoRefreshSharp
              size='1.25rem'
              style={{
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1
              }}
              onClick={() => !isLoading && generateQR()}
            />
          </Flex>

          {/* QR Code */}
          <Flex flex={1} alignItems='center' justifyContent='center' minH='200px'>
            {isLoading ? (
              <VStack spacing={3}>
                <Spinner size='lg' color='#B49B25' thickness='3px' />
                <Text color='white' fontSize='sm' fontWeight='medium' textAlign='center'>
                  Generando código QR...
                </Text>
              </VStack>
            ) : (
              qrUrl && (
                <VStack spacing={3}>
                  <Image
                    src={qrUrl}
                    alt='QR'
                    width={180}
                    height={180}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                  <Text color='gray.400' fontSize='xs' textAlign='center'>
                    Escanea este código para recibir propinas
                  </Text>
                </VStack>
              )
            )}
          </Flex>
        </Flex>
      </Box>
    </>
  )
}

export default QrComponent
