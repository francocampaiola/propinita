'use client'

import {
    Box,
    Flex,
    Avatar,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Stack,
    Center,
    Text,
    Divider,
} from '@chakra-ui/react'

import logoPropinita from '/public/assets/img/whitelogo.svg'
import Image from 'next/image'
import { IoEnterOutline } from 'react-icons/io5'

interface Props {
    children: React.ReactNode
}

export default function Navbar() {
    return (
        <>
            <Box px={4} bg={'black'}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <Flex direction={'row'} justify={'center'} align={'center'} ml={6}>
                        <Box>
                            <Image src={logoPropinita} alt='Logo' width={120} />
                        </Box>
                        <Divider orientation='vertical' ml={6} mr={6} h={35} px={'0.2'} />
                        <Text fontSize={15} fontWeight={'400'} color={'white'} fontFamily={'Poppins'}> Empecemos </Text>
                    </Flex>

                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            <Button colorScheme={'whiteAlpha'} variant='solid' px={2} _hover={{ opacity: 0.8 }}>
                                <IoEnterOutline size={20} />
                            </Button>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}
