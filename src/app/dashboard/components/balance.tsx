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
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Skeleton
} from '@chakra-ui/react'
import { useGetBalance } from '@/src/hooks/balance/useGetBalance'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { FaInfoCircle } from 'react-icons/fa'
import { BsGraphUp, BsGraphDown } from 'react-icons/bs'
import { GrUpdate } from 'react-icons/gr'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import { calculateMonthlyGoalPercentage } from '@/src/utils/utils'
import { useGetTransactions } from '@/src/hooks/transactions/useGetTransactions'
import { useTransactionStats } from '@/src/hooks/transactions/useTransactionStats'
import { createClient } from '@/src/utils/supabase/client'

const BalanceComponent = () => {
  const [showBalance, setShowBalance] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)
  const [monthlyGoal, setMonthlyGoal] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const { balance: data, isLoading, refetch } = useGetBalance()
  const { user, isLoading: isUserLoading, refetch: refetchUser } = useGetUser()
  const {
    transactions,
    isLoading: isTransactionsLoading,
    refetch: refetchTransactions
  } = useGetTransactions()
  const { stats } = useTransactionStats()

  const handleRefetch = async () => {
    setIsRefetching(true)
    await Promise.all([refetch(), refetchUser(), refetchTransactions()])
    setIsRefetching(false)
  }

  const handleSetMonthlyGoal = async () => {
    if (!monthlyGoal || isNaN(Number(monthlyGoal)) || Number(monthlyGoal) <= 0) {
      toast({
        title: 'Error',
        description: 'Por favor, ingresa un monto válido',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      return
    }

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('users')
        .update({ monthly_goal: Number(monthlyGoal) })
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: 'Meta actualizada',
        description: 'Tu meta mensual ha sido actualizada correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true
      })

      await refetchUser()
      onClose()
      setMonthlyGoal('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al actualizar tu meta mensual',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || isUserLoading || isTransactionsLoading) {
    return <Skeleton height='320px' mb={4} borderRadius='md' />
  }

  const weekPercentageChange = stats.thisWeek.percentageChange
  const isPositive = weekPercentageChange >= 0
  const Icon = isPositive ? BsGraphUp : BsGraphDown
  const color = isPositive ? 'green.500' : 'red.500'

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
            colorScheme={isPositive ? 'green' : 'red'}
            borderRadius={'lg'}
            backgroundColor={'transparent'}
            borderWidth={1}
            borderStyle='solid'
            borderColor={color}
          >
            <TagLeftIcon boxSize='12px' as={Icon} color={color} />
            <TagLabel color={color}>
              {showBalance
                ? '******'
                : `${isPositive ? '+' : ''}${weekPercentageChange.toFixed(1)}% esta semana`}
            </TagLabel>
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
            <Text fontSize='sm' color='gray.400'>
              Progreso mensual
            </Text>
            {!user?.monthly_goal ? (
              <Button size='xs' variant='outline' colorScheme='primary' onClick={onOpen}>
                Configurar meta
              </Button>
            ) : (
              <Flex alignItems='center' gap={2}>
                <Text fontSize={'xs'}>
                  {calculateMonthlyGoalPercentage(user?.monthly_goal, transactions).percentage}%
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
            {user?.monthly_goal ? (
              <Box
                w={`${calculateMonthlyGoalPercentage(user.monthly_goal, transactions).percentage}%`}
                h='100%'
                bg={
                  calculateMonthlyGoalPercentage(user?.monthly_goal, transactions).isCompleted
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg='gray.800' color='white'>
          <ModalHeader>Configurar meta mensual</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Meta mensual (ARS)</FormLabel>
              <Input
                type='number'
                placeholder='Ingresa el monto'
                value={monthlyGoal}
                onChange={(e) => setMonthlyGoal(e.target.value)}
                min={0}
                step={100}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button variant='primary' onClick={handleSetMonthlyGoal} isLoading={isSubmitting}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default BalanceComponent
