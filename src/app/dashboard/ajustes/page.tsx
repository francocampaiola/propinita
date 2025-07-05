'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout } from '../../action'
import {
  Button,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { BiDollar, BiLock } from 'react-icons/bi'
import { FaQuestionCircle } from 'react-icons/fa'

const AjustesPage = () => {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        closeOnOverlayClick={!isLoggingOut}
        closeOnEsc={!isLoggingOut}
        motionPreset='slideInBottom'
        size={{ base: 'sm', md: 'md' }}
      >
        <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px)' />
        <ModalContent mx={4} borderRadius='lg' boxShadow='xl'>
          <ModalHeader pb={2}>
            <Text fontWeight='bold' fontSize={{ base: 'lg', md: 'xl' }}>
              Cerrar sesión
            </Text>
          </ModalHeader>
          <ModalCloseButton size='lg' isDisabled={isLoggingOut} />
          <ModalBody pb={4}>
            <Text fontSize={{ base: 'md', md: 'lg' }}>¿Estás seguro que deseas cerrar sesión?</Text>
          </ModalBody>
          <ModalFooter gap={3} flexDirection={{ base: 'column', md: 'row' }}>
            <Button
              variant='ghost'
              onClick={onClose}
              isDisabled={isLoggingOut}
              w={{ base: 'full', md: 'auto' }}
              size={{ base: 'lg', md: 'md' }}
            >
              Cancelar
            </Button>
            <Button
              colorScheme='red'
              onClick={handleLogout}
              isLoading={isLoggingOut}
              loadingText='Cerrando sesión...'
              w={{ base: 'full', md: 'auto' }}
              size={{ base: 'lg', md: 'md' }}
            >
              Cerrar sesión
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
          {/* <Flex justifyContent={'space-between'}>
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
        </Flex> */}
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
              onClick={onOpen}
            >
              Cerrar sesión
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default AjustesPage
