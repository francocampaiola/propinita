import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
import { Divider, Flex, Text, Spinner, VStack } from '@chakra-ui/react'
import { IoRefreshSharp } from 'react-icons/io5'

const QrComponent = () => {
  const [qrUrl, setQrUrl] = useState<string>('')
  const [qrText, setQrText] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const generateQR = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const url = 'https://propinita.app'
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

      const qrDataUrl = await QRCode.toDataURL(url, options)
      setQrUrl(qrDataUrl)
      setQrText(url)
    } catch (err) {
      console.error('Error generando QR:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    generateQR()
  }, [])

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
              {/* TODO: Eliminar el enlaces de la URL, es temporal para el desarrollo */}
              <Text color='white' fontSize='xs' fontWeight='medium'>
                {qrText}
              </Text>
            </Flex>
          )
        )}
      </Flex>
    </Flex>
  )
}

export default QrComponent
