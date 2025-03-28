import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
import { Divider, Flex, Text } from '@chakra-ui/react'
import { IoRefreshSharp } from 'react-icons/io5'

const QrComponent = () => {
  const [qrUrl, setQrUrl] = useState<string>('')

  const generateQR = async () => {
    try {
      // TODO: Cambiar por la URL del usuario
      const url = 'https://propinita.app'
      const qrDataUrl = await QRCode.toDataURL(url, {
        color: {
          dark: '#B49B25',
          light: '#00000000'
        }
      })
      setQrUrl(qrDataUrl)
    } catch (err) {
      console.error('Error generando QR:', err)
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
        <IoRefreshSharp size='1.5rem' style={{ cursor: 'pointer' }} onClick={generateQR} />
      </Flex>
      <Divider borderColor='components.qr.divider' />
      <Flex flex={1} alignItems='center' justifyContent='center'>
        {qrUrl && <Image src={qrUrl} alt='QR' width={250} height={250} />}
      </Flex>
    </Flex>
  )
}

export default QrComponent
