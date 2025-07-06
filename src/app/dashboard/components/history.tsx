import React from 'react'
import Link from 'next/link'
import {
  Divider,
  Flex,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Skeleton,
  VStack,
  HStack,
  Box
} from '@chakra-ui/react'
import { MdOutlineAttachMoney } from 'react-icons/md'
import { useGetTransactions } from '@/src/hooks/transactions/useGetTransactions'
import { formatDate } from '../../utils/functions'

interface Props {
  full?: boolean
}

const HistoryComponent = ({ full = false }: Props) => {
  const { transactions, isLoading } = useGetTransactions()

  if (isLoading) {
    return <Skeleton height='350px' mb={4} borderRadius='md' />
  }

  return (
    <>
      {/* Desktop Version - Mantiene el diseño original con tabla */}
      <Box display={{ base: 'none', md: 'block' }}>
        <Flex
          backgroundColor='components.balance.bg'
          width='100%'
          height='100%'
          borderRadius='md'
          direction='column'
        >
          <Flex justifyContent={'space-between'} my={4} mx={4}>
            {!full ? <Text>Últimas propinas recibidas</Text> : <Text>Historial</Text>}
            {!full && (
              <Link href='/dashboard/historial'>
                <Text
                  _hover={{
                    color: 'primary',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  Ver todo
                </Text>
              </Link>
            )}
          </Flex>
          <Divider borderColor='components.divider' />
          <TableContainer>
            <Table variant='striped'>
              {transactions?.length > 1 && full ? (
                <TableCaption mb={4}>
                  <Flex justifyContent={'flex-end'}>
                    <Text>Total de propinas: {transactions?.length}</Text>
                  </Flex>
                </TableCaption>
              ) : (
                <TableCaption />
              )}
              <Thead>
                <Tr>
                  <Th>Detalle</Th>
                  <Th isNumeric>Monto</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactions?.length > 0 ? (
                  full ? (
                    transactions?.map((transaction) => (
                      <Tr key={transaction.id}>
                        <Td>
                          <Flex alignItems={'center'} gap={2}>
                            <MdOutlineAttachMoney size={30} />
                            <Flex direction={'column'}>
                              <Text fontSize={'sm'}>Propina recibida</Text>
                              <Text fontSize={'xs'}>{formatDate(transaction.created_at)}</Text>
                            </Flex>
                          </Flex>
                        </Td>
                        <Td isNumeric>
                          {transaction.amount.toLocaleString('es-AR', {
                            style: 'currency',
                            currency: 'ARS'
                          })}
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    transactions?.slice(0, 3).map((transaction) => (
                      <Tr key={transaction.id}>
                        <Td>
                          <Flex alignItems={'center'} gap={2}>
                            <MdOutlineAttachMoney size={30} />
                            <Flex direction={'column'}>
                              <Text fontSize={'sm'}>Propina recibida</Text>
                              <Text fontSize={'xs'}>{formatDate(transaction.created_at)}</Text>
                            </Flex>
                          </Flex>
                        </Td>
                        <Td isNumeric>
                          {transaction.amount.toLocaleString('es-AR', {
                            style: 'currency',
                            currency: 'ARS'
                          })}
                        </Td>
                      </Tr>
                    ))
                  )
                ) : (
                  <Tr>
                    <Td colSpan={2}>
                      <Flex justifyContent={'center'} alignItems={'center'} w={'100%'} h={'20'}>
                        <Text>Todavía no recibiste propinas.</Text>
                      </Flex>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </Box>

      {/* Mobile Version - Diseño con cards */}
      <Box display={{ base: 'block', md: 'none' }}>
        <Flex
          backgroundColor='components.balance.bg'
          width='100%'
          borderRadius='md'
          direction='column'
          p={4}
        >
          {/* Header */}
          <Flex justifyContent={'space-between'} alignItems='center' mb={4}>
            <Text fontWeight={700} fontSize='lg'>
              {!full ? 'Últimas propinas' : 'Historial completo'}
            </Text>
            {!full && (
              <Link href='/dashboard/historial'>
                <Text color='primary' fontSize='sm' _hover={{ textDecoration: 'underline' }}>
                  Ver todo
                </Text>
              </Link>
            )}
          </Flex>

          {/* Content */}
          <VStack spacing={3} align='stretch'>
            {transactions?.length > 0 ? (
              (full ? transactions : transactions?.slice(0, 3))?.map((transaction) => (
                <Box
                  key={transaction.id}
                  p={3}
                  bg='gray.700'
                  borderRadius='md'
                  border='1px solid'
                  borderColor='gray.600'
                >
                  <HStack justify='space-between' align='flex-start'>
                    <HStack spacing={3} align='flex-start'>
                      <Box
                        p={2}
                        bg='primary'
                        borderRadius='md'
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                      >
                        <MdOutlineAttachMoney size={20} color='white' />
                      </Box>
                      <VStack align='flex-start' spacing={1}>
                        <Text fontSize='sm' fontWeight='medium'>
                          Propina recibida
                        </Text>
                        <Text fontSize='xs' color='gray.400'>
                          {formatDate(transaction.created_at)}
                        </Text>
                      </VStack>
                    </HStack>
                    <Text fontSize='sm' fontWeight='bold' color='primary'>
                      {transaction.amount.toLocaleString('es-AR', {
                        style: 'currency',
                        currency: 'ARS'
                      })}
                    </Text>
                  </HStack>
                </Box>
              ))
            ) : (
              <Box
                p={6}
                textAlign='center'
                bg='gray.700'
                borderRadius='md'
                border='1px dashed'
                borderColor='gray.600'
              >
                <VStack spacing={2}>
                  <MdOutlineAttachMoney size={40} color='#666' />
                  <Text color='gray.400' fontSize='sm'>
                    Todavía no recibiste propinas
                  </Text>
                  <Text color='gray.500' fontSize='xs'>
                    Cuando alguien te envíe una propina, aparecerá aquí
                  </Text>
                </VStack>
              </Box>
            )}

            {full && transactions?.length > 1 && (
              <Box mt={2} textAlign='right'>
                <Text fontSize='xs' color='gray.400'>
                  Total de propinas: {transactions?.length}
                </Text>
              </Box>
            )}
          </VStack>
        </Flex>
      </Box>
    </>
  )
}

export default HistoryComponent
