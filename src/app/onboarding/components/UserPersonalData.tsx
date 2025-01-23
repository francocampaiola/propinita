import React, { useEffect, useTransition } from 'react'
import { Flex, Box, Text, Button } from '@chakra-ui/react'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import type { OnboardingComponent } from '../onboarding.types'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import { UserType as UserTypes } from '../../types'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import Input from '@/src/components/form/Input'
import Select from '@/src/components/form/Select'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isValidPhoneNumber, getCountries, getCountryCallingCode } from 'react-phone-number-input'
import InputPhone from '@/src/components/form/PhoneInput'

interface IUserTypeOption {
  title: string
  description: string
  value: UserTypes
  image: string
}

const UserType = ({ nextStep }: OnboardingComponent) => {
  const { user } = useGetUser()
  const [isLoading, startTransition] = useTransition()

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
        if (isValidPhoneNumber(val, prefixCountry)) {
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

  const methods = useForm({
    resolver: zodResolver(firstStepSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const action: () => void = methods.handleSubmit(async (data) => {
    const { user_type } = data
    if (!user_type) return

    startTransition(async () => {
      const formData = new FormData()
      formData.append('user_type', user_type)
      await nextStep({ userData: formData })
    })
  })

  useEffect(() => {
    if (!user?.user_type) return
    methods.setValue('user_type', user?.user_type)
  }, [])

  const countries = [{
    title: 'Argentina',
    value: 'AR'
  }, {
    title: 'Brasil',
    value: 'BR'
  }, {
    title: 'Chile',
    value: 'CL'
  }, {
    title: 'Colombia',
    value: 'CO'
  }, {
    title: 'México',
    value: 'MX'
  }, {
    title: 'Perú',
    value: 'PE'
  }, {
    title: 'Uruguay',
    value: 'UY'
  }, {
    title: 'Venezuela',
    value: 'VE'
  }]

  const civil_state = [{
    title: 'Soltero/a',
    value: 'single'
  }, {
    title: 'Casado/a',
    value: 'married'
  }, {
    title: 'Divorciado/a',
    value: 'divorced'
  }, {
    title: 'Viudo/a',
    value: 'widowed'
  }]

  return (
    <Box w={'100%'}>
      <Text fontWeight='600' fontSize='xl' mb={6} textTransform={'uppercase'}>Paso 2</Text>
      <Text fontWeight='600' fontSize='2xl' mb={1}>Datos personales</Text>
      <Text fontSize='sm'>Utilizamos esta información para personalizar tu experiencia.</Text>
      <FormProvider {...methods}>
        <form action={action}>
          <Flex mb={4} mt={4} direction={'column'} gap={4}>
            <Box width='100%' mt={2}>
              <Input
                placeholder='Ingresar como figura en el DNI'
                label='Nombre'
                name='first_name'
                size='lg'
                defaultValue={user?.first_name}
              />
            </Box>
            <Box width='100%' mr={2}>
              <Input
                placeholder='Ingresar como figura en el DNI'
                label='Apellido'
                name='last_name'
                size='lg'
                defaultValue={user?.last_name}
              />
            </Box>
            <Box width='100%' mr={2}>
              <Controller
                name='nationality'
                control={methods.control}
                render={({ field: { onChange, value } }) => {
                  /* forma para setear un defaultvalue sin usar la propiedad defaultValue (que solo sirve para uncontrolled fields) */
                  return (
                    <Select
                      label='Nacionalidad'
                      placeholder='Seleccionar país'
                      options={countries.map((c) => ({ label: c.title, value: c.value }))}
                      value={countries?.find((c) => c?.title === value)}
                      handleOnChange={(val) => onChange(val?.value)}
                      noOptionsMessage={() => "Sin opciones"}
                    />
                  )
                }}
              />
            </Box>
            <Box width='100%' mr={2}>
              <Controller
                name='civil_state'
                control={methods.control}
                render={({ field: { onChange, value } }) => {
                  /* forma para setear un defaultvalue sin usar la propiedad defaultValue (que solo sirve para uncontrolled fields) */
                  return (
                    <Select
                      label='Estado civil'
                      placeholder='Seleccionar estado civil'
                      options={civil_state.map((c) => ({ label: c.title, value: c.value }))}
                      value={civil_state?.find((c) => c?.title === value)}
                      handleOnChange={(val) => onChange(val?.value)}
                      noOptionsMessage={() => "Sin opciones"}
                    />
                  )
                }}
              />
            </Box>
            <Box width='100%' mr={2}>
              <InputPhone
                methods={methods}
                name='phone'
                label='Teléfono'
                placeholder='11 2233 4455'
                size='lg'
                defaultValue={user?.phone}
                bigSize
              />
            </Box>
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
              isDisabled={!methods.watch('user_type')}
              rightIcon={<FaArrowRight />}
            >
              Siguiente
            </Button>
          </Flex>
        </form>
      </FormProvider>
    </Box>
  )
}

export default UserType