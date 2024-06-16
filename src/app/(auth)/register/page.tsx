'use client'

import { useState } from 'react'
import { Stack, Input, Button, Flex, Text, InputGroup, InputRightElement } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Link } from '@chakra-ui/next-js'
import { signup } from './actions'

export const RegisterPage = () => {

  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  return (
    <form>
      <Stack mb={'15px'}>
        <Text color={'white'}>Correo electrónico</Text>
        <Input
          isRequired
          id='email'
          name='email'
          type='email'
          color={'white'}
          variant='outline'
          placeholder='Correo electrónico'
          _placeholder={{ opacity: 1, color: 'gray' }}
          w={'420px'}
        />
      </Stack>
      <Stack>
        <Text color={'white'}>Contraseña</Text>
        <InputGroup size='md' mb={'50px'}>
          <Input
            isRequired
            id='password'
            name='password'
            color={'white'}
            pr='4.5rem'
            type={show ? 'text' : 'password'}
            placeholder='Contraseña'
            _placeholder={{ opacity: 1, color: 'gray' }}
          />
          <InputRightElement>
            <Button variant='unstyled' h='1.75rem' size='sm' onClick={handleClick} color={'white'}>
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>

      </Stack>
      <Button
        type='submit'
        formAction={signup}
        variant='outline'
        color={'white'}
        _hover={{
          background: '#B39B24',
          color: 'black'
        }}
        w={'100%'}
      >
        Registrarse
      </Button>
      <Flex gap={2} color={'white'} justifyContent={'center'} mt={'15px'}>
        <Text>¿Ya tienes una cuenta?</Text>
        <Link _hover={{
          color: '#B39B24',
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out'
        }} href='/login'>Iniciá sesión</Link>
      </Flex>
    </form>
  )
}

export default RegisterPage