'use client'

import React, { useState } from 'react'
import { Stack, Input, Button, Flex, Text, InputGroup, InputRightElement } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Link } from '@chakra-ui/next-js'
import { useRouter } from 'next/navigation'
import { login } from './actions'

const LoginPage = () => {
  const [show, setShow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleClick = () => setShow(!show)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.target)

    try {
      await login(formData)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error during login:', error)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack mb={'15px'}>
        <Text color={'white'}>Correo electrónico</Text>
        <Input
          id='email'
          name='email'
          type='email'
          required
          isRequired
          color={'white'}
          variant='outline'
          placeholder='Correo electrónico'
          _placeholder={{ opacity: 1, color: 'gray' }}
          w={'420px'}
        />
      </Stack>
      <Stack>
        <Text color={'white'}>Contraseña</Text>
        <InputGroup size='md'>
          <Input
            id='password'
            name='password'
            color={'white'}
            pr='4.5rem'
            type={show ? 'text' : 'password'}
            placeholder='Contraseña'
            _placeholder={{ opacity: 1, color: 'gray' }}
            isRequired
          />
          <InputRightElement>
            <Button variant='unstyled' h='1.75rem' size='sm' onClick={handleClick} color={'white'}>
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Text color={'white'} fontSize={'sm'} mt={'5px'} mb={'30px'} _hover={{
          color: '#B39B24',
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out'
        }}>¿Olvidaste tu contraseña?</Text>
      </Stack>
      <Button
        type='submit'
        variant='outline'
        color={'white'}
        _hover={{
          background: '#B39B24',
          color: 'black'
        }}
        w={'100%'}
        isLoading={isLoading}
      >
        Iniciar sesión
      </Button>
      <Flex gap={2} color={'white'} justifyContent={'center'} mt={'15px'}>
        <Text>¿No tienes una cuenta?</Text>
        <Link _hover={{
          color: '#B39B24',
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out'
        }} href='/register'>Registrate</Link>
      </Flex>
    </form>
  )
}

export default LoginPage
