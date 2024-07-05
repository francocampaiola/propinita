import { Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { getUserData } from './actions'
import QR from './components/QR'
import Balance from './components/Balance'

export default async function DashboardPage() {

  const userData = await getUserData()

  return (
    <>
      <Text fontSize={'2xl'} fontWeight={'semibold'}>Hola de nuevo, {userData.fullname?.split(' ')[0]}</Text>
      <Flex p={12} gap={6}>
        <QR />
        <Balance />
      </Flex>
    </>
  )
}
