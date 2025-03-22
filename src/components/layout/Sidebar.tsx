import { useGetUser } from '@/src/hooks/users/useGetUser'
import { sidebarItems } from '@/src/utils/utils'
import { Box, Button, Divider, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { usePathname } from 'next/navigation'
import React from 'react'
import NextLink from 'next/link'
import { Link } from '@chakra-ui/react'
import Image from 'next/image'
import logo from '@/src/assets/logo.svg'
import { MdClose } from 'react-icons/md'

interface SidebarProps {
  isCollapsed: boolean
  handleCollapse?: () => void
}

export const SidebarItems = ({ isCollapsed }: SidebarProps) => {
  const router = usePathname()
  const bg = useColorModeValue('lightGray', '#333')
  const { user } = useGetUser()
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
              background={router === item.path ? bg : 'transparent'}
              _before={
                router === item.path && {
                  content: '""',
                  position: 'absolute',
                  height: '82%',
                  width: '4px',
                  borderRadius: 'md',
                  background: '#62FEE2',
                  left: '0'
                }
              }
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
            src={!isCollapsed ? logo : logo}
            alt='Logo de Megapix'
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
              <MdClose />
            </Box>
            {!isCollapsed ? <Text>Cerrar</Text> : null}
          </Button>
        </Box>
        {/* <Button
              justifyContent={isCollapsed ? 'center' : 'flex-start'}
              width='100%'
              px={0}
              mb={1}
              variant='aside'
              fontWeight={router === item.path ? '600' : 'normal'}
              background={router === item.path ? bg : 'transparent'}
              _before={
                router === item.path && {
                  content: '""',
                  position: 'absolute',
                  height: '82%',
                  width: '4px',
                  borderRadius: 'md',
                  background: '#62FEE2',
                  left: '0'
                }
              }
            >
              <Box mx={3} fontSize='xl'>
                {item.icon}
              </Box>
              {!isCollapsed ? <Text>{item.title}</Text> : null}
            </Button> */}
      </Flex>
    </Box>
  )
}

export default Sidebar
