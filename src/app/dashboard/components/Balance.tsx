import { Box, Divider, Flex, Text } from '@chakra-ui/react'
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
    </Box>
  )
}

export default Balance