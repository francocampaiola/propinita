import React, { useState } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { IoPersonOutline, IoRestaurantOutline } from 'react-icons/io5';

const UserType = ({ onNext }: any) => {
  const [userType, setUserType] = useState('user');

  const handleSelectUserType = (type: string) => {
    setUserType(type);
  };

  return (
    <Box height={'100vh'} w={'100%'} borderRadius={'xl'}>
      <Flex p={12} direction={'column'} gap={6}>
        <Text textTransform={'uppercase'} fontWeight={'bold'} fontSize={'xl'} color={'gray'}>
          Paso 1
        </Text>
        <Text fontWeight={600} fontSize={'xl'} color={'white'}>
          ¿Con qué perfil te identificás?
        </Text>
        <Text fontSize={'md'} color={'white'}>
          Selecciona una opción para que te podamos dar información precisa.
        </Text>
      </Flex>
      <Flex direction={'column'} ml={12} gap={4} mb={8}>
        <Flex
          cursor={'pointer'}
          direction={'row'}
          p={8}
          align={'center'}
          gap={4}
          border={`3px solid ${userType === 'user' ? '#B39B24' : 'gray'}`}
          borderRadius={'lg'}
          onClick={() => handleSelectUserType('user')}
        >
          <Box p={2} bg={'black'} borderRadius={'lg'}>
            <IoPersonOutline size={30} color={'white'} />
          </Box>
          <Flex direction={'column'} gap={2}>
            <Text fontSize={'xl'} color={'white'}>
              Usuario
            </Text>
            <Text fontSize={'xs'} color={'white'}>
              Como trabajador independiente, recibo ventajas en el régimen monotributista. <br /> Me clasifico en categorías según mis ingresos y no tengo la opción de contratar empleados.
            </Text>
          </Flex>
        </Flex>
        <Flex
          cursor={'pointer'}
          direction={'row'}
          p={8}
          align={'center'}
          gap={4}
          border={`3px solid ${userType === 'provider' ? '#B39B24' : 'gray'}`}
          borderRadius={'lg'}
          onClick={() => handleSelectUserType('provider')}
        >
          <Box p={2} bg={'black'} borderRadius={'lg'}>
            <IoRestaurantOutline size={30} color={'white'} />
          </Box>
          <Flex direction={'column'} gap={2}>
            <Text fontSize={'xl'} color={'white'}>
              Proveedor
            </Text>
            <Text fontSize={'xs'} color={'white'}>
              Como trabajador independiente, recibo ventajas en el régimen monotributista. <br /> Me clasifico en categorías según mis ingresos y no tengo la opción de contratar empleados.
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Button ml={12} onClick={onNext}>Siguiente</Button>
    </Box>
  );
};

export default UserType;
