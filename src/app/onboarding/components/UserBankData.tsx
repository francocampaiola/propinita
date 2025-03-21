'use client'
import React, { useEffect, useState } from 'react'
import { Flex, Box, Text, Button } from '@chakra-ui/react'
import BoxColorMode from '@/src/components/BoxColorMode'
import { useForm } from 'react-hook-form'
import type { OnboardingStepProps } from '../onboarding.types'
import MercadoPagoLogo from '@/src/assets/onboarding/user_bank_data/mercadopago.png'
import Image from 'next/image'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import api from '@/src/api'

const UserBankData = ({ userData, onNext, isLoading }: OnboardingStepProps) => {
  const { handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      birthdate: userData.birthdate
    }
  })

  const [authorizationUrl, setAuthorizationUrl] = useState<string | null>(null)
  // useEffect para manejar la carga asincrónica
  useEffect(() => {
    const fetchAuthorizationUrl = async () => {
      const url = await api.user.authorize()
      setAuthorizationUrl(url)
    }
    fetchAuthorizationUrl()
  }, [])

  const onSubmit = handleSubmit((data) => onNext(data))

  return (
    <Box w={'100%'}>
      <Text fontWeight='600' fontSize='xl' mb={6} textTransform={'uppercase'}>
        Paso 3
      </Text>
      <Text fontWeight='600' fontSize='2xl' mb={1}>
        Cuenta bancaria
      </Text>
      <Text fontSize='sm'>
        Vinculá tu cuenta con MercadoPago para recibir o realizar tus pagos.
      </Text>
      <form onSubmit={onSubmit}>
        <Flex direction='column' gap={4} my={4}>
          <BoxColorMode bg={['primary', 'transparent']} borderRadius='md'>
            {/* <Box
              as='button'
              type='button'
              display='flex'
              alignItems='center'
              py={4}
              px={6}
              width='100%'
              cursor='pointer'
              border={'1px solid white'}
              borderRadius={15}
              textAlign={'left'}
              onClick={() => setValue('birthdate', '08-10-1997')}
            >
              <Image src={MercadoPagoLogo} alt={'MercadoPago'} width={50} height={50} />
              <Box ml={4}>
                <Text fontSize='lg' fontWeight='600'>
                  MercadoPago
                </Text>
                <Text color='#D2D2D2' fontSize='xs'>
                  Vinculamos tu cuenta bancaria con un cifrado de extremo a extremo para facilitar
                  el pago y recepción de tus propinas.
                </Text>
              </Box>
            </Box> */}
            <a href={authorizationUrl}>Conectar con MercadoPago</a>
          </BoxColorMode>
        </Flex>
        <Flex justifyContent='flex-end'>
          <Button
            variant='secondary'
            type='submit'
            mt={4}
            mr={4}
            size='sm'
            isDisabled
            leftIcon={<FaArrowLeft />}
          >
            Volver
          </Button>
          <Button
            variant='primary'
            type='submit'
            mt={4}
            size='sm'
            isLoading={isLoading}
            isDisabled={!watch('birthdate')}
            rightIcon={<FaArrowRight />}
          >
            Siguiente
          </Button>
        </Flex>
      </form>
    </Box>
  )
}

export default UserBankData
