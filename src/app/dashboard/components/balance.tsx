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

const BalanceComponent = () => {
  const [showBalance, setShowBalance] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)

  const { balance: data, isLoading, refetch } = useGetBalance()

  const handleRefetch = async () => {
    setIsRefetching(true)
    await refetch()
    setIsRefetching(false)
  }

  if (isLoading) {
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
            <Text fontSize={'xs'}>64%</Text>
          </Flex>
          <Box
            w='100%'
            h='8px'
            bg='gray.700'
            borderRadius='full'
            overflow='hidden'
            position='relative'
          >
            <Box w='64%' h='100%' bg='primary' position='absolute' left='0' top='0' />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default BalanceComponent
