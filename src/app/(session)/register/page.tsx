'use client'

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Stack, Input, Button, Flex, Text, InputGroup, InputRightElement } from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import { useState } from 'react'

const Register = () => {

  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  return (
    <>
      <Stack mb={'15px'}>
        <Text color={'white'}>Correo electrónico</Text>
        <Input
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
        variant='outline'
        color={'white'}
        _hover={{
          background: '#B39B24',
          color: 'black'
        }}
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
    </>
  )
}

// "whiteAlpha" | "blackAlpha" | "gray" | "red" | "orange" | "yellow" | "green" | "teal" | "blue" | "cyan" | "purple" | "pink" | "linkedin" | "facebook" | "messenger" | "whatsapp" | "twitter" | "telegram"

export default Register