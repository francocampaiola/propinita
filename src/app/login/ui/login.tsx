'use client'
import { Flex, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Center, Box, Image } from '@chakra-ui/react';
import dynamic from 'next/dynamic'
import Head from 'next/head'
import background from '@/src/assets/background.png'
import logo from '@/src/assets/logo.svg'
import RegisterForm from '../components/Register';

const LoginForm = dynamic(() => import('../components/Login'))

const Login = () => {
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
            <Image src={logo.src} alt='Propinita Logo' width='6.8125rem' height='auto' mx='auto' mb={16} />
            <Heading
              textAlign='center'
              fontFamily='Poppins'
              fontSize='2xl'
              fontWeight='600'
              mb={8}
            >
              Te damos la bienvenida
            </Heading>
            <Tabs minWidth={{ base: 'auto' }} isFitted>
              <TabList mb={8}>
                <Tab
                  _selected={{
                    background: 'transparent',
                    borderBottom: '4px solid #B49B25',
                    fontWeight: '600'
                  }}
                >
                  Iniciar sesión
                </Tab>
                <Tab _selected={{ borderBottom: '4px solid #B49B25', fontWeight: '600' }}>
                  Registrarme
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0} fontSize='sm'>
                  <LoginForm />
                </TabPanel>
                <TabPanel px={0}>
                  <RegisterForm />
                </TabPanel>
              </TabPanels>
            </Tabs>
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

export default Login