'use client'
import React from 'react'
import { Box, Grid, Skeleton } from '@chakra-ui/react'

const Dashboard = () => {
  return (
    <>
      <Grid
        gridTemplateColumns={{ base: 'repeat(1,1fr)', md: '1fr 2fr', xl: '1fr 3fr' }}
        templateRows='1fr'
        px={0}
        p={4}
        width='100%'
        gap={4}
        minHeight='300px'
      >
        <Box width='100%' height='100%'>
          <Skeleton height='320px' mb={4} borderRadius='md' />
        </Box>
        <Box width='100%' height='100%'>
          <Skeleton height='320px' mb={4} borderRadius='md' />
        </Box>
      </Grid>
      <Box width='100%' minHeight='300px' p={4} gridColumn={{ base: 'span 1', md: 'span 2' }}>
        <Skeleton height='350px' mb={4} borderRadius='md' />
      </Box>
    </>
  )
}

export default Dashboard
