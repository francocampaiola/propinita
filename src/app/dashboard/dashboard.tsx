'use client'
import React from 'react'
import { Box, Grid, VStack, HStack, Text, Divider, Flex } from '@chakra-ui/react'
import QrComponent from './components/qr'
import BalanceComponent from './components/balance'
import HistoryComponent from './components/history'

const Dashboard = () => {
  return (
    <>
      {/* Desktop Layout - Mantiene el diseño original sin cambios */}
      <Box display={{ base: 'none', md: 'block' }}>
        <Grid
          gridTemplateColumns={{ md: '1fr 2fr', xl: '1fr 3fr' }}
          templateRows='1fr'
          px={0}
          p={4}
          width='100%'
          gap={4}
          minHeight='300px'
        >
          <Box width='100%' height='100%'>
            <QrComponent />
          </Box>
          <Box width='100%' height='100%'>
            <BalanceComponent />
          </Box>
        </Grid>
        <Box width='100%' minHeight='300px' p={4} gridColumn={{ md: 'span 2' }}>
          <HistoryComponent />
        </Box>
      </Box>

      {/* Mobile Layout - QR arriba, Balance en medio, History abajo */}
      <Box display={{ base: 'block', md: 'none' }}>
        <VStack spacing={4} p={4}>
          {/* QR como elemento principal arriba */}
          <Box width='100%'>
            <QrComponent />
          </Box>

          {/* Balance en el medio */}
          <Box width='100%'>
            <BalanceComponent />
          </Box>

          {/* Historial abajo */}
          <Box width='100%'>
            <HistoryComponent />
          </Box>
        </VStack>
      </Box>
    </>
  )
}

export default Dashboard
