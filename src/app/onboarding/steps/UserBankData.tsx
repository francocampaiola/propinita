import { Box, Text, Flex, Button } from '@chakra-ui/react';
import React from 'react'
import { SiMercadopago } from 'react-icons/si';

const UserBankData = ({ onNext, onBack }: any) => {
  return (
    <Box w={'100%'} minHeight={'100vh'}
      height={'100%'} borderRadius={'xl'}>
      <Flex p={12} direction={'column'} gap={6}>
        <Text textTransform={'uppercase'} fontWeight={'bold'} fontSize={'xl'} color={'gray'}>
          Paso 3
        </Text>
        <Text fontWeight={600} fontSize={'xl'} color={'white'}>
          Integremos tu cuenta bancaria
        </Text>
        <Text fontSize={'md'} color={'white'}>
          Vinculá tu cuenta con MercadoPago para recibir o realizar tus pagos.
        </Text>
        <Flex direction={'column'} mt={12} gap={4} mb={8}>
          <Flex
            cursor={'pointer'}
            direction={'row'}
            p={8}
            align={'center'}
            gap={4}
            borderRadius={'lg'}
            border={`3px solid gray`}
          >
            <Box p={2} bg={'black'} borderRadius={'lg'}>
              <SiMercadopago size={30} color={'white'} />
            </Box>
            <Flex direction={'column'} gap={2}>
              <Text fontSize={'xl'} color={'white'}>
                Vincular con MercadoPago
              </Text>
              <Text fontSize={'xs'} color={'white'}>
                Debe ser una cuenta de MercadoPago habilitada sin ninguna sujeción a personas políticamente expuestas o sin comprobantes de ingresos.
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex gap={4} mb={12}>
        <Button ml={12} onClick={onBack}>Volver</Button>
        <Button onClick={onNext}>Siguiente</Button>
      </Flex>
    </Box>
  )
}

export default UserBankData