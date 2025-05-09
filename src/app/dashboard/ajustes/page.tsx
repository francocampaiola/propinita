'use client'
import { Button, Divider, Flex, Switch, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { BiDollar, BiLock, BiMoon } from 'react-icons/bi'
import { BiSun } from 'react-icons/bi'
import { FaQuestionCircle } from 'react-icons/fa'

const AjustesPage = () => {
  return (
    <Flex
      backgroundColor='gray.1000'
      borderRadius='15px'
      direction={'column'}
      justifyContent='space-between'
    >
      <Flex justifyContent='space-between' alignItems={'center'} height={'58px'} mx={4}>
        <Text fontWeight={700}>Ajustes</Text>
      </Flex>
      <Divider borderColor='components.divider' />
      <Flex flex={1} mx={4} mt={4} mb={4} direction='column'>
        <Flex justifyContent={'space-between'}>
          <Flex direction={'column'}>
            <Text fontWeight={700}>Modo oscuro</Text>
            <Text color={'gray.300'}>Cambia entre tema claro y oscuro</Text>
          </Flex>
          <Flex direction={'row'} alignItems={'center'} gap={2}>
            <BiSun size={24} color={'white'} />
            <Switch
              colorScheme='primary'
              sx={{
                '& .chakra-switch__track[data-checked]': {
                  bg: '#B49B25'
                }
              }}
            />
            <BiMoon size={24} color={'white'} />
          </Flex>
        </Flex>
        <Flex direction={'column'} gap={2} mt={4}>
          <Button as={Link} href='/dashboard/ajustes/metodos' variant={'outline'}>
            <BiDollar
              size={15}
              style={{
                marginRight: '5px'
              }}
            />
            Configurar métodos de pago
          </Button>
          <Button as={Link} href='/dashboard/ajustes/cambiar-clave' variant={'outline'}>
            <BiLock
              size={15}
              style={{
                marginRight: '5px'
              }}
            />
            Cambiar contraseña
          </Button>
          <Button as={Link} href='/dashboard/faqs' variant={'outline'}>
            <FaQuestionCircle
              size={12}
              style={{
                marginRight: '5px'
              }}
            />
            Centro de ayuda
          </Button>
          <Button
            color={'white'}
            background={'red.500'}
            _hover={{
              backgroundColor: 'red.600'
            }}
          >
            Cerrar sesión
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default AjustesPage
