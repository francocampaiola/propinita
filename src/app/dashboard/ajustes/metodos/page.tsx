'use client'
import { useGetMercadoPago } from '@/src/hooks/mercadopago/useGetMercadoPago'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import { Alert, AlertIcon, Button, Circle, Divider, Flex, Spinner, Text } from '@chakra-ui/react'
import { GrCheckmark } from 'react-icons/gr'
import React, { useState } from 'react'
import Input from '@/src/components/form/Input'
import { BiArrowToLeft, BiArrowToRight, BiLinkExternal } from 'react-icons/bi'
import { FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'

const MetodosPagoPage = () => {
  const { mercadopago, isLoading, refetch } = useGetMercadoPago()
  const { user, isLoading: isLoadingUser } = useGetUser()
  const [linkNewAccount, setLinkNewAccount] = useState(false)

  if (isLoading || isLoadingUser) {
    return (
      <Flex justifyContent='center' alignItems='center' height='100%'>
        <Spinner size='lg' mt={4} color='primary' />
      </Flex>
    )
  }

  if (linkNewAccount) {
    return (
      <Flex
        backgroundColor='gray.1000'
        borderRadius='15px'
        direction={'column'}
        justifyContent='space-between'
      >
        <Flex justifyContent='space-between' alignItems={'center'} height={'58px'} mx={4}>
          <Flex alignItems={'center'} gap={1}>
            <FaArrowLeft
              size={16}
              style={{ marginRight: '5px' }}
              onClick={() => setLinkNewAccount(false)}
              cursor={'pointer'}
            />
            <Text fontWeight={700}>Métodos de pago</Text>
          </Flex>
        </Flex>
        <Divider borderColor='components.divider' />
        <Flex flex={1} mx={4} mt={4} mb={4} direction='column'>
          <Flex justifyContent={'space-between'}>
            <Flex direction={'column'} w='100%'>
              <Text fontWeight={700}>Conecta tu cuenta de MercadoPago</Text>
              <Text color={'gray.300'}>Vincula tu cuenta para empezar a recibir propinas</Text>
              <Flex
                backgroundColor='#262626'
                borderRadius='15px'
                direction={'column'}
                py={2}
                mt={4}
                w={'100%'}
              >
                <Flex
                  alignItems={'center'}
                  justifyContent={'center'}
                  gap={3}
                  direction={'column'}
                  mx={4}
                >
                  <Circle size='100px' bg='primary' color='white'>
                    <BiLinkExternal size={50} />
                  </Circle>
                  <Text fontSize={'2xl'} fontWeight={700}>
                    Vincular cuenta
                  </Text>
                  <Text fontSize={'xl'} fontWeight={600} w={'60%'} textAlign={'center'}>
                    Serás redirigido a MercadoPago para completar el proceso de vinculación
                  </Text>
                  <Button mb={3} variant={'outline'} w={'100%'}>
                    <BiLinkExternal size={16} style={{ marginRight: '5px' }} />
                    Ir a MercadoPago
                  </Button>
                </Flex>
              </Flex>
              <Alert
                status='warning'
                borderRadius={'15px'}
                backgroundColor={'transparent'}
                border={'1px solid #D8CF38'}
                color={'#D8CF38'}
                mt={3}
                fontWeight={600}
              >
                <AlertIcon color={'#D8CF38'} />
                Mantén actualizada la información de tu cuenta para asegurar que recibas tus
                propinas correctamente.
              </Alert>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    )
  }

  return (
    <Flex
      backgroundColor='gray.1000'
      borderRadius='15px'
      direction={'column'}
      justifyContent='space-between'
    >
      <Flex justifyContent='space-between' alignItems={'center'} height={'58px'} mx={4}>
        <Flex alignItems={'center'} gap={1}>
          <Link href={'/dashboard/ajustes'}>
            <FaArrowLeft size={16} style={{ marginRight: '5px' }} cursor={'pointer'} />
          </Link>
          <Text fontWeight={700}>Métodos de pago</Text>
        </Flex>
      </Flex>
      <Divider borderColor='components.divider' />
      <Flex flex={1} mx={4} mt={4} mb={4} direction='column'>
        <Flex justifyContent={'space-between'}>
          <Flex direction={'column'}>
            <Text fontWeight={700}>Cuenta de MercadoPago vinculada</Text>
            <Text color={'gray.300'}>
              Revisa y actualiza la información de tu cuenta de MercadoPago
            </Text>
          </Flex>
        </Flex>
        <Flex
          backgroundColor='#262626'
          borderRadius='15px'
          direction={'column'}
          px={4}
          py={2}
          mt={4}
        >
          <Flex alignItems={'center'} gap={1}>
            <Circle size='17px' bg='#9AE6B4' color='white'>
              <GrCheckmark size={10} color='#38A169' />
            </Circle>
            <Text color={'#38A169'} fontWeight={500}>
              Cuenta vinculada correctamente
            </Text>
          </Flex>
          <Flex direction={'column'} gap={2} my={3}>
            <Input label='Correo electrónico' size='sm' value={user?.email} isDisabled />
            <Input
              label='Cuenta de MercadoPago asociada'
              size='sm'
              value={mercadopago?.mp_user_id}
              isDisabled
            />
          </Flex>
          <Button mb={3} variant={'outline'} onClick={() => setLinkNewAccount(true)}>
            <BiArrowToRight size={16} style={{ marginRight: '5px' }} />
            Vincular nueva cuenta
          </Button>
        </Flex>
        <Alert
          status='warning'
          borderRadius={'15px'}
          backgroundColor={'transparent'}
          border={'1px solid #D8CF38'}
          color={'#D8CF38'}
          mt={3}
          fontWeight={600}
        >
          <AlertIcon color={'#D8CF38'} />
          Mantén actualizada la información de tu cuenta para asegurar que recibas tus propinas
          correctamente.
        </Alert>
      </Flex>
    </Flex>
  )
}

export default MetodosPagoPage
