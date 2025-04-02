'use client'
import { Text, Flex } from '@chakra-ui/react'
import React from 'react'

interface Props {
  title: string
  amount: number
  icon: React.ReactNode
  description?: string
}

const Card = ({ title, amount, icon, description }: Props) => {
  return (
    <Flex bg={'gray.1000'} w={'23rem'} direction={'column'} borderRadius={'xl'}>
      <Flex flex={1} justifyContent={'space-between'} alignItems={'start'} mx={4} mt={4}>
        <Text size={'md'} color={'gray.300'}>
          {title}
        </Text>
        {icon}
      </Flex>
      <Text fontSize={'4xl'} fontWeight={700} color={'white'} ml={4}>
        {amount.toLocaleString('es-AR', {
          style: 'currency',
          currency: 'ARS'
        })}
      </Text>
      <Text fontSize={'sm'} color={'gray.500'} ml={4} mb={4}>
        {description}
      </Text>
    </Flex>
  )
}

export default Card
