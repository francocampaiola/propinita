'use client'
import React, { lazy, Suspense, useMemo, useState, useEffect } from 'react'
import { Container, Flex, Spinner, Center } from '@chakra-ui/react'
import { MdOutlineAttachMoney } from 'react-icons/md'
import Card from './components/Card'

const PaymentComponent = lazy(() => import('./components/Payment'))

const CARD_DATA = [
  {
    id: 1,
    title: 'Hoy',
    amount: 2651.07,
    description: '+15.2% que ayer'
  },
  {
    id: 2,
    title: 'Hoy',
    amount: 2651.07,
    description: '+15.2% que ayer'
  },
  {
    id: 3,
    title: 'Hoy',
    amount: 2651.07,
    description: '+15.2% que ayer'
  }
]

const LoadingState = () => (
  <Center p={8}>
    <Spinner size='xl' color='primary.500' />
  </Center>
)

const ChargeContainer = () => {
  const [isPageReady, setIsPageReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageReady(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const moneyIcon = useMemo(() => <MdOutlineAttachMoney size={'2.5rem'} color='#B49B25' />, [])

  const cards = useMemo(
    () =>
      CARD_DATA.map((data) => (
        <Card
          key={data.id}
          title={data.title}
          amount={data.amount}
          icon={moneyIcon}
          description={data.description}
        />
      )),
    [moneyIcon]
  )

  if (!isPageReady) {
    return <LoadingState />
  }

  return (
    <Container maxW='7xl' p={4}>
      <Flex direction={'column'} gap={4}>
        <Flex direction={'row'} gap={4}>
          {cards}
        </Flex>
        <Suspense fallback={<LoadingState />}>
          <PaymentComponent />
        </Suspense>
      </Flex>
    </Container>
  )
}

export default ChargeContainer
