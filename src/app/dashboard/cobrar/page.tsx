'use client'
import { Flex } from '@chakra-ui/react'
import React from 'react'
import Card from './components/Card'
import { MdOutlineAttachMoney } from 'react-icons/md'

const ChargeContainer = () => {
  return (
    <Flex direction={'row'} flex={1} gap={2} justifyContent={'space-around'} mx={'auto'} mt={4}>
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
  )
}

export default ChargeContainer
