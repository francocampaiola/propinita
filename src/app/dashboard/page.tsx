import { Flex, Text, Box } from '@chakra-ui/react';
import React from 'react'
import { getUserData } from './actions'
import QR from './components/QR'
import Balance from './components/Balance'
import Transactions from './components/Transactions'

export default async function DashboardPage() {

  const userData = await getUserData()

  return (
    <>
      <Text fontSize={'2xl'} fontWeight={'semibold'}>Hola de nuevo, {userData.fullname?.split(' ')[0]}</Text>
      <Flex w={'100%'} flexDirection={'column'}>
        <Flex p={12} gap={20}>
          <QR />
          <Balance />
        </Flex>
        <Box p={12}>
          <Transactions />
        </Box>
      </Flex>
    </>
  )
}
