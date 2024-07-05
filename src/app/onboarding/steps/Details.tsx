import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react'
import React from 'react'

const Details = ({ onNext, onBack }: any) => {
  return (
    <Box w={'100%'} minHeight={'100vh'}
      height={'100%'} borderRadius={'xl'}>
      <Flex p={12} direction={'column'} gap={6}>
        <Text textTransform={'uppercase'} fontWeight={'bold'} fontSize={'xl'} color={'gray'}>
          Paso 4
        </Text>
        <Text fontWeight={600} fontSize={'xl'} color={'white'}>
          Detalles
        </Text>
        <Box
          border={'2px solid white'}
          borderRadius={'md'}
          pe={12}
        >
          <Flex flexDirection={'row'} ml={6} mt={6} mb={6} gap={12}>
            <Flex flexDirection={'column'} color={'white'} gap={4}>
              <Flex direction={'column'}>
                <Text fontSize={'small'}>Perfil</Text>
                <Text fontSize={'2xl'}>Usuario</Text>
              </Flex>
              <Flex direction={'column'}>
                <Text fontSize={'small'}>Nombre y Apellido</Text>
                <Text fontSize={'2xl'}>Franco Campaiola</Text>
              </Flex>
              <Flex direction={'column'}>
                <Text fontSize={'small'}>Teléfono</Text>
                <Text fontSize={'2xl'}>+54 9 11 2233 4455</Text>
              </Flex>
            </Flex>
            <Flex flexDirection={'column'} color={'white'} gap={4}>
              <Flex direction={'column'}>
                <Text fontSize={'small'}>Nacionalidad</Text>
                <Text fontSize={'2xl'}>Argentina</Text>
              </Flex>
              <Flex direction={'column'}>
                <Text fontSize={'small'}>Estado civil</Text>
                <Text fontSize={'2xl'}>Soltero</Text>
              </Flex>
              <Flex direction={'column'}>
                <Text fontSize={'small'}>CVU</Text>
                <Text fontSize={'2xl'}>00112233445566778899001122</Text>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Flex>
      <Flex gap={4} mb={12}>
        <Button ml={12} onClick={onBack}>Volver</Button>
        <Button onClick={onNext}>Confirmar</Button>
      </Flex>
    </Box>
  )
}

export default Details