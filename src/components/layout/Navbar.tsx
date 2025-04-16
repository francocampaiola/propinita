import React, { useState } from 'react'
/* Chakra UI */
import {
  Flex,
  Box,
  Button,
  Avatar,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  VStack,
  Icon,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  ModalCloseButton
} from '@chakra-ui/react'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import { useRouter } from 'next/navigation'
import { logout } from '@/src/app/action'
import { SkeletonCircle } from '@chakra-ui/react'
import { FiUser, FiLogOut, FiHelpCircle } from 'react-icons/fi'

const Navbar = () => {
  const { user, isLoading } = useGetUser()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <Box
      display={{ base: 'none', md: 'flex' }}
      width='100%'
      backgroundColor={'navbar.bg'}
      height={'16'}
      alignItems={'center'}
      justifyContent={'flex-end'}
    >
      <Flex mr={4} alignItems={'center'}>
        {user ? (
          <>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>
                  <Text fontWeight='bold'>Cerrar sesión</Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text>¿Estás seguro que deseas cerrar sesión?</Text>
                </ModalBody>
                <ModalFooter>
                  <Button variant='ghost' mr={3} onClick={onClose} isDisabled={isLoggingOut}>
                    Cancelar
                  </Button>
                  <Button
                    colorScheme='red'
                    onClick={handleLogout}
                    isLoading={isLoggingOut}
                    loadingText='Cerrando sesión...'
                  >
                    Cerrar sesión
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Menu size={'xs'} placement='bottom-end' autoSelect={false}>
              <MenuButton className='cursor-pointer'>
                <Avatar
                  name={user?.first_name + ' ' + user?.last_name}
                  backgroundColor={'primary'}
                  variant='subtle'
                  size='sm'
                />
              </MenuButton>
              <MenuList minWidth='200px' py={1}>
                <VStack spacing={1} px={3} py={1}>
                  <Avatar
                    name={user?.first_name + ' ' + user?.last_name}
                    backgroundColor={'primary'}
                    variant='subtle'
                    size='md'
                  />
                  <Text fontWeight='bold' fontSize='sm'>
                    {user?.first_name} {user?.last_name}
                  </Text>
                  <Text fontSize='xs' color='gray.500'>
                    {user?.email}
                  </Text>
                </VStack>
                <MenuDivider my={1} />
                <MenuItem icon={<Icon as={FiUser} boxSize={4} />} fontSize='sm'>
                  Mi perfil
                </MenuItem>
                <MenuItem icon={<Icon as={FiHelpCircle} boxSize={4} />} fontSize='sm'>
                  Ayuda
                </MenuItem>
                <MenuDivider my={1} />
                <MenuItem
                  icon={<Icon as={FiLogOut} boxSize={4} />}
                  color='red.500'
                  onClick={onOpen}
                  fontSize='sm'
                >
                  Cerrar sesión
                </MenuItem>
              </MenuList>
            </Menu>
          </>
        ) : (
          <SkeletonCircle size={'8'} />
        )}
      </Flex>
    </Box>
  )
}

export default Navbar
