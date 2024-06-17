import React from 'react'
import Onboarding from './page'
import Navbar from './components/Navbar'
import { Box } from '@chakra-ui/react'

export default function OnboardingPage() {
    return (
        <Box bg={'black'} height={'100vh'}>
            <Navbar />
            <Onboarding />
        </Box>
    )
}
