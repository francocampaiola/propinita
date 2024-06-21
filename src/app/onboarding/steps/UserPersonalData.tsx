import { Box, Button, Flex, Input, Select, Text } from '@chakra-ui/react';

const UserPersonalData = ({ onNext, onBack }: any) => {
  return (
    <Box w={'100%'} minHeight={'100vh'}
    height={'100%'} borderRadius={'xl'} fontFamily={'poppins'}>
      <Flex p={12} direction={'column'} gap={6}>
        <Text textTransform={'uppercase'} fontWeight={'bold'} fontSize={'xl'} color={'gray'}>
          Paso 2
        </Text>
        <Text fontWeight={600} fontSize={'xl'} color={'white'}>
          Completemos tus datos personales
        </Text>
        <Text fontSize={'md'} color={'white'}>
          Utilizamos esta información para personalizar tu experiencia.
        </Text>
      </Flex>
      <Flex direction={'column'} ml={12} gap={4} mb={8}>
        <Flex direction={'column'} gap={2}>
          <Text color={'white'}>Nombre y apellido</Text>
          <Input placeholder='Ingresar como figura en el DNI'></Input>
        </Flex>
        <Flex direction={'column'} gap={2}>
          <Text color={'white'}>Nacionalidad</Text>
          <Select color={'white'}>
            <option value="Argentina">Argentina</option>
          </Select>
        </Flex>
        <Flex direction={'column'} gap={2}>
          <Text color={'white'}>Estado civil</Text>
          <Select color={'white'}>
            <option value="Soltero">Soltero</option>
          </Select>
        </Flex>
        <Flex direction={'column'} gap={2}>
          <Text color={'white'}>Teléfono</Text>
          <Input placeholder='+54 9 11 2233 4455'></Input>
        </Flex>
      </Flex>
      <Flex gap={4} mb={12}>
        <Button ml={12} onClick={onBack}>Volver</Button>
        <Button onClick={onNext}>Siguiente</Button>
      </Flex>
    </Box>
  )
}

export default UserPersonalData