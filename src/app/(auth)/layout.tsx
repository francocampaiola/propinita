'use client'

import { Flex, Image, Text } from '@chakra-ui/react'
import { Providers } from '../providers'

const LoginOrRegisterLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <Providers>
      <Flex justifyContent={'space-between'} minH={'100vh'} background={'black'}>
        <Flex justify={'center'} align={'center'}>
          <Flex direction={'column'} ml={'100px'}>
            <Flex direction={'column'} gap={'15px'} mb={'30px'}>
              <Image src={'/assets/img/whitelogo.svg'} alt={'Logo'} w={'110px'} />
              <Text color={'white'} fontWeight={'bold'} fontSize={'3xl'}>Hola!<br /> Bienvenido de nuevo</Text>
            </Flex>
            {children}
          </Flex>
        </Flex>
        <Image w={'50%'} src={'/assets/img/background.png'} objectFit='cover' alt={'Background'} />
      </Flex>
    </Providers>
  )
}

export default LoginOrRegisterLayout