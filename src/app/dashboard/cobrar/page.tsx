'use client'
import React, { lazy, Suspense } from 'react'
import { Container, Flex, Spinner, Center, Skeleton, Box, VStack } from '@chakra-ui/react'
import { MdOutlineAttachMoney } from 'react-icons/md'
import { BsGraphUpArrow } from 'react-icons/bs'
import { IoStatsChart } from 'react-icons/io5'
import Card from './components/Card'
import { useTransactionStats } from '@/src/hooks/transactions/useTransactionStats'

const PaymentComponent = lazy(() => import('./components/Payment'))

const LoadingState = () => <Skeleton height='350px' mb={4} borderRadius='md' />

const CobrosPage = () => {
  const { stats, isLoading } = useTransactionStats()

  if (isLoading) {
    return <LoadingState />
  }

  const CARD_DATA = [
    {
      id: 1,
      title: 'Hoy',
      amount: stats.today.amount,
      description: `${
        stats.today.percentageChange >= 0 ? '+' : ''
      }${stats.today.percentageChange.toFixed(1)}% que ayer`,
      icon: <MdOutlineAttachMoney size={32} color='#B49B25' />
    },
    {
      id: 2,
      title: 'Esta semana',
      amount: stats.thisWeek.amount,
      description: `${
        stats.thisWeek.percentageChange >= 0 ? '+' : ''
      }${stats.thisWeek.percentageChange.toFixed(1)}% que la semana pasada`,
      icon: <BsGraphUpArrow size={22} color='#B49B25' />
    },
    {
      id: 3,
      title: 'Propinas promedio',
      amount: stats.average.amount,
      description: `Basado en ${stats.average.totalTransactions} propinas`,
      icon: <IoStatsChart size={24} color='#B49B25' />
    }
  ]

  return (
    <Container maxW='container.xl' py={8}>
      {/* Cards - Responsive design */}
      <Flex gap={4} mb={8} direction={{ base: 'column', lg: 'row' }}>
        {/* Mobile: Cards apiladas verticalmente */}
        <VStack spacing={3} display={{ base: 'flex', lg: 'none' }} w='full'>
          {CARD_DATA.map((card) => (
            <Card key={card.id} {...card} />
          ))}
        </VStack>

        {/* Desktop: Cards en fila normal */}
        <Flex gap={4} display={{ base: 'none', lg: 'flex' }} flex={1}>
          {CARD_DATA.map((card) => (
            <Card key={card.id} {...card} />
          ))}
        </Flex>
      </Flex>

      {/* Componente de pago */}
      <Suspense fallback={<LoadingState />}>
        <PaymentComponent />
      </Suspense>
    </Container>
  )
}

export default CobrosPage
