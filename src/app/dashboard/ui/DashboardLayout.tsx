'use client'
import React, { useState } from 'react'
/* chakra */
import { Box, Flex, Grid, Container } from '@chakra-ui/react'
/* Components */
import Navbar from '@/src/components/layout/Navbar'
import Sidebar from '@/src/components/layout/Sidebar'
interface IDashboardLayout {
  children: JSX.Element
}

const DashboardLayout = ({ children }: IDashboardLayout) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <Grid
      gridTemplateColumns={{
        base: '1fr',
        md: isCollapsed ? '80px 1fr' : '258px 1fr'
      }}
      display={{ base: 'block', md: 'grid' }}
      minHeight='100vh'
      pb={{ base: '20', md: '0' }}
    >
      <Box display={{ base: 'none', md: 'block' }}>
        <Sidebar isCollapsed={isCollapsed === true} handleCollapse={handleCollapse} />
      </Box>
      <Flex flexDirection='column' height='100%'>
        <Navbar />
        <Box>
          <Container maxW='8xl' py={2} px='4'>
            {children}
          </Container>
        </Box>
      </Flex>
    </Grid>
  )
}
export default DashboardLayout
