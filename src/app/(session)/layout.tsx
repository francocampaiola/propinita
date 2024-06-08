'use client'

import { Box, Button, Flex, Image, Input, InputGroup, InputLeftAddon, Stack, Text } from '@chakra-ui/react'
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
          <Flex direction={'column'}>
            <Image src={'/assets/img/whitelogo.svg'} alt={'Logo'} w={'150px'} />
            {children}
          </Flex>
        </Flex>
        <Image w={'50%'} src={'/assets/img/background.png'} objectFit='cover' alt={'Background'} />
      </Flex>
    </Providers>
  )
}

export default LoginOrRegisterLayout