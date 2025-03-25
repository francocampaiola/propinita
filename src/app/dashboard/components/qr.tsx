import { Divider, Flex, Text } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'
import { IoRefreshSharp } from 'react-icons/io5'
import qr from '@/src/assets/templates/qr.svg'

const QrComponent = () => {
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
        <IoRefreshSharp size='1.5rem' />
      </Flex>
      <Divider borderColor='components.qr.divider' />
      <Flex flex={1} alignItems='center' justifyContent='center'>
        <Image src={qr} alt='QR' width={200} height={200} />
      </Flex>
    </Flex>
  )
}

export default QrComponent
