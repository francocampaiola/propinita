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
  Tr
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
      <Flex justifyContent={'space-between'} my={4} mx={4}>
        {!full ? <Text>Últimas propinas recibidas</Text> : <Text>Historial</Text>}
        {!full && (
          <Link href='/dashboard/historial'>
            <Text
              _hover={{ color: 'primary', cursor: 'pointer', transition: 'all 0.3s ease-in-out' }}
            >
              Ver todo
            </Text>
          </Link>
        )}
      </Flex>
      <Divider borderColor='components.balance.divider' />
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
            {transactions?.length > 1 ? (
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
  )
}

export default HistoryComponent
