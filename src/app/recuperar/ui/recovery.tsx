'use client'

import { Box, Center, Flex, Heading, Image, Tabs } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import background from '@/src/assets/background.png'
import logo from '@/src/assets/logo.svg'
import RecoveryPassword from '../components/RecoveryPassword';
const RecoveryForm = dynamic(() => import('../components/RecoveryPassword'))

const Recovery = () => {
    return (
        <>
            <Head>
                <title>Iniciar sesión o Registrarse - Propinita</title>
            </Head>
            <Flex minHeight='100vh' flexDirection={{ base: 'column', md: 'row' }}>
                <Center
                    height={{ base: 'auto', md: '100%' }}
                    width='100%'
                    alignItems={{ base: 'flex-start', md: 'center' }}
                    display={{ base: 'block', md: 'flex' }}
                >
                    <Box
                        borderRadius='xl'
                        px='4'
                        py={{ base: 2, md: 8 }}
                        mt={{ base: '15' }}
                        maxWidth={{ base: '100%', md: '483px' }}
                        width='100%'
                    >
                        <Image src={logo.src} alt='Propinita Logo' width='6.8125rem' height='auto' mx='auto' mb={32} />
                        <RecoveryPassword />
                    </Box>
                </Center>
                <Center
                    display={{ base: 'none', md: 'flex' }}
                    backgroundImage={background.src}
                    backgroundRepeat='no-repeat'
                    backgroundPosition='center center'
                    width='100%'
                    backgroundSize='cover'
                />
            </Flex>
        </>

    )
}

export default Recovery