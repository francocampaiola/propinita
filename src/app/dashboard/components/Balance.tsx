import { Badge, Box, Divider, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { IoEye, IoEyeOff } from 'react-icons/io5'

const Balance = () => {
  return (
    <Box w={'30rem'} h={'20rem'} background={'#EAEAEA'} boxShadow={'md'}>
      <Flex justifyContent={'space-between'} alignItems={'center'} mr={4}>
        <Text fontWeight={'semibold'} color={'#494F59'} p={4}>Balance total</Text>
        <IoEyeOff />
      </Flex>
      <Divider orientation='horizontal' size={'md'} borderColor={'white'} />
      <Flex flexDir={'column'} gap={2}>
        <Flex justifyContent={'center'} mt={6}>
          <Text fontSize={'4xl'} fontWeight={'semibold'}>$ 1,000.00</Text>
          <Text fontSize={'md'} fontWeight={'semibold'}>ARS</Text>
        </Flex>
        <Flex justifyContent={'center'} mx={'auto'}>
          <Badge ml='1' fontSize='0.8em' backgroundColor={'#B49B24'} color={'white'} borderRadius={'3xl'} textTransform={'none'}>
            <Flex justifyContent={'center'} p={3}>
              <Text fontSize={'2xl'} fontWeight={'semibold'}>$ 1,000.00</Text>
              <Text fontSize={'xs'} fontWeight={'semibold'}>ARS</Text>
            </Flex>
            <Text fontSize={'xs'} fontWeight={'semibold'} textAlign={'center'} mt={'-15px'} mb={'15px'}>pendientes de ingreso</Text>
          </Badge>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Balance