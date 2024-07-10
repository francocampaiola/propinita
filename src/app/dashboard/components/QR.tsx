import { Box, Divider, Flex, Text } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'
import qr from '/public/assets/img/qr.png'

const QR = () => {
  return (
    <Box w={'30rem'} h={'20rem'} background={'#EAEAEA'} boxShadow={'md'}>
      <Text fontWeight={'semibold'} color={'#494F59'} p={4}>Mi código QR</Text>
      <Divider orientation='horizontal' size={'md'} borderColor={'white'} />
      <Flex justifyContent={'center'} alignItems={'center'} mt={6}>
        <Image src={qr} alt='QR' />
      </Flex>
    </Box>
  )
}

export default QR