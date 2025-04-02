import React from 'react'
import Image from 'next/image'
import {
  Box,
  Button,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Tag,
  Text,
  Tooltip
} from '@chakra-ui/react'
import { FaInfoCircle, FaShareAlt } from 'react-icons/fa'
import { MdOutlineAttachMoney } from 'react-icons/md'
import { BiCopy, BiErrorCircle } from 'react-icons/bi'
import qrImage from '@/src/assets/templates/qr.svg'

const PaymentComponent = () => {
  return (
    <Flex backgroundColor='components.balance.bg' borderRadius='md' direction='column'>
      <Flex p={3} justifyContent='space-between' alignItems='center'>
        <Flex alignItems={'center'} gap={1}>
          <Text fontWeight={700}>Generar QR o link de pago</Text>
          <Tooltip
            placement='bottom'
            label='Genera un QR o link de pago indicando el monto a pagar para que tus clientes puedan pagarte en concepto de propinas'
            w={'350px'}
          >
            <FaInfoCircle color='#B49B25' size='1rem' />
          </Tooltip>
        </Flex>
      </Flex>
      <Divider borderColor='components.balance.divider' />
      <Flex mx={'auto'} direction={'row'} p={6} gap={6} alignItems={'center'}>
        <Flex justifyContent={'center'} alignItems={'center'}>
          <Box position={'relative'} width={200} height={200}>
            <Image src={qrImage} alt='QR Code' fill style={{ objectFit: 'contain' }} priority />
            <Flex
              position={'absolute'}
              top={0}
              left={0}
              right={0}
              bottom={0}
              backgroundColor={'whiteAlpha.300'}
              borderRadius={'md'}
              backdropFilter={'blur(4px)'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <BiErrorCircle size={40} color='#2C2C2C' />
            </Flex>
          </Box>
        </Flex>
        <Flex>
          <Flex direction={'column'} gap={2} my={4}>
            <InputGroup size='md'>
              <InputLeftElement>
                <MdOutlineAttachMoney />
              </InputLeftElement>
              <Input pr='4.5rem' placeholder='0.00' />
              <InputRightElement width={'auto'} mr={2}>
                <Button h='1.75rem' size='sm' variant={'primary'}>
                  Generar cobro
                </Button>
              </InputRightElement>
            </InputGroup>
            <Flex direction={'column'} gap={5} mt={2}>
              <Box backgroundColor={'gray.100'} borderRadius={'md'} p={2}>
                <Flex direction={'row'} gap={2} alignItems={'center'}>
                  <Text color={'gray.500'} fontSize={'xs'}>
                    Estado del cobro
                  </Text>
                  <Tag
                    size={'sm'}
                    variant='subtle'
                    backgroundColor={'primary'}
                    color={'#624A21'}
                    fontWeight={700}
                  >
                    Inactivo
                  </Tag>
                </Flex>
                <Flex direction={'row'} gap={2} alignItems={'center'}>
                  <Text color={'gray.500'} fontSize={'xs'}>
                    Enlace del cobro
                  </Text>
                  <Flex alignItems={'center'} gap={2}>
                    <BiErrorCircle color='#2C2C2C' />
                    <Text color={'gray.900'}>
                      Genera un cobro para activar el enlace y el código QR
                    </Text>
                  </Flex>
                </Flex>
              </Box>
              <Flex direction={'row'} gap={2} w={'100%'} justifyContent={'space-between'}>
                <Button w={'100%'} isDisabled leftIcon={<BiCopy />}>
                  Copiar enlace
                </Button>
                <Button w={'100%'} isDisabled leftIcon={<FaShareAlt />}>
                  Compartir enlace
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default PaymentComponent
