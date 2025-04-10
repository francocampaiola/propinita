import React from 'react'

import { usePathname, useRouter } from 'next/navigation'
import NextLink from 'next/link'
import Image from 'next/image'

import { Box, Button, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { Link } from '@chakra-ui/react'
import { TbLayoutSidebarRightCollapse } from 'react-icons/tb'

import { sidebarItems } from '@/src/utils/utils'
import logo from '@/src/assets/logo.svg'
import smallLogo from '@/src/assets/small_logo.svg'
import { BiLogOut } from 'react-icons/bi'
import { logout } from '@/src/app/action'

interface SidebarProps {
  isCollapsed: boolean
  handleCollapse?: () => void
}

export const SidebarItems = ({ isCollapsed }: SidebarProps) => {
  const router = usePathname()

  return (
    <Box my={6} px={isCollapsed ? 2 : 5}>
      <Flex flexDirection='column'>
        {sidebarItems.map((item) => (
          <Link as={NextLink} href={item.path} key={item.path}>
            <Button
              justifyContent={isCollapsed ? 'center' : 'flex-start'}
              width='100%'
              px={0}
              mb={1}
              variant='aside'
              fontWeight={router === item.path ? '600' : 'normal'}
              background={router === item.path ? 'primary' : 'transparent'}
              _hover={{
                background:
                  router === item.path ? null : router === item.path ? 'secondary' : 'gray.900'
              }}
            >
              <Box mx={3} fontSize='xl'>
                {item.icon}
              </Box>
              {!isCollapsed ? <Text>{item.title}</Text> : null}
            </Button>
          </Link>
        ))}
      </Flex>
    </Box>
  )
}

const Sidebar = ({ isCollapsed, handleCollapse }: SidebarProps) => {
  const bg = useColorModeValue('sidebar.light.bg', 'sidebar.dark.bg')
  const router = useRouter()
  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      throw error
    }
  }

  return (
    <Box
      minHeight='100%'
      width={isCollapsed ? '80px' : '258px'}
      background={bg}
      position='fixed'
      boxShadow='-3px 0 5px 0 #555'
      zIndex='10'
    >
      <Flex justifyContent={isCollapsed ? 'center' : 'flex-start'} px={isCollapsed ? 2 : 5} py={8}>
        <Box minHeight='29px' ml={!isCollapsed && 3}>
          <Image
            style={{ filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))' }}
            src={!isCollapsed ? logo : smallLogo}
            alt='Logo de Propinita'
            height={isCollapsed ? '20' : '30'}
          />
        </Box>
      </Flex>
      <Flex flexDirection='column' height='calc(100vh - 93px)'>
        <SidebarItems isCollapsed={isCollapsed} />
        <Box px={isCollapsed ? 2 : 5}>
          <Button
            justifyContent={isCollapsed ? 'center' : 'flex-start'}
            width='100%'
            px={0}
            mb={1}
            variant='aside'
            fontWeight={'normal'}
            background={'transparent'}
            onClick={() => handleCollapse()}
            my={6}
          >
            <Box mx={3} fontSize='xl' transform={isCollapsed ? '' : 'rotate(180deg)'}>
              <TbLayoutSidebarRightCollapse />
            </Box>
            {!isCollapsed ? <Text>Cerrar</Text> : null}
          </Button>
          {/* Cerrar sesión */}
          <Button
            justifyContent={isCollapsed ? 'center' : 'flex-start'}
            width='100%'
            px={0}
            mb={1}
            variant='aside'
            fontWeight={'normal'}
            background={'transparent'}
            onClick={() => handleLogout()}
            my={6}
          >
            <Box mx={3} fontSize='xl' transform={isCollapsed ? '' : 'rotate(180deg)'}>
              <BiLogOut />
            </Box>
            {!isCollapsed ? <Text>Cerrar sesión</Text> : null}
          </Button>
        </Box>
      </Flex>
    </Box>
  )
}

export default Sidebar
