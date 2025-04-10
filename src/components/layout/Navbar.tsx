import React from 'react'
/* Chakra UI */
import { Flex, Box, Button, Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import { useRouter } from 'next/navigation'
import { logout } from '@/src/app/action'
import { SkeletonCircle } from '@chakra-ui/react'

const Navbar = () => {
  const { user, isLoading } = useGetUser()

  // Temporalmente se muestra el logout

  const router = useRouter()

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
          <Avatar
            name={user?.first_name + ' ' + user?.last_name}
            backgroundColor={'primary'}
            variant='subtle'
            size='sm'
          >
            <AvatarBadge boxSize='4' bg='green.500' />
          </Avatar>
        ) : (
          <SkeletonCircle size={'8'} />
        )}
      </Flex>
      {/* <Button onClick={handleLogout} variant='icon'>
        <FiLogOut />
      </Button> */}
    </Box>
  )
}

export default Navbar
