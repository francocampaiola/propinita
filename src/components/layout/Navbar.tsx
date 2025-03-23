import React from 'react'
/* Chakra UI */
import { Flex, Box, Button, Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { useGetUser } from '@/src/hooks/users/useGetUser'

const Navbar = () => {
  const { user } = useGetUser()
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
        <Avatar
          name={user?.first_name + ' ' + user?.last_name}
          backgroundColor={'primary'}
          variant='subtle'
          size='sm'
        >
          <AvatarBadge boxSize='4' bg='green.500' />
        </Avatar>
      </Flex>
    </Box>
  )
}

export default Navbar
