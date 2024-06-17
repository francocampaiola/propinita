import React from 'react'
import { Box } from '@chakra-ui/react'
import Navbar from './components/Navbar'
import Onboarding from './page'

export default function OnboardingPage() {
    return (
        <Box bg={'black'} height={'100%'}>
            <Navbar />
            <Onboarding />
        </Box>
    )
}
