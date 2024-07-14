import { Box, Button, Flex, Input, Select, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const UserPersonalData = ({ onNext, onBack }: any) => {
  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [phone, setPhone] = useState('');
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  useEffect(() => {
    // Verifica si todos los campos requeridos están completos
    if (name && nationality && maritalStatus && phone) {
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(true);
    }
  }, [name, nationality, maritalStatus, phone]);

  return (
    <Box w={'100%'} minHeight={'100vh'} height={'100%'} borderRadius={'xl'} fontFamily={'poppins'}>
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
          <Input
            placeholder='Ingresar como figura en el DNI'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            color={'white'}
          />
        </Flex>
        <Flex direction={'column'} gap={2}>
          <Text color={'white'}>Nacionalidad</Text>
          <Select
            color={'white'}
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            required
          >
            <option value="">Seleccione una opción</option>
            <option value="Argentina">Argentina</option>
            <option value="Brasil">Brasil</option>
            <option value="Chile">Chile</option>
            <option value="Uruguay">Uruguay</option>
            <option value="Paraguay">Paraguay</option>
            <option value="Bolivia">Bolivia</option>
            <option value="Perú">Perú</option>
            <option value="Ecuador">Ecuador</option>
            <option value="Colombia">Colombia</option>
            <option value="Venezuela">Venezuela</option>
            <option value="Panamá">Panamá</option>
            <option value="Costa Rica">Costa Rica</option>
            <option value="Nicaragua">Nicaragua</option>
            <option value="Honduras">Honduras</option>
            <option value="El Salvador">El Salvador</option>
            <option value="Guatemala">Guatemala</option>
          </Select>
        </Flex>
        <Flex direction={'column'} gap={2}>
          <Text color={'white'}>Estado civil</Text>
          <Select
            color={'white'}
            value={maritalStatus}
            onChange={(e) => setMaritalStatus(e.target.value)}
            required
          >
            <option value="">Seleccione una opción</option>
            <option value="Soltero">Soltero</option>
            <option value="Casado">Casado</option>
            <option value="Divorciado">Divorciado</option>
            <option value="Viudo">Viudo</option>
          </Select>
        </Flex>
        <Flex direction={'column'} gap={2}>
          <Text color={'white'}>Teléfono</Text>
          <Input
            placeholder='1122334455'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            color={'white'}
          />
        </Flex>
      </Flex>
      <Flex gap={4} mb={12}>
        <Button ml={12} onClick={onBack}>Volver</Button>
        <Button onClick={onNext} isDisabled={isNextDisabled}>Siguiente</Button>
      </Flex>
    </Box>
  )
}

export default UserPersonalData;
