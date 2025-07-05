import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
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
  Tooltip,
  Icon,
  Spinner,
  VStack,
  HStack
} from '@chakra-ui/react'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import qrImage from '@/src/assets/templates/qr.svg'
import { FaInfoCircle, FaCheckCircle, FaWhatsapp } from 'react-icons/fa'
import { MdOutlineAttachMoney } from 'react-icons/md'
import { BiCopy, BiErrorCircle } from 'react-icons/bi'
import { handleToast } from '@/src/utils/toast'

const LoadingState = () => (
  <Flex justifyContent='center' alignItems='center' p={8}>
    <Spinner size='xl' color='primary.500' />
  </Flex>
)

const QRDisplay = React.memo(
  ({ qrCode, paymentStatus }: { qrCode: string | null; paymentStatus: string }) => (
    <Box position={'relative'} width={{ base: 150, lg: 200 }} height={{ base: 150, lg: 200 }}>
      {qrCode ? (
        <Image src={qrCode} alt='QR Code' fill style={{ objectFit: 'contain' }} priority />
      ) : (
        <>
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
            <BiErrorCircle size={30} color='#2C2C2C' />
          </Flex>
        </>
      )}
      {(paymentStatus === 'paid' || paymentStatus === 'expired') && (
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
          <Icon
            as={paymentStatus === 'paid' ? FaCheckCircle : BiErrorCircle}
            boxSize={{ base: 8, lg: 10 }}
            color={paymentStatus === 'paid' ? 'green.500' : 'red.500'}
          />
        </Flex>
      )}
    </Box>
  )
)

QRDisplay.displayName = 'QRDisplay'

const PaymentComponent = () => {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [paymentLink, setPaymentLink] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'inactive' | 'active' | 'paid' | 'expired'>(
    'inactive'
  )
  const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null)
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)
  const [expirationTime, setExpirationTime] = useState<number | null>(null)
  const [isComponentReady, setIsComponentReady] = useState(false)
  const [paidTimestamp, setPaidTimestamp] = useState<number | null>(null)
  const { user, isLoading: isLoadingUser } = useGetUser()
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const expirationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const paidResetTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComponentReady(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const clearTimeouts = useCallback(() => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current)
      checkIntervalRef.current = null
    }
    if (expirationTimeoutRef.current) {
      clearTimeout(expirationTimeoutRef.current)
      expirationTimeoutRef.current = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (paidResetTimerRef.current) {
      clearTimeout(paidResetTimerRef.current)
      paidResetTimerRef.current = null
    }
  }, [])

  const handleExpiration = useCallback(() => {
    setPaymentStatus('expired')
    setPaymentLink(null)
    setQrCode(null)
    setExpirationTime(null)
    clearTimeouts()
    setAmount('')
  }, [clearTimeouts])

  const checkTransactionStatus = useCallback(async () => {
    if (!currentTransactionId) return

    try {
      setIsCheckingPayment(true)
      const response = await fetch(`/api/payment/status?transactionId=${currentTransactionId}`)

      if (!response.ok) {
        throw new Error('Error al verificar el estado del pago')
      }

      const data = await response.json()

      if (data.status === 'completed') {
        setPaymentStatus('paid')
        setPaymentLink(null)
        setQrCode(null)
        clearTimeouts()
        setAmount('')
        setPaidTimestamp(Date.now())
      }
    } catch (error) {
      handleToast({
        title: 'Error',
        text: 'Hubo un problema al verificar el estado del pago. Por favor, intenta nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsCheckingPayment(false)
    }
  }, [currentTransactionId, clearTimeouts])

  useEffect(() => {
    return () => {
      clearTimeouts()
    }
  }, [clearTimeouts])

  useEffect(() => {
    if (!isComponentReady) return

    if (paymentStatus === 'active' && currentTransactionId) {
      clearTimeouts()
      checkTransactionStatus()
      const interval = setInterval(() => {
        checkTransactionStatus()
      }, 30000)
      checkIntervalRef.current = interval

      const expirationDelay = 600000 // 10 minutos
      setExpirationTime(Date.now() + expirationDelay)

      const timeout = setTimeout(() => {
        handleExpiration()
      }, expirationDelay)
      expirationTimeoutRef.current = timeout

      return () => {
        clearTimeouts()
      }
    }
  }, [
    paymentStatus,
    currentTransactionId,
    checkTransactionStatus,
    handleExpiration,
    clearTimeouts,
    isComponentReady
  ])

  useEffect(() => {
    if (!isComponentReady) return

    if (expirationTime && paymentStatus === 'active') {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      const timer = setInterval(() => {
        const now = Date.now()
        if (now >= expirationTime) {
          handleExpiration()
        }
      }, 1000)

      timerRef.current = timer

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }
    }
  }, [expirationTime, paymentStatus, handleExpiration, isComponentReady])

  useEffect(() => {
    if (paymentStatus === 'paid' && paidTimestamp) {
      if (paidResetTimerRef.current) {
        clearTimeout(paidResetTimerRef.current)
      }

      const resetTimer = setTimeout(() => {
        setPaymentStatus('inactive')
        setPaidTimestamp(null)
      }, 10000)

      paidResetTimerRef.current = resetTimer

      return () => {
        if (paidResetTimerRef.current) {
          clearTimeout(paidResetTimerRef.current)
        }
      }
    }
  }, [paymentStatus, paidTimestamp])

  const generateQRCode = useCallback(async (url: string) => {
    try {
      const options: QRCode.QRCodeToDataURLOptions = {
        margin: 1,
        width: 200,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#B49B25',
          light: '#00000000'
        },
        type: 'image/png'
      }

      const qrDataUrl = await QRCode.toDataURL(url, options)
      setQrCode(qrDataUrl)
    } catch (error) {
      handleToast({
        title: 'Error',
        text: 'No se pudo generar el código QR. Por favor, intenta nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }, [])

  const handleGeneratePayment = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/payment/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          providerId: user.id,
          providerName: `${user.first_name} ${user.last_name}`
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al generar el pago')
      }

      setPaymentLink(data.initPoint)
      await generateQRCode(data.initPoint)
      setPaymentStatus('active')
      setCurrentTransactionId(data.transactionId)
    } catch (error) {
      handleToast({
        title: 'Error',
        text: 'Hubo un problema al generar el pago. Por favor, intenta nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }, [amount, user, generateQRCode])

  const handleNewPayment = useCallback(() => {
    setPaymentStatus('inactive')
    setPaymentLink(null)
    setQrCode(null)
    setCurrentTransactionId(null)
    setAmount('')
  }, [])

  const handleCopyLink = useCallback(() => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink)
      handleToast({
        title: 'Enlace copiado',
        text: 'El enlace ha sido copiado al portapapeles',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    }
  }, [paymentLink])

  const handleShareLink = useCallback(() => {
    if (paymentLink) {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        `Paga tu propina aquí: ${paymentLink}`
      )}`
      window.open(whatsappUrl, '_blank')
    }
  }, [paymentLink])

  const paymentStatusText = useMemo(() => {
    switch (paymentStatus) {
      case 'active':
        return 'Pendiente'
      case 'paid':
        return 'Pagado'
      case 'expired':
        return 'Expirado'
      default:
        return 'Inactivo'
    }
  }, [paymentStatus])

  const statusColors = useMemo(() => {
    switch (paymentStatus) {
      case 'active':
        return { bg: 'primary', color: 'secondary' }
      case 'paid':
        return { bg: 'green.100', color: 'green.700' }
      case 'expired':
        return { bg: 'red.100', color: 'red.700' }
      default:
        return { bg: 'gray.700', color: 'white' }
    }
  }, [paymentStatus])

  if (!isComponentReady) {
    return <LoadingState />
  }

  return (
    <Flex backgroundColor='components.balance.bg' borderRadius='md' direction='column'>
      <Flex p={{ base: 4, lg: 3 }} justifyContent='space-between' alignItems='center'>
        <Flex alignItems={'center'} gap={{ base: 2, lg: 1 }}>
          <Text fontWeight={700} fontSize={{ base: 'lg', lg: 'md' }}>
            Generar QR o link de pago
          </Text>
          <Tooltip
            placement='bottom'
            label='Genera un QR o link de pago indicando el monto a pagar para que tus clientes puedan pagarte en concepto de propinas'
            w={{ base: '300px', lg: '350px' }}
          >
            <FaInfoCircle color='#B49B25' size='1rem' />
          </Tooltip>
        </Flex>
      </Flex>
      <Divider borderColor='components.divider' />

      {/* Desktop Layout */}
      <Flex
        mx={'auto'}
        direction={'row'}
        p={6}
        gap={6}
        alignItems={'center'}
        display={{ base: 'none', lg: 'flex' }}
      >
        <Flex justifyContent={'center'} alignItems={'center'}>
          <Suspense fallback={<LoadingState />}>
            <QRDisplay qrCode={qrCode} paymentStatus={paymentStatus} />
          </Suspense>
        </Flex>
        <Flex>
          <Flex direction={'column'} gap={2} my={4}>
            <InputGroup size='md'>
              <InputLeftElement>
                <MdOutlineAttachMoney />
              </InputLeftElement>
              <Input
                pr='4.5rem'
                placeholder='0.00'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type='number'
                min='0'
                step='0.01'
                isDisabled={paymentStatus === 'active' || paymentStatus === 'paid'}
              />
              <InputRightElement width={'auto'} mr={2}>
                {paymentStatus !== 'active' ? (
                  <Button
                    h='1.75rem'
                    size='sm'
                    variant={'primary'}
                    onClick={handleGeneratePayment}
                    isLoading={isLoading}
                    isDisabled={amount === ''}
                  >
                    Generar cobro
                  </Button>
                ) : (
                  <Button
                    h='1.75rem'
                    size='sm'
                    backgroundColor='gray.100'
                    color='gray.700'
                    _hover={{ backgroundColor: 'gray.200' }}
                    onClick={handleNewPayment}
                    isLoading={isLoading}
                  >
                    Nuevo cobro
                  </Button>
                )}
              </InputRightElement>
            </InputGroup>
            <Flex direction={'column'} gap={5} mt={2}>
              <Box backgroundColor={'gray.100'} borderRadius={'md'} p={2} w={550}>
                <Flex direction={'row'} gap={2} alignItems={'center'}>
                  <Text color={'gray.500'} fontSize={'xs'}>
                    Estado del cobro
                  </Text>
                  <Tag
                    size={'sm'}
                    variant='subtle'
                    backgroundColor={statusColors.bg}
                    color={statusColors.color}
                    fontWeight={700}
                  >
                    {paymentStatusText}
                  </Tag>
                </Flex>
                <Flex direction={'row'} gap={2} alignItems={'center'} mt={1}>
                  <Text color={'gray.500'} fontSize={'xs'}>
                    Enlace del cobro
                  </Text>
                  <Flex alignItems={'center'} gap={2}>
                    {paymentLink ? (
                      <Text color={'gray.900'} noOfLines={1} maxW='300px' fontSize={'xs'}>
                        {paymentLink}
                      </Text>
                    ) : paymentStatus === 'paid' ? (
                      <>
                        <Spinner size='xs' color='#2C2C2C' />
                        <Text color={'gray.900'} fontSize={'xs'}>
                          En unos segundos podrás generar un nuevo cobro
                        </Text>
                      </>
                    ) : (
                      <>
                        <BiErrorCircle color='#2C2C2C' />
                        <Text color={'gray.900'} fontSize={'xs'}>
                          Genera un cobro para activar el enlace y el código QR
                        </Text>
                      </>
                    )}
                  </Flex>
                </Flex>
              </Box>
              <Flex direction={'row'} gap={2} w={'100%'} justifyContent={'space-between'}>
                <Button
                  w={'100%'}
                  isDisabled={
                    !paymentLink || paymentStatus === 'paid' || paymentStatus === 'expired'
                  }
                  leftIcon={<BiCopy />}
                  onClick={handleCopyLink}
                >
                  Copiar enlace
                </Button>
                <Button
                  w={'100%'}
                  isDisabled={
                    !paymentLink || paymentStatus === 'paid' || paymentStatus === 'expired'
                  }
                  leftIcon={<FaWhatsapp />}
                  onClick={handleShareLink}
                >
                  Enviar enlace
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      {/* Mobile Layout */}
      <VStack spacing={6} p={4} display={{ base: 'flex', lg: 'none' }}>
        {/* QR Code centrado */}
        <Flex justifyContent={'center'} alignItems={'center'}>
          <Suspense fallback={<LoadingState />}>
            <QRDisplay qrCode={qrCode} paymentStatus={paymentStatus} />
          </Suspense>
        </Flex>

        {/* Input y botón */}
        <VStack spacing={4} w='full'>
          <InputGroup size='md'>
            <InputLeftElement>
              <MdOutlineAttachMoney />
            </InputLeftElement>
            <Input
              placeholder='0.00'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type='number'
              min='0'
              step='0.01'
              isDisabled={paymentStatus === 'active' || paymentStatus === 'paid'}
            />
          </InputGroup>

          {paymentStatus !== 'active' ? (
            <Button
              w='full'
              variant={'primary'}
              onClick={handleGeneratePayment}
              isLoading={isLoading}
              isDisabled={amount === ''}
              size='lg'
            >
              Generar cobro
            </Button>
          ) : (
            <Button
              w='full'
              backgroundColor='gray.100'
              color='gray.700'
              _hover={{ backgroundColor: 'gray.200' }}
              onClick={handleNewPayment}
              isLoading={isLoading}
              size='lg'
            >
              Nuevo cobro
            </Button>
          )}
        </VStack>

        {/* Estado del cobro - Diseño simplificado */}
        <Box w='full' p={4} bg='gray.50' borderRadius='lg'>
          <VStack spacing={3} align='stretch'>
            <HStack justify='space-between' align='center'>
              <Text color={'gray.600'} fontSize={'sm'} fontWeight='medium'>
                Estado del cobro
              </Text>
              <Tag
                size={'sm'}
                variant='subtle'
                backgroundColor={statusColors.bg}
                color={statusColors.color}
                fontWeight={700}
              >
                {paymentStatusText}
              </Tag>
            </HStack>

            <Box>
              <Text color={'gray.600'} fontSize={'sm'} fontWeight='medium' mb={2}>
                Enlace del cobro
              </Text>
              {paymentLink ? (
                <Text
                  color={'gray.800'}
                  fontSize={'xs'}
                  wordBreak='break-all'
                  bg='white'
                  p={2}
                  borderRadius='md'
                  border='1px solid'
                  borderColor='gray.200'
                >
                  {paymentLink}
                </Text>
              ) : paymentStatus === 'paid' ? (
                <Flex alignItems={'center'} gap={2} bg='white' p={2} borderRadius='md'>
                  <Spinner size='xs' color='#2C2C2C' />
                  <Text color={'gray.700'} fontSize={'xs'}>
                    En unos segundos podrás generar un nuevo cobro
                  </Text>
                </Flex>
              ) : (
                <Flex alignItems={'center'} gap={2} bg='white' p={2} borderRadius='md'>
                  <BiErrorCircle color='#2C2C2C' />
                  <Text color={'gray.700'} fontSize={'xs'}>
                    Genera un cobro para activar el enlace y el código QR
                  </Text>
                </Flex>
              )}
            </Box>
          </VStack>
        </Box>

        {/* Botones de acción */}
        <VStack spacing={3} w='full'>
          <Button
            w='full'
            isDisabled={!paymentLink || paymentStatus === 'paid' || paymentStatus === 'expired'}
            leftIcon={<BiCopy />}
            onClick={handleCopyLink}
            size='md'
            variant='outline'
          >
            Copiar enlace
          </Button>
          <Button
            w='full'
            isDisabled={!paymentLink || paymentStatus === 'paid' || paymentStatus === 'expired'}
            leftIcon={<FaWhatsapp />}
            onClick={handleShareLink}
            size='md'
            colorScheme='green'
          >
            Enviar enlace
          </Button>
        </VStack>
      </VStack>
    </Flex>
  )
}

export default PaymentComponent
