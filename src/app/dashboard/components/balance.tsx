import React, { useState } from 'react'
import {
  Button,
  Divider,
  Flex,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Tooltip,
  Box
} from '@chakra-ui/react'
import { useGetBalance } from '@/src/hooks/balance/useGetBalance'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { FaInfoCircle } from 'react-icons/fa'
import { BsGraphUp } from 'react-icons/bs'
import { GrUpdate } from 'react-icons/gr'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import { calculateMonthlyGoalPercentage } from '@/src/utils/utils'
import { useGetTransactions } from '@/src/hooks/transactions/useGetTransactions'

const BalanceComponent = () => {
  const [showBalance, setShowBalance] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)

  const { balance: data, isLoading, refetch } = useGetBalance()
  const { user, isLoading: isUserLoading, refetch: refetchUser } = useGetUser()
  const {
    transactions,
    isLoading: isTransactionsLoading,
    refetch: refetchTransactions
  } = useGetTransactions()

  const handleRefetch = async () => {
    setIsRefetching(true)
    await Promise.all([refetch(), refetchUser(), refetchTransactions()])
    setIsRefetching(false)
  }

  if (isLoading || isUserLoading || isTransactionsLoading) {
    return <Text>Cargando...</Text>
  }

  return (
    <Flex
      backgroundColor='components.balance.bg'
      width='100%'
      height='100%'
      borderRadius='md'
      direction='column'
    >
      <Flex p={3} justifyContent='space-between' alignItems='center'>
        <Flex alignItems={'center'} gap={1}>
          <Text fontWeight={700}>Balance</Text>
          <Tooltip
            placement='bottom'
            label='Muestra tu saldo actual recibido en concepto de propinas y el progreso hacia tu meta mensual de ahorro'
            w={'350px'}
          >
            <FaInfoCircle color='#B49B25' size='1rem' />
          </Tooltip>
        </Flex>
        {!showBalance ? (
          <IoEyeOff cursor={'pointer'} size='1.5rem' onClick={() => setShowBalance(!showBalance)} />
        ) : (
          <IoEye cursor={'pointer'} size='1.5rem' onClick={() => setShowBalance(!showBalance)} />
        )}
      </Flex>
      <Divider borderColor='components.divider' />
      <Flex flex={1} alignItems={'flex-start'} ml={5} direction={'column'}>
        <Flex alignItems={'center'} gap={3.5}>
          <Text fontSize='6xl' fontWeight={700}>
            {showBalance
              ? '$******'
              : data?.balance.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
          </Text>
          <Text fontSize={'4xl'} fontWeight={700}>
            ARS
          </Text>
        </Flex>
        <Flex>
          <Tag
            size={'sm'}
            variant='subtle'
            colorScheme='green'
            borderRadius={'lg'}
            backgroundColor={'transparent'}
            border={'1px solid #38A169'}
          >
            <TagLeftIcon boxSize='12px' as={BsGraphUp} color={'green.500'} />
            <TagLabel color={'green.500'}>{showBalance ? '******' : '+ 15% esta semana'}</TagLabel>
          </Tag>
        </Flex>
        <Flex justifyContent={'space-between'} w={'100%'} mt={8} pr={4}>
          <span></span>
          <Button
            gap={2}
            w={48}
            size={'sm'}
            variant={'primary'}
            onClick={handleRefetch}
            isLoading={isRefetching}
            loadingText='Actualizando...'
          >
            {!isRefetching && (
              <>
                <GrUpdate size={'0.875rem'} />
                Actualizar saldo
              </>
            )}
          </Button>
        </Flex>
        <Flex mt={6} gap={2} direction={'column'} w={'100%'} pr={4}>
          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Text>Progreso hacia la meta mensual</Text>
            {!user.monthly_goal ? (
              <Flex alignItems='center' gap={2}>
                <Text fontSize={'xs'} color='gray.500'>
                  Todavía no configuraste una meta este mes
                </Text>
                <Button
                  size='xs'
                  variant='outline'
                  colorScheme='primary'
                  onClick={() => {
                    /* TODO: Implementar modal o redirección */
                  }}
                >
                  Configurar meta
                </Button>
              </Flex>
            ) : (
              <Flex alignItems='center' gap={2}>
                <Text fontSize={'xs'}>
                  {calculateMonthlyGoalPercentage(user.monthly_goal, transactions).percentage}%
                </Text>
                {calculateMonthlyGoalPercentage(user.monthly_goal, transactions).isCompleted && (
                  <Tag size='sm' colorScheme='green' variant='solid'>
                    ¡Meta cumplida!
                  </Tag>
                )}
              </Flex>
            )}
          </Flex>
          <Box
            w='100%'
            h='8px'
            bg='gray.700'
            borderRadius='full'
            overflow='hidden'
            position='relative'
          >
            {user.monthly_goal ? (
              <Box
                w={`${calculateMonthlyGoalPercentage(user.monthly_goal, transactions).percentage}%`}
                h='100%'
                bg={
                  calculateMonthlyGoalPercentage(user.monthly_goal, transactions).isCompleted
                    ? 'green.500'
                    : 'primary'
                }
                position='absolute'
                left='0'
                top='0'
              />
            ) : (
              <Box w='100%' h='100%' bg='gray.600' position='absolute' left='0' top='0' />
            )}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default BalanceComponent
