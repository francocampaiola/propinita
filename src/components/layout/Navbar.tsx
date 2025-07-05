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
  ModalCloseButton,
  HStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack as ChakraVStack
} from '@chakra-ui/react'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import { useRouter } from 'next/navigation'
import { logout } from '@/src/app/action'
import { SkeletonCircle } from '@chakra-ui/react'
import { FiUser, FiLogOut, FiHelpCircle, FiMenu } from 'react-icons/fi'
import Image from 'next/image'
import logo from '@/src/assets/logo.svg'
import smallLogo from '@/src/assets/small_logo.svg'
import { sidebarItems } from '@/src/utils/utils'
import NextLink from 'next/link'
import { Link } from '@chakra-ui/react'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const { user, isLoading } = useGetUser()
  const router = useRouter()
  const pathname = usePathname()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure()
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
      {/* Desktop Version - Mantiene el diseño original */}
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
                    color={'white'}
                  />
                </MenuButton>
                <MenuList minWidth='200px' py={1}>
                  <VStack spacing={1} px={3} py={1}>
                    <Avatar
                      name={user?.first_name + ' ' + user?.last_name}
                      backgroundColor={'primary'}
                      variant='subtle'
                      size='md'
                      color={'white'}
                    />
                    <Text fontWeight='bold' fontSize='sm'>
                      {user?.first_name} {user?.last_name}
                    </Text>
                    <Text fontSize='xs' color='gray.500'>
                      {user?.email}
                    </Text>
                  </VStack>
                  <MenuDivider my={1} />
                  <MenuItem
                    icon={<Icon as={FiUser} boxSize={4} />}
                    fontSize='sm'
                    onClick={() => router.push('/dashboard/perfil')}
                  >
                    Mi perfil
                  </MenuItem>
                  <MenuItem
                    icon={<Icon as={FiHelpCircle} boxSize={4} />}
                    fontSize='sm'
                    onClick={() => router.push('/dashboard/faqs')}
                  >
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

      {/* Mobile Version - Navbar con logo y menú hamburguesa */}
      <Box
        display={{ base: 'flex', md: 'none' }}
        width='100%'
        backgroundColor={'navbar.bg'}
        height={'16'}
        alignItems={'center'}
        justifyContent={'space-between'}
        px={4}
        position='sticky'
        top={0}
        zIndex={20}
      >
        {/* Logo */}
        <Box>
          <Image
            src={smallLogo}
            alt='Logo de Propinita'
            height={24}
            style={{ filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))' }}
          />
        </Box>

        {/* Menú hamburguesa */}
        <Button variant='ghost' size='sm' onClick={onDrawerOpen} p={2}>
          <FiMenu size={24} />
        </Button>
      </Box>

      {/* Mobile Sidebar Drawer */}
      <Drawer isOpen={isDrawerOpen} placement='left' onClose={onDrawerClose} size='full'>
        <DrawerOverlay />
        <DrawerContent bg='sidebar.dark.bg' height='full' sx={{ height: ['100dvh', '100vh'] }}>
          <DrawerHeader borderBottomWidth='1px' borderColor='gray.700' py={4}>
            <Flex alignItems='center' justifyContent='space-between' width='100%'>
              <Flex alignItems='center' gap={3}>
                <Image
                  src={logo}
                  alt='Logo de Propinita'
                  height={28}
                  style={{ filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))' }}
                />
              </Flex>
              <DrawerCloseButton position='static' color='white' size='lg' />
            </Flex>
          </DrawerHeader>

          <DrawerBody p={0}>
            <ChakraVStack spacing={0} align='stretch' height='100%' justify='space-between'>
              {/* Menú items */}
              <ChakraVStack spacing={0} align='stretch' mt={4}>
                {sidebarItems.map((item) => (
                  <Link as={NextLink} href={item.path} key={item.path} onClick={onDrawerClose}>
                    <Button
                      justifyContent='flex-start'
                      width='100%'
                      px={6}
                      py={4}
                      variant='ghost'
                      fontWeight={pathname === item.path ? '600' : 'normal'}
                      background={pathname === item.path ? 'primary' : 'transparent'}
                      color='white'
                      _hover={{
                        background: pathname === item.path ? 'primary' : 'gray.700'
                      }}
                      borderRadius={0}
                      fontSize='md'
                      _active={{
                        background: pathname === item.path ? 'primary' : 'gray.600'
                      }}
                    >
                      <Box mr={4} fontSize='xl' opacity={0.9}>
                        {item.icon}
                      </Box>
                      <Text fontSize='md'>{item.title}</Text>
                    </Button>
                  </Link>
                ))}
              </ChakraVStack>

              {/* Perfil del usuario - contra abajo */}
              {user && (
                <Box borderTop='1px solid' borderColor='gray.600' p={4}>
                  <Button
                    width='100%'
                    variant='ghost'
                    color='white'
                    _hover={{ background: 'gray.700' }}
                    borderRadius='lg'
                    p={3}
                    height='auto'
                    _active={{ background: 'gray.600' }}
                    onClick={() => {
                      onDrawerClose()
                      // En mobile cierra sesión directamente, en desktop abre confirmación
                      if (window.innerWidth < 768) {
                        handleLogout()
                      } else {
                        onOpen()
                      }
                    }}
                  >
                    <HStack spacing={3} width='100%' justify='flex-start'>
                      <Avatar
                        name={user?.first_name + ' ' + user?.last_name}
                        backgroundColor={'primary'}
                        variant='subtle'
                        size='sm'
                        color={'white'}
                      />
                      <VStack align='flex-start' spacing={1}>
                        <Text color='white' fontWeight='bold' fontSize='sm'>
                          {user?.first_name} {user?.last_name}
                        </Text>
                        <Text color='gray.400' fontSize='xs'>
                          {user?.email}
                        </Text>
                        <HStack spacing={2} mt={1}>
                          <Icon as={FiLogOut} color='red.300' fontSize='xs' />
                          <Text color='red.300' fontSize='xs' fontWeight='medium'>
                            Cerrar sesión
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>
                  </Button>
                </Box>
              )}
            </ChakraVStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Modal de confirmación de logout (compartido) */}
      <Box display={{ base: 'none', md: 'block' }}>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent
            sx={{
              width: '400px !important',
              minWidth: '400px !important',
              maxWidth: '400px !important',
              p: '0 !important'
            }}
          >
            <ModalHeader textAlign='left'>
              <Text fontWeight='bold'>Cerrar sesión</Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody textAlign='left'>
              <Text>¿Estás seguro que deseas cerrar sesión?</Text>
            </ModalBody>
            <ModalFooter>
              <Box
                display='flex'
                flexDirection='row'
                gap={2}
                width='100%'
                justifyContent='center'
                alignItems='center'
              >
                <Button variant='ghost' onClick={onClose} isDisabled={isLoggingOut}>
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
              </Box>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  )
}

export default Navbar
