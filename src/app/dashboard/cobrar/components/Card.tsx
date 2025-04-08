'use client'
import React, { memo, useMemo } from 'react'
import { Text, Flex } from '@chakra-ui/react'

interface Props {
  title: string
  amount: number
  icon: React.ReactNode
  description?: string
}

const Card = memo(({ title, amount, icon, description }: Props) => {
  const formattedAmount = useMemo(() => {
    return amount.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS'
    })
  }, [amount])

  return (
    <Flex bg={'gray.1000'} flex={1} direction={'column'} borderRadius={'xl'}>
      <Flex flex={1} justifyContent={'space-between'} alignItems={'start'} mx={4} mt={4}>
        <Text size={'md'} color={'gray.300'}>
          {title}
        </Text>
        {icon}
      </Flex>
      <Text fontSize={'4xl'} fontWeight={700} color={'white'} ml={4}>
        {formattedAmount}
      </Text>
      {description && (
        <Text fontSize={'sm'} color={'gray.500'} ml={4} mb={4}>
          {description}
        </Text>
      )}
    </Flex>
  )
})

// Agregar displayName para facilitar la depuración
Card.displayName = 'Card'

export default Card
