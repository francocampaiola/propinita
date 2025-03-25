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
import Link from 'next/link'
import React from 'react'
import { MdOutlineAttachMoney } from 'react-icons/md'

const HistoryComponent = () => {
  return (
    <Flex
      backgroundColor='components.balance.bg'
      width='100%'
      height='100%'
      borderRadius='md'
      direction='column'
    >
      <Flex justifyContent={'space-between'} my={4} mx={4}>
        <Text>Historial</Text>
        <Link href='/dashboard/historial'>
          <Text
            _hover={{ color: 'primary', cursor: 'pointer', transition: 'all 0.3s ease-in-out' }}
          >
            Ver todo
          </Text>
        </Link>
      </Flex>
      <Divider borderColor='components.balance.divider' />
      <TableContainer>
        <Table variant='striped'>
          <TableCaption mb={4}>
            <Flex justifyContent={'flex-end'}>
              <Text>Total de propinas: 3</Text>
            </Flex>
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Detalle</Th>
              <Th isNumeric>Monto</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <Flex dir='row' alignItems={'center'}>
                  <MdOutlineAttachMoney size={30} />
                  <Flex direction={'column'}>
                    <Text>Propina recibida</Text>
                    <Text>hace 1 día</Text>
                  </Flex>
                </Flex>
              </Td>
              <Td isNumeric>+$25.4</Td>
            </Tr>
            <Tr>
              <Td>
                <Flex dir='row' alignItems={'center'}>
                  <MdOutlineAttachMoney size={30} />
                  <Flex direction={'column'}>
                    <Text>Propina recibida</Text>
                    <Text>hace 1 día</Text>
                  </Flex>
                </Flex>
              </Td>
              <Td isNumeric>+$30.48</Td>
            </Tr>
            <Tr>
              <Td>
                <Flex dir='row' alignItems={'center'}>
                  <MdOutlineAttachMoney size={30} />
                  <Flex direction={'column'}>
                    <Text>Propina recibida</Text>
                    <Text>hace 1 día</Text>
                  </Flex>
                </Flex>
              </Td>
              <Td isNumeric>+$0.91444</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  )
}

export default HistoryComponent
