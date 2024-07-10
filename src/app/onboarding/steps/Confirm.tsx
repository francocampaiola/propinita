import { Box, Button, Flex, Link, Text } from '@chakra-ui/react'
import React from 'react'
import { IoCheckmarkCircle } from 'react-icons/io5'

const Details = () => {
    return (
        <Box w={'100%'} minHeight={'100vh'}
            height={'100%'} borderRadius={'xl'}>
            <Flex p={12} direction={'column'} gap={6}>
                <Text textTransform={'uppercase'} fontWeight={'bold'} fontSize={'xl'} color={'gray'}>
                    CONFIRMACIÓN
                </Text>
                <Flex flexDirection={'column'} gap={6} mt={32}>
                    <IoCheckmarkCircle size={180} color='green' />
                    <Text color={'white'} fontWeight={'bold'}>Gracias por tu información.  <br /> La estaremos validando y nos comunicaremos a la brevedad.</Text>
                    <Link href='/login'>
                        <Button w={'50%'}>Volver al inicio</Button>
                    </Link>
                </Flex>
            </Flex>
        </Box>
    )
}

export default Details