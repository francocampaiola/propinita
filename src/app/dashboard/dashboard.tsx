'use client'
import React, { useState } from 'react'
/* Chakra ui */
import { Box, Grid, Text, Flex } from '@chakra-ui/react'
// import CobrarComponent from './cobrar/cobrar'
// import SelectStore from './components/SelectStore'
// import WelcomeBanner from './components/WelcomeBanner'
// import BalancesContainer from './components/balances/BalancesContainer'
// import Transactions from './components/Transactions'
// import { useTranslations } from 'next-intl'

const Dashboard = () => {
  //   const [currentStore, setCurrentStore] = useState(null)
  //   const t = useTranslations('Dashboard.Index.body')
  return (
    <>
      {/* <WelcomeBanner /> */}
      <Grid gridTemplateColumns={{ base: 'repeat(1,1fr)', md: '0.8fr 1.2fr' }} gap='20px' px={0} />
      {/* <Box>
          <Text fontSize='xl' fontWeight='600'>
            {t('title')}
          </Text>
        </Box> */}
      {/* <Flex justifyContent='flex-end'>
          <SelectStore currentStore={currentStore} setCurrentStore={setCurrentStore} />
        </Flex> */}
      {/* <Box>
          <CobrarComponent currentStore={currentStore} />
        </Box>
        <Box gridRow={{ base: '3', md: 'auto' }}>
          <BalancesContainer currentStore={currentStore} />
        </Box>
      </Grid>
      <Box mt={6} gridColumn={{ base: 'span 1', md: 'span 2' }}>
        <Transactions currentStore={currentStore} />
      </Box> */}
    </>
  )
}

export default Dashboard
