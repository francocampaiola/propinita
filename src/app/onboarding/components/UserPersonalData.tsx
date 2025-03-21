'use client'
import React, { useEffect, useMemo, useState } from 'react'
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
  const [isMounted, setIsMounted] = useState(false);
  const [formValues, setFormValues] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    civil_state: '',
    nationality: '',
    phone_prefix: ''
  });

  const firstStepSchema = z.object({
    first_name: z.string().trim().min(1, 'Este campo no puede quedar vacío'),
    last_name: z.string().trim().min(1, 'Este campo no puede quedar vacío'),
    phone: z
      .string()
      .min(1, 'Este campo no puede quedar vacío')
      .superRefine((val, customError) => {
        const prefixCountry = getCountries().find(
          (countrie) => getCountryCallingCode(countrie) === formValues.phone_prefix
        )

        // Combina el prefijo y el número
        const fullPhoneNumber = `${formValues.phone_prefix}${val}`

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
    defaultValues: formValues
  })

  // Marcar el componente como montado
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Actualizar valores del formulario cuando cambian los datos del usuario
  useEffect(() => {
    if (!isMounted) return;
    
    const newValues = {
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      phone: userData.phone || '',
      civil_state: userData.civil_state || '',
      nationality: userData.nationality || '',
      phone_prefix: userData.phone_prefix || ''
    };
    
    setFormValues(newValues);
    methods.reset(newValues);
  }, [userData, methods, isMounted]);

  // Actualizar formValues cuando cambian los valores del formulario
  useEffect(() => {
    if (!isMounted) return;
    
    const subscription = methods.watch((value) => {
      setFormValues(value as typeof formValues);
    });
    
    return () => subscription.unsubscribe();
  }, [methods, isMounted]);

  if (!isMounted) {
    return (
      <Box w={'100%'}>
        <Text fontWeight='600' fontSize='xl' mb={6} textTransform={'uppercase'}>
          Paso 2
        </Text>
        <Text fontWeight='600' fontSize='2xl' mb={1}>
          Datos personales
        </Text>
        <Text fontSize='sm'>Utilizamos esta información para personalizar tu experiencia.</Text>
        <Flex mb={4} mt={4} direction={'column'} gap={4}>
          <Box width='100%'>
            <Input
              label='Nombre'
              name='first_name'
              size='lg'
              placeholder='Ingresar como figura en el DNI'
              disabled
            />
          </Box>
          <Box width='100%'>
            <Input
              label='Apellido'
              name='last_name'
              size='lg'
              placeholder='Ingresar como figura en el DNI'
              disabled
            />
          </Box>
          <Box width='100%'>
            <Select
              label='Nacionalidad'
              placeholder='Seleccionar país'
              options={countries}
              disabled
            />
          </Box>
          <Box width='100%'>
            <Select
              label='Estado civil'
              placeholder='Seleccionar estado civil'
              options={civil_state}
              disabled
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
              disabled
            />
          </Box>
        </Flex>
        <Button
          type='submit'
          isLoading={isLoading}
          colorScheme='blue'
          width='full'
          disabled
        >
          Cargando...
        </Button>
      </Box>
    );
  }

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
        <form onSubmit={methods.handleSubmit(onNext)}>
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
                    options={countries.map((c) => ({ label: c.label, value: c.value }))}
                    value={countries?.find((c) => c?.label === value)}
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
                    options={civil_state.map((c) => ({ label: c.label, value: c.value }))}
                    value={civil_state?.find((c) => c?.value === value)}
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
              !formValues.first_name || 
              !formValues.last_name || 
              !formValues.phone ||
              !formValues.nationality ||
              !formValues.civil_state ||
              !formValues.phone_prefix
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
