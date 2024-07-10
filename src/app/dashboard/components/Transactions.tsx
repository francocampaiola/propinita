import { Divider, Flex, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'

const Transactions = () => {
  return (
    <TableContainer bg={'#EAEAEA'} boxShadow={'md'}>
      <Table size='sm' bg='#EAEAEA'>
        <TableCaption placement="top" textAlign={'left'}>
          <Flex gap={4} flexDirection={'column'}>

          <Text fontWeight={'semibold'} color={'#494F59'} fontSize={'md'}>Transacciones</Text>
          <Divider orientation='horizontal' size={'md'} borderColor={'white'}  mb={4} />
          </Flex>
        </TableCaption>
        <Thead>
          <Tr>
            <Th fontWeight="bold">ID</Th>
            <Th fontWeight="bold">Fecha</Th>
            <Th fontWeight="bold">Hora</Th>
            <Th fontWeight="bold">Concepto</Th>
            <Th fontWeight="bold" isNumeric>Monto</Th>
            <Th fontWeight="bold" isNumeric>Estado</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr bg='#D9D9D9'>
            <Td>#1</Td>
            <Td>2022-01-01</Td>
            <Td>12:00</Td>
            <Td>Propina</Td>
            <Td isNumeric>$ 500.00</Td>
            <Td isNumeric>Completado</Td>
          </Tr>
          <Tr bg='#D9D9D9'>
            <Td>#2</Td>
            <Td>2022-01-02</Td>
            <Td>12:00</Td>
            <Td>Propina</Td>
            <Td isNumeric>$ 500.00</Td>
            <Td isNumeric>Completado</Td>
          </Tr>
          <Tr bg='#D9D9D9'>
            <Td>#3</Td>
            <Td>2022-01-03</Td>
            <Td>12:00</Td>
            <Td>Propina</Td>
            <Td isNumeric>$ 500.00</Td>
            <Td isNumeric>Completado</Td>
          </Tr>
          <Tr bg='#D9D9D9'>
            <Td>#4</Td>
            <Td>2022-01-04</Td>
            <Td>12:00</Td>
            <Td>Propina</Td>
            <Td isNumeric>$ 500.00</Td>
            <Td isNumeric>Completado</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default Transactions
