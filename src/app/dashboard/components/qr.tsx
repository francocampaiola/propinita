import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
import { Divider, Flex, Text, Spinner, VStack } from '@chakra-ui/react'
import { IoRefreshSharp } from 'react-icons/io5'
import { useGetUser } from '@/src/hooks/users/useGetUser'

const QrComponent = () => {
  const [qrUrl, setQrUrl] = useState<string>('')
  const [qrText, setQrText] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useGetUser()

  const generateQR = async () => {
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
      console.error('Error generando QR:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      generateQR()
    }
  }, [user])

  return (
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
          style={{ cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.5 : 1 }}
          onClick={() => !isLoading && generateQR()}
        />
      </Flex>
      <Divider borderColor='components.qr.divider' />
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
  )
}

export default QrComponent
