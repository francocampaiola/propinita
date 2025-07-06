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
    <Flex
      bg={'gray.1000'}
      flex={1}
      direction={'column'}
      borderRadius={'xl'}
      // Mobile optimizations
      p={{ base: 4, lg: 0 }}
      mx={{ base: 0, lg: 4 }}
      mt={{ base: 0, lg: 4 }}
      height={{ base: 'auto', lg: 'auto' }}
      minH={{ base: '100px', lg: 'auto' }}
      justify={{ base: 'space-between', lg: 'flex-start' }}
      w={{ base: 'full', lg: 'auto' }}
    >
      <Flex
        flex={1}
        justifyContent={'space-between'}
        alignItems={{ base: 'center', lg: 'start' }}
        mx={{ base: 0, lg: 4 }}
        mt={{ base: 0, lg: 4 }}
      >
        <Text
          size={'md'}
          color={'gray.300'}
          fontSize={{ base: 'md', lg: 'md' }}
          fontWeight={{ base: 'medium', lg: 'normal' }}
        >
          {title}
        </Text>
        <Flex transform={{ base: 'scale(0.9)', lg: 'scale(1)' }}>{icon}</Flex>
      </Flex>
      <Text
        fontSize={{ base: '3xl', lg: '4xl' }}
        fontWeight={700}
        color={'white'}
        ml={{ base: 0, lg: 4 }}
        mb={{ base: 2, lg: 0 }}
      >
        {formattedAmount}
      </Text>
      {description && (
        <Text
          fontSize={{ base: 'sm', lg: 'sm' }}
          color={'gray.500'}
          ml={{ base: 0, lg: 4 }}
          mb={{ base: 0, lg: 4 }}
          lineHeight={{ base: 'normal', lg: 'normal' }}
        >
          {description}
        </Text>
      )}
    </Flex>
  )
})

// Agregar displayName para facilitar la depuración
Card.displayName = 'Card'

export default Card
