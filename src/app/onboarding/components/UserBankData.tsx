'use client'
import React, { useEffect, useState } from 'react'
import { Flex, Box, Text, Button, useToast, Badge } from '@chakra-ui/react'
import BoxColorMode from '@/src/components/BoxColorMode'
import { useForm } from 'react-hook-form'
import type { OnboardingStepProps } from '../onboarding.types'
import MercadoPagoLogo from '@/src/assets/onboarding/user_bank_data/mercadopago.png'
import Image from 'next/image'
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa'
import api from '@/src/api'
import { useSearchParams } from 'next/navigation'

// Tipo para la información de MercadoPago
interface MercadoPagoInfo {
  connected: boolean;
  userInfo?: {
    user_id: string;
    expires_in: number;
    scope?: string;
  };
}

const UserBankData = ({ userData, onNext, isLoading }: OnboardingStepProps) => {
  const { handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      birthdate: userData.birthdate || ''
    }
  });
  
  const searchParams = useSearchParams();
  const toast = useToast();
  const [authorizationUrl, setAuthorizationUrl] = useState<string | null>(null);
  const [mpInfo, setMpInfo] = useState<MercadoPagoInfo>({ connected: false });
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Establecer valor predeterminado para birthdate si no existe
  useEffect(() => {
    if (!userData.birthdate) {
      setValue('birthdate', '1997-10-08');
    }
  }, [setValue, userData.birthdate]);

  // Marcar el componente como montado
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Verificar parámetros de redirección
  useEffect(() => {
    if (!isMounted) return;

    const success = searchParams.get('success');
    const error = searchParams.get('error');
    
    if (success === 'connected') {
      toast({
        title: 'Cuenta vinculada',
        description: 'Tu cuenta de MercadoPago se ha vinculado correctamente.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else if (error) {
      toast({
        title: 'Error de conexión',
        description: `Hubo un problema al vincular tu cuenta: ${error}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [searchParams, toast, isMounted]);

  // Verificar si el usuario ya tiene una cuenta conectada
  useEffect(() => {
    if (!isMounted) return;

    const checkMercadoPagoConnection = async () => {
      try {
        setCheckingConnection(true);
        
        // Llamada al endpoint para verificar conexión
        const response = await fetch('/api/mercadopago/check-connection', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        // Si la respuesta no es ok, lanzar error
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        // Verificar el tipo de contenido
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('La respuesta no es JSON');
        }

        // Obtener y parsear la respuesta
        const data = await response.json();
        
        setMpInfo({
          connected: data.connected,
          userInfo: data.connected ? {
            user_id: data.mp_user_id,
            expires_in: data.expires_in,
            scope: data.scope
          } : undefined
        });

        // Si hay un error en la respuesta, mostrarlo
        if (data.error) {
          toast({
            title: "Error de conexión",
            description: data.error,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        setMpInfo({ connected: false });
        toast({
          title: "Error de conexión",
          description: "No se pudo verificar la conexión con MercadoPago. Por favor, intenta nuevamente.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setCheckingConnection(false);
      }
    };
    
    checkMercadoPagoConnection();
  }, [isMounted, toast]);

  // Obtener URL de autorización
  useEffect(() => {
    if (!isMounted || mpInfo.connected) return;

    const fetchAuthorizationUrl = async () => {
      try {
        const url = await api.user.authorize();
        setAuthorizationUrl(url);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo obtener el enlace de conexión con MercadoPago.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    
    fetchAuthorizationUrl();
  }, [mpInfo.connected, toast, isMounted]);

  const onSubmit = handleSubmit((data) => {
    onNext(data);
  });

  // Renderizar un placeholder mientras el componente no está montado
  if (!isMounted) {
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
        <Flex direction='column' gap={4} my={4}>
          <BoxColorMode bg={['primary', 'transparent']} borderRadius='md'>
            <Flex 
              justifyContent="center" 
              alignItems="center" 
              p={6} 
              border={'1px solid white'} 
              borderRadius={15}
            >
              <Text>Cargando...</Text>
            </Flex>
          </BoxColorMode>
        </Flex>
      </Box>
    );
  }

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
            {checkingConnection ? (
              <Flex 
                justifyContent="center" 
                alignItems="center" 
                p={6} 
                border={'1px solid white'} 
                borderRadius={15}
              >
                <Text>Verificando estado de conexión...</Text>
              </Flex>
            ) : mpInfo.connected ? (
              <Box
                display='flex'
                alignItems='center'
                py={4}
                px={6}
                width='100%'
                border={'1px solid white'}
                borderRadius={15}
                textAlign={'left'}
              >
                <Image 
                  src={MercadoPagoLogo} 
                  alt={'MercadoPago'} 
                  width={50} 
                  height={50}
                  priority
                />
                <Box ml={4} flex="1">
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text fontSize='lg' fontWeight='600'>
                      MercadoPago
                    </Text>
                    <Badge colorScheme="green" display="flex" alignItems="center">
                      <FaCheck size={10} style={{ marginRight: '5px' }} /> Conectada
                    </Badge>
                  </Flex>
                  <Text color='#D2D2D2' fontSize='xs'>
                    Tu cuenta de MercadoPago ha sido vinculada correctamente.
                    {mpInfo.userInfo?.user_id && (
                      <Text as="span" color="green.300"> ID: {mpInfo.userInfo.user_id}</Text>
                    )}
                  </Text>
                </Box>
              </Box>
            ) : (
              <Box
                as="a"
                href={authorizationUrl || '#'}
                display='flex'
                alignItems='center'
                py={4}
                px={6}
                width='100%'
                cursor='pointer'
                border={'1px solid white'}
                borderRadius={15}
                textAlign={'left'}
              >
                <Image 
                  src={MercadoPagoLogo} 
                  alt={'MercadoPago'} 
                  width={50} 
                  height={50}
                  priority
                />
                <Box ml={4}>
                  <Text fontSize='lg' fontWeight='600'>
                    MercadoPago
                  </Text>
                  <Text color='#D2D2D2' fontSize='xs'>
                    Vinculamos tu cuenta bancaria con un cifrado de extremo a extremo para facilitar
                    el pago y recepción de tus propinas.
                  </Text>
                </Box>
              </Box>
            )}
          </BoxColorMode>
        </Flex>
        <Flex justifyContent='flex-end'>
          <Button
            variant='secondary'
            type='button'
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
            rightIcon={<FaArrowRight />}
          >
            Continuar
          </Button>
        </Flex>
      </form>
    </Box>
  );
}

export default UserBankData;