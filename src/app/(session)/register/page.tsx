
import { Stack, Input, Button, Flex, Text } from '@chakra-ui/react'

const Register = () => {
  return (
    <>
      <Stack>
        <Text color={'white'}>Correo electrónico</Text>
        <Input
          placeholder='custom placeholder'
          _placeholder={{ opacity: 1, color: 'gray' }}
        />
      </Stack>
      <Stack>
        <Text color={'white'}>Contraseña</Text>
        <Input
          placeholder='custom placeholder'
          _placeholder={{ opacity: 1, color: 'gray' }}
        />
        <Text color={'white'}>¿Olvidaste tu contraseña?</Text>
      </Stack>
      <Button>Iniciar sesión</Button>
      <Flex gap={2} color={'white'}>
        <Text>¿No tienes una cuenta?</Text>
        <Text>Regístrate</Text>
      </Flex>
    </>
  )
}

export default Register