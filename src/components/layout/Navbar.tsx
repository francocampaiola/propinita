import React from 'react'
/* Chakra UI */
import { Flex, Box, Button } from '@chakra-ui/react'
/* components */
// import { ProfileMenu } from '@/src/app/dashboard/perfil/components/ProfileMenu'
/* icons */
// import { FaBell } from 'react-icons/fa6'
const Navbar = () => {
  return (
    <Box display={{ base: 'none', md: 'block' }} width='100%'>
      <Flex alignItems='center' justifyContent='space-between'>
        <Flex alignItems='center'></Flex>
        <Flex alignItems='center'>
          {/* <Button mx='5' variant='icon'>
            <FaBell />
          </Button> */}
          {/* Botón que desplega un menú para desloguearse */}
          {/* <ProfileMenu /> */}
        </Flex>
        {/* Botón de icono de notificaciones */}
      </Flex>
      {/*<EmployeesActivity isOpen={isOpen} />*/}
    </Box>
  )
}

export default Navbar
