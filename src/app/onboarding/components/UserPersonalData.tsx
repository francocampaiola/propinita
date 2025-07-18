'use client'
import React, { useEffect, useMemo } from 'react'
import { Flex, Box, Text, Button, Spinner } from '@chakra-ui/react'
import type { OnboardingStepProps } from '../onboarding.types'
import Input from '@/src/components/form/Input'
import Select from '@/src/components/form/Select'
import InputPhone from '@/src/components/form/PhoneInput'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { isValidPhoneNumber, getCountries, getCountryCallingCode } from 'react-phone-number-input'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

const UserPersonalData = ({
  userData,
  onNext,
  onBack,
  isLoading,
  isLoadingBack
}: OnboardingStepProps) => {
  const firstStepSchema = z.object({
    first_name: z.string().trim().min(1, 'Este campo no puede quedar vacío'),
    last_name: z.string().trim().min(1, 'Este campo no puede quedar vacío'),
    phone: z
      .string()
      .min(1, 'Este campo no puede quedar vacío')
      .superRefine((val, customError) => {
        const prefixCountry = getCountries().find(
          (countrie) => getCountryCallingCode(countrie) === '54'
        )

        // Combina el prefijo y el número
        const fullPhoneNumber = `54${val}`

        if (val.startsWith('54')) {
          customError.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'El número de teléfono no puede comenzar con el código de área'
          })
        }
        if (val.startsWith('01115') || val.startsWith('01111')) {
          customError.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              'El número de teléfono debe empezar con el código de área o el prefijo, no ambos'
          })
        }
        if (val.length >= 12) {
          customError.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'El número de teléfono es demasiado largo'
          })
        }
        if (val.includes('-') || val.includes(' ') || isNaN(parseFloat(val))) {
          customError.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'No se aceptan guiones, espacios y letras.'
          })
        }

        // Validar el número completo
        if (isValidPhoneNumber(fullPhoneNumber, prefixCountry)) {
          return true
        } else {
          customError.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'El número de teléfono no es válido'
          })
        }
      }),
    civil_state: z.string().trim().min(1, 'Este campo no puede quedar vacío'),
    nationality: z.string().trim().min(1, 'Este campo no puede quedar vacío'),
    phone_prefix: z.string().trim().min(1, 'Este campo no puede quedar vacío')
  })

  const countries = useMemo(
    () => [
      { label: 'Argentina', value: 'AR' },
      { label: 'Brasil', value: 'BR' },
      { label: 'Chile', value: 'CL' },
      { label: 'Colombia', value: 'CO' },
      { label: 'México', value: 'MX' },
      { label: 'Perú', value: 'PE' },
      { label: 'Uruguay', value: 'UY' },
      { label: 'Venezuela', value: 'VE' }
    ],
    []
  )

  const civil_state = useMemo(
    () => [
      { label: 'Soltero/a', value: 'single' },
      { label: 'Casado/a', value: 'married' },
      { label: 'Divorciado/a', value: 'divorced' },
      { label: 'Viudo/a', value: 'widowed' }
    ],
    []
  )

  const methods = useForm({
    resolver: zodResolver(firstStepSchema),
    defaultValues: {
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      phone: userData.phone || '',
      civil_state: userData.civil_state || '',
      nationality: userData.nationality || '',
      phone_prefix: '54'
    }
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Box
      w={'100%'}
      position='relative'
      minHeight={{ base: '60vh', md: 'auto' }}
      pb={{ base: 24, md: 0 }}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Overlay spinner centrado en mobile */}
      {isLoading && (
        <Box
          display={{ base: 'flex', md: 'none' }}
          position={{ base: 'fixed', md: 'absolute' }}
          top={0}
          left={0}
          width='100vw'
          height='100vh'
          alignItems='center'
          justifyContent='center'
          zIndex={2000}
        >
          <Spinner size='xl' thickness='4px' color='primary' speed='0.7s' />
        </Box>
      )}
      <Text fontWeight='600' fontSize='xl' mb={6} textTransform={'uppercase'}>
        Paso 1
      </Text>
      <Text fontWeight='600' fontSize='2xl' mb={1}>
        Datos personales
      </Text>
      <Text fontSize='sm'>Utilizamos esta información para personalizar tu experiencia.</Text>
      {/* Oculta el formulario en mobile si isLoading */}
      <Box display={{ base: isLoading ? 'none' : 'block', md: 'block' }}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onNext)}>
            <Flex mb={4} mt={4} direction={'column'} gap={4}>
              <Box width={{ base: '90%', md: '100%' }} mx='auto'>
                <Input
                  label='Nombre'
                  name='first_name'
                  size='lg'
                  placeholder='Ingresar como figura en el DNI'
                  fontSize={{ base: '16px', md: 'inherit' }}
                />
              </Box>
              <Box width={{ base: '90%', md: '100%' }} mx='auto'>
                <Input
                  label='Apellido'
                  name='last_name'
                  size='lg'
                  placeholder='Ingresar como figura en el DNI'
                  fontSize={{ base: '16px', md: 'inherit' }}
                />
              </Box>
              <Box width={{ base: '90%', md: '100%' }} mx='auto'>
                <Controller
                  name='nationality'
                  control={methods.control}
                  render={({ field: { onChange, value } }) => (
                    <Box width='100%'>
                      <Select
                        label='Nacionalidad'
                        placeholder='Seleccionar país'
                        options={countries}
                        value={countries.find((c) => c.value === value)}
                        handleOnChange={(val) => onChange(val.value)}
                        noOptionsMessage={() => 'Sin opciones'}
                      />
                    </Box>
                  )}
                />
              </Box>
              <Box width={{ base: '90%', md: '100%' }} mx='auto'>
                <Controller
                  name='civil_state'
                  control={methods.control}
                  render={({ field: { onChange, value } }) => (
                    <Box width='100%'>
                      <Select
                        label='Estado civil'
                        placeholder='Seleccionar estado civil'
                        options={civil_state}
                        value={civil_state.find((c) => c.value === value)}
                        handleOnChange={(val) => onChange(val.value)}
                        noOptionsMessage={() => 'Sin opciones'}
                      />
                    </Box>
                  )}
                />
              </Box>
              <Box width={{ base: '90%', md: '100%' }} mx='auto'>
                <InputPhone
                  name='phone'
                  label='Teléfono'
                  placeholder='11 2233 4455'
                  size='lg'
                  bigSize
                  fontSize={{ base: '16px', md: 'inherit' }}
                />
              </Box>
            </Flex>
            <Flex justifyContent='flex-end'>
              <Button
                variant='secondary'
                type='button'
                mt={4}
                mr={4}
                size='sm'
                onClick={onBack}
                isLoading={isLoadingBack}
                isDisabled={true}
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
                isDisabled={!methods.formState.isValid}
                rightIcon={<FaArrowRight />}
              >
                Siguiente
              </Button>
            </Flex>
          </form>
        </FormProvider>
      </Box>
    </Box>
  )
}

export default UserPersonalData
