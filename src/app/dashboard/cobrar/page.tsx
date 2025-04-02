'use client'
import React from 'react'
import { Container, Flex } from '@chakra-ui/react'
import Card from './components/Card'
import PaymentComponent from './components/Payment'
import { MdOutlineAttachMoney } from 'react-icons/md'

const ChargeContainer = () => {
  return (
    <Container maxW='7xl' p={4}>
      <Flex direction={'column'} gap={4}>
        <Flex direction={'row'} gap={4}>
          <Card
            title='Hoy'
            amount={2651.07}
            icon={<MdOutlineAttachMoney size={'2.5rem'} color='#B49B25' />}
            description='+15.2% que ayer'
          />
          <Card
            title='Hoy'
            amount={2651.07}
            icon={<MdOutlineAttachMoney size={'2.5rem'} color='#B49B25' />}
            description='+15.2% que ayer'
          />
          <Card
            title='Hoy'
            amount={2651.07}
            icon={<MdOutlineAttachMoney size={'2.5rem'} color='#B49B25' />}
            description='+15.2% que ayer'
          />
        </Flex>
        <PaymentComponent />
      </Flex>
    </Container>
  )
}

export default ChargeContainer
