import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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
  useToast,
  Icon
} from '@chakra-ui/react'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import qrImage from '@/src/assets/templates/qr.svg'
import { FaInfoCircle, FaShareAlt, FaCheckCircle, FaPlus } from 'react-icons/fa'
import { MdOutlineAttachMoney } from 'react-icons/md'
import { BiCopy, BiErrorCircle } from 'react-icons/bi'

const PaymentComponent = () => {
  const toast = useToast()

  // States y refs
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
  const { user, isLoading: isLoadingUser } = useGetUser()
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const expirationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const checkTransactionStatus = async () => {
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

        toast({
          title: '¡Pago recibido!',
          description: 'La propina ha sido recibida correctamente.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      }
    } catch (error) {
      console.error('Error al verificar el estado del pago:', error)
    } finally {
      setIsCheckingPayment(false)
    }
  }

  const clearTimeouts = () => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current)
      checkIntervalRef.current = null
    }
    if (expirationTimeoutRef.current) {
      clearTimeout(expirationTimeoutRef.current)
      expirationTimeoutRef.current = null
    }
  }

  const handleExpiration = () => {
    setPaymentStatus('expired')
    setPaymentLink(null)
    setQrCode(null)
    setExpirationTime(null)
    clearTimeouts()
    setAmount('')

    toast({
      title: 'Cobro expirado',
      description: 'El código QR y el enlace de pago han expirado. Por favor, genera uno nuevo.',
      status: 'warning',
      duration: 5000,
      isClosable: true
    })
  }

  useEffect(() => {
    if (paymentStatus === 'active' && currentTransactionId) {
      checkTransactionStatus()

      checkIntervalRef.current = setInterval(() => {
        checkTransactionStatus()
      }, 2000)

      // Configurar el temporizador de expiración (30 segundos)
      const expirationDelay = 60000 // 60 segundos
      setExpirationTime(Date.now() + expirationDelay)

      expirationTimeoutRef.current = setTimeout(() => {
        handleExpiration()
      }, expirationDelay)

      return () => clearTimeouts()
    }
  }, [paymentStatus, currentTransactionId])

  // Efecto para actualizar el tiempo restante
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (expirationTime && paymentStatus === 'active') {
      timer = setInterval(() => {
        const now = Date.now()
        if (now >= expirationTime) {
          handleExpiration()
        }
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [expirationTime, paymentStatus])

  const generateQRCode = async (url: string) => {
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
      console.error('Error al generar el código QR:', error)
      toast({
        title: 'Error',
        description: 'No se pudo generar el código QR. Por favor, intenta nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  const handleGeneratePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa un monto válido',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return
    }

    if (!user) {
      toast({
        title: 'Error',
        description: 'No se pudo obtener la información del usuario',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return
    }

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
      // Generar el código QR en el cliente
      await generateQRCode(data.initPoint)
      setPaymentStatus('active')
      setCurrentTransactionId(data.transactionId)

      toast({
        title: 'Éxito',
        description: 'Link de pago generado correctamente. Expirará en 30 segundos.',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al generar el pago. Por favor, intenta nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink)
      toast({
        title: 'Copiado',
        description: 'El enlace se ha copiado al portapapeles',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
    }
  }

  const handleShareLink = () => {
    if (paymentLink) {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        `Paga tu propina aquí: ${paymentLink}`
      )}`
      window.open(whatsappUrl, '_blank')
    }
  }

  const handleNewPayment = () => {
    setAmount('')
    setPaymentLink(null)
    setQrCode(null)
    setPaymentStatus('inactive')
    setCurrentTransactionId(null)
    setExpirationTime(null)
    clearTimeouts()
  }

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
                  <BiErrorCircle size={40} color='#2C2C2C' />
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
                  boxSize={10}
                  color={paymentStatus === 'paid' ? 'green.500' : 'red.500'}
                />
              </Flex>
            )}
          </Box>
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
                isDisabled={paymentStatus === 'paid' || paymentStatus === 'active'}
              />
              <InputRightElement width={'auto'} mr={2}>
                <Button
                  h='1.75rem'
                  size='sm'
                  variant={'primary'}
                  onClick={handleGeneratePayment}
                  isLoading={isLoading}
                  isDisabled={paymentStatus === 'paid' || paymentStatus === 'active'}
                >
                  Generar cobro
                </Button>
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
                    backgroundColor={
                      paymentStatus === 'active'
                        ? 'primary'
                        : paymentStatus === 'paid'
                        ? 'blue.100'
                        : paymentStatus === 'expired'
                        ? 'red.100'
                        : 'primary'
                    }
                    color={
                      paymentStatus === 'active'
                        ? 'secondary'
                        : paymentStatus === 'paid'
                        ? 'blue.700'
                        : paymentStatus === 'expired'
                        ? 'red.700'
                        : '#624A21'
                    }
                    fontWeight={700}
                  >
                    {paymentStatus === 'active'
                      ? 'Pendiente'
                      : paymentStatus === 'paid'
                      ? 'Pagado'
                      : paymentStatus === 'expired'
                      ? 'Expirado'
                      : 'Inactivo'}
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
                  leftIcon={<FaShareAlt />}
                  onClick={handleShareLink}
                >
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
