'use client'
import React, { useState } from 'react'
/* chakra */
import { Box, Flex, Grid, Container } from '@chakra-ui/react'
/* Components */
import Navbar from '@/src/components/layout/Navbar'
import Sidebar from '@/src/components/layout/Sidebar'
import { MercadoPagoBlocker } from '@/src/components/MercadoPagoBlocker'
import { BalanceVisibilityProvider } from '@/src/context/BalanceVisibilityProvider'

interface IDashboardLayout {
  children: JSX.Element
}

const DashboardLayout = ({ children }: IDashboardLayout) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <BalanceVisibilityProvider>
      <Grid
        gridTemplateColumns={{
          base: '1fr',
          md: isCollapsed ? '80px 1fr' : '258px 1fr'
        }}
        display={{ base: 'block', md: 'grid' }}
        minHeight='100vh'
        backgroundColor={'background.dark.bg'}
      >
        {/* Desktop Sidebar */}
        <Box display={{ base: 'none', md: 'block' }}>
          <Sidebar isCollapsed={isCollapsed === true} handleCollapse={handleCollapse} />
        </Box>

        {/* Main Content Area */}
        <Flex flexDirection='column' height='100%'>
          {/* Navbar (Desktop y Mobile) */}
          <Navbar />

          {/* Content */}
          <Box flex={1} pt={{ base: 0, md: 2 }} pb={{ base: 4, md: 0 }}>
            <Container maxW='8xl' py={2} px='4'>
              {children}
            </Container>
          </Box>
        </Flex>

        <MercadoPagoBlocker />
      </Grid>
    </BalanceVisibilityProvider>
  )
}
export default DashboardLayout
