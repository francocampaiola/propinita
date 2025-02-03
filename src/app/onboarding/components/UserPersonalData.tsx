'use client'
import React, { useEffect } from 'react'
import { Flex, Box, Text, Button } from '@chakra-ui/react'
import type { OnboardingStepProps } from '../onboarding.types'
import Input from '@/src/components/form/Input'
import Select from '@/src/components/form/Select'
import InputPhone from '@/src/components/form/PhoneInput'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { isValidPhoneNumber, getCountries, getCountryCallingCode } from 'react-phone-number-input'

const UserPersonalData = ({ userData, onNext, isLoading }: OnboardingStepProps) => {
  const firstStepSchema = z.object({
    first_name: z.string().trim().min(1, 'Este campo no puede quedar vacío'),
    last_name: z.string().trim().min(1, 'Este campo no puede quedar vacío'),
    phone: z
      .string()
      .min(1, 'Este campo no puede quedar vacío')
      .superRefine(async (val, customError) => {
        const prefixCountry = getCountries().find(
          (countrie) => getCountryCallingCode(countrie) === methods.watch('phone_prefix')
        )

        // Combina el prefijo y el número
        const fullPhoneNumber = `${methods.watch('phone_prefix')}${val}`

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
    nationality: z.string().trim().min(1, 'Este campo no puede quedar vacío'),
    phone_prefix: z.string().trim().min(1, 'Este campo no puede quedar vacío')
  })

  const countries = [
    { title: 'Argentina', value: 'AR' },
    { title: 'Brasil', value: 'BR' },
    { title: 'Chile', value: 'CL' },
    { title: 'Colombia', value: 'CO' },
    { title: 'México', value: 'MX' },
    { title: 'Perú', value: 'PE' },
    { title: 'Uruguay', value: 'UY' },
    { title: 'Venezuela', value: 'VE' }
  ]

  const civil_state = [
    { title: 'Soltero/a', value: 'single' },
    { title: 'Casado/a', value: 'married' },
    { title: 'Divorciado/a', value: 'divorced' },
    { title: 'Viudo/a', value: 'widowed' }
  ]

  const methods = useForm({
    resolver: zodResolver(firstStepSchema),
    defaultValues: {
      first_name: userData?.first_name || '',
      last_name: userData?.last_name || '',
      phone: userData?.phone || '',
      nationality: userData?.nationality || countries[0]?.value || '',
      civil_state: userData?.civil_state || '',
      phone_prefix: userData?.phone_prefix || ''
    }
  })

  const onSubmit = methods.handleSubmit((data) => {
    onNext(data)
  })

  useEffect(() => {
    /* countiresOptions[10] = Argentina */
    methods.setValue('nationality', userData?.nationality || countries[0]?.value)
  }, [countries])

  return (
    <Box w={'100%'}>
      <Text fontWeight='600' fontSize='xl' mb={6} textTransform={'uppercase'}>
        Paso 2
      </Text>
      <Text fontWeight='600' fontSize='2xl' mb={1}>
        Datos personales
      </Text>
      <Text fontSize='sm'>Utilizamos esta información para personalizar tu experiencia.</Text>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <Flex mb={4} mt={4} direction={'column'} gap={4}>
            <Box width='100%'>
              <Input
                label='Nombre'
                name='first_name'
                size='lg'
                placeholder='Ingresar como figura en el DNI'
              />
            </Box>
            <Box width='100%'>
              <Input
                label='Apellido'
                name='last_name'
                size='lg'
                placeholder='Ingresar como figura en el DNI'
              />
            </Box>
            <Box width='100%'>
              <Controller
                name='nationality'
                control={methods.control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    label='Nacionalidad'
                    placeholder='Seleccionar país'
                    options={countries.map((c) => ({ label: c.title, value: c.value }))}
                    value={countries?.find((c) => c?.title === value)}
                    handleOnChange={(val) => onChange(val?.value)}
                    noOptionsMessage={() => 'Sin opciones'}
                  />
                )}
              />
            </Box>
            <Box width='100%'>
              <Controller
                name='civil_state'
                control={methods.control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    label='Estado civil'
                    placeholder='Seleccionar estado civil'
                    options={civil_state.map((c) => ({ label: c.title, value: c.value }))}
                    value={civil_state?.find((c) => c?.title === value)}
                    handleOnChange={(val) => onChange(val?.value)}
                    noOptionsMessage={() => 'Sin opciones'}
                  />
                )}
              />
            </Box>
            <Box width='100%'>
              <InputPhone
                methods={methods}
                name='phone'
                label='Teléfono'
                placeholder='11 2233 4455'
                size='lg'
                bigSize
              />
            </Box>
          </Flex>
          <Button
            type='submit'
            isLoading={isLoading}
            colorScheme='blue'
            width='full'
            isDisabled={
              !methods.watch('first_name') || !methods.watch('last_name') || !methods.watch('phone')
            }
          >
            Siguiente
          </Button>
        </form>
      </FormProvider>
    </Box>
  )
}

export default UserPersonalData
