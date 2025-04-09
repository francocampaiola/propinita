'use client'
import React, { lazy, Suspense } from 'react'
import { Container, Flex, Spinner, Center } from '@chakra-ui/react'
import { MdOutlineAttachMoney } from 'react-icons/md'
import { BsGraphUpArrow } from 'react-icons/bs'
import { IoStatsChart } from 'react-icons/io5'
import Card from './components/Card'
import { useTransactionStats } from '@/src/hooks/transactions/useTransactionStats'

const PaymentComponent = lazy(() => import('./components/Payment'))

const LoadingState = () => (
  <Center p={8}>
    <Spinner size='xl' color='primary.500' />
  </Center>
)

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
      <Flex gap={4} mb={8}>
        {CARD_DATA.map((card) => (
          <Card key={card.id} {...card} />
        ))}
      </Flex>
      <Suspense fallback={<LoadingState />}>
        <PaymentComponent />
      </Suspense>
    </Container>
  )
}

export default CobrosPage
