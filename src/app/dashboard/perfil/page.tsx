'use client'

import Input from '@/src/components/form/Input'
import InputPhone from '@/src/components/form/PhoneInput'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import { useGetTransactions } from '@/src/hooks/transactions/useGetTransactions'
import { Divider, Flex, Text, Spinner, Button, useBreakpointValue } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { editUser } from '@/src/app/onboarding/action'
import { handleToast } from '@/src/utils/toast'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { isValidPhoneNumber, getCountries, getCountryCallingCode } from 'react-phone-number-input'
import { BsPencil } from 'react-icons/bs'

const countries = [
  { label: 'Argentina', value: 'AR' },
  { label: 'Brasil', value: 'BR' },
  { label: 'Chile', value: 'CL' },
  { label: 'Colombia', value: 'CO' },
  { label: 'México', value: 'MX' },
  { label: 'Perú', value: 'PE' },
  { label: 'Uruguay', value: 'UY' },
  { label: 'Venezuela', value: 'VE' }
]

const civil_state = [
  { label: 'Soltero/a', value: 'single' },
  { label: 'Casado/a', value: 'married' },
  { label: 'Divorciado/a', value: 'divorced' },
  { label: 'Viudo/a', value: 'widowed' }
]

const getLabel = (value: string, options: { value: string; label: string }[]) => {
  const option = options.find((option) => option.value === value)
  return option ? option.label : value
}

const Perfil = () => {
  const { user, isLoading, refetch } = useGetUser()
  const { refetch: refetchTransactions } = useGetTransactions()
  const [isSaving, setIsSaving] = useState(false)
  const isMobile = useBreakpointValue({ base: true, md: false })

  const schema = z.object({
    first_name: z.string().trim().min(1, 'Este campo no puede quedar vacío'),
    last_name: z.string().trim().min(1, 'Este campo no puede quedar vacío'),
    phone: z
      .string()
      .min(1, 'Este campo no puede quedar vacío')
      .superRefine((val, customError) => {
        const prefixCountry = getCountries().find(
          (countrie) => getCountryCallingCode(countrie) === '54'
        )

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

        if (isValidPhoneNumber(fullPhoneNumber, prefixCountry)) {
          return true
        } else {
          customError.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'El número de teléfono no es válido'
          })
        }
      }),
    monthly_goal: z
      .string()
      .optional()
      .transform((val) => {
        if (!val) return '0'
        return val.replace(/[^0-9]/g, '')
      })
  })

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      monthly_goal: ''
    },
    mode: 'onChange'
  })

  useEffect(() => {
    if (user) {
      methods.reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        monthly_goal: user.monthly_goal?.toString() || ''
      })
    }
  }, [user, methods])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const values = methods.getValues()

      if (!values.first_name.trim() || !values.last_name.trim() || !values.phone.trim()) {
        handleToast({
          title: 'Error',
          text: 'Por favor, completa todos los campos requeridos',
          status: 'error'
        })
        return
      }

      const prefixCountry = getCountries().find(
        (countrie) => getCountryCallingCode(countrie) === '54'
      )
      const fullPhoneNumber = `54${values.phone}`

      if (!isValidPhoneNumber(fullPhoneNumber, prefixCountry)) {
        handleToast({
          title: 'Error',
          text: 'El número de teléfono no es válido',
          status: 'error'
        })
        return
      }

      await editUser({
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone,
        monthly_goal: values.monthly_goal ? Number(values.monthly_goal) : 0
      })

      await Promise.all([refetch(), refetchTransactions()])

      handleToast({
        title: 'Cambios guardados',
        text: 'Tus datos han sido actualizados correctamente',
        status: 'success'
      })
    } catch (error) {
      handleToast({
        title: 'Error',
        text: 'Hubo un error al guardar los cambios. Por favor, intenta nuevamente.',
        status: 'error'
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !user) {
    return (
      <Flex justifyContent='center' alignItems='center' height='100%'>
        <Spinner size='lg' mt={4} color='primary' />
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
        <Text fontWeight={700}>Mi perfil</Text>
      </Flex>
      <Divider borderColor='components.divider' />
      <Flex flex={1} mx={4} mt={4} mb={4} direction='column' gap={4}>
        <Flex
          gap={{ base: 4, md: 8 }}
          w={{ base: '100%', md: '75%' }}
          direction={{ base: 'column', md: 'row' }}
        >
          <Flex direction='column' gap={4} mb={{ base: 4, md: 12 }} flex={1}>
            <FormProvider {...methods}>
              <Input
                label='Nombre'
                name='first_name'
                size='lg'
                value={methods.watch('first_name')}
                onChange={(e) => methods.setValue('first_name', e.target.value)}
                showErrors={true}
                inputRight={<BsPencil size={12} color='gray' />}
                inputRightProps={{
                  border: 'none'
                }}
                inputMode={isMobile ? 'text' : undefined}
                autoComplete={isMobile ? 'given-name' : undefined}
              />
              <Input
                label='Apellido'
                name='last_name'
                size='lg'
                value={methods.watch('last_name')}
                onChange={(e) => methods.setValue('last_name', e.target.value)}
                showErrors={true}
                inputRight={<BsPencil size={12} color='gray' />}
                inputRightProps={{
                  border: 'none'
                }}
                inputMode={isMobile ? 'text' : undefined}
                autoComplete={isMobile ? 'family-name' : undefined}
              />
              <InputPhone
                name='phone'
                label='Teléfono'
                placeholder='11 2233 4455'
                size='lg'
                bigSize
              />
              <Input
                label='Correo electrónico'
                name='email'
                size='lg'
                placeholder='Ingresar correo electrónico'
                type='email'
                value={user?.email || ''}
                isDisabled
                inputMode={isMobile ? 'email' : undefined}
                autoComplete={isMobile ? 'email' : undefined}
              />
            </FormProvider>
          </Flex>
          <Flex direction='column' gap={4} flex={1}>
            <Input
              label='Nacionalidad'
              name='nationality'
              size='lg'
              placeholder='Ingresar nacionalidad'
              value={getLabel(user?.nationality || '', countries)}
              isDisabled
            />
            <Input
              label='Estado civil'
              name='civil_state'
              size='lg'
              placeholder='Ingresar estado civil'
              value={getLabel(user?.civil_state || '', civil_state)}
              isDisabled
            />
            <Input
              label='Meta mensual'
              name='monthly_goal'
              size='lg'
              placeholder='Ingresar meta mensual'
              type='text'
              value={methods.watch('monthly_goal')}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                methods.setValue('monthly_goal', value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true
                })
              }}
              showErrors={true}
              inputRight='ARS'
              inputMode={isMobile ? 'numeric' : undefined}
              autoComplete={isMobile ? 'off' : undefined}
            />
          </Flex>
        </Flex>
        <Flex justifyContent='flex-end' mt={4}>
          <Button
            variant='primary'
            size='sm'
            onClick={handleSave}
            isDisabled={!methods.formState.isValid || !methods.formState.isDirty || isSaving}
            isLoading={isSaving}
            w={{ base: '100%', md: 'auto' }}
          >
            Guardar cambios
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Perfil
