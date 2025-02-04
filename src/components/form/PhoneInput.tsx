import 'react-phone-number-input/style.css'
import React, { useEffect } from 'react'
import Select from './Select'
import Input from './Input'
import { Controller } from 'react-hook-form'
import { Flex, Box, Text, type InputProps } from '@chakra-ui/react'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'

interface IInputPhone extends InputProps {
  label: string
  methods: any
  bigSize?: boolean
}

const InputPhone = ({ methods, label, bigSize, ...rest }: IInputPhone) => {
  const callingCodes = getCountries().map((countrie) => ({
    label: (
      <Flex alignItems='center'>
        <Text>+{getCountryCallingCode(countrie)}</Text>
      </Flex>
    ),
    value: getCountryCallingCode(countrie)
  }))

  useEffect(() => {
    /* setting argentina for default value */
    methods?.setValue('phone_prefix', '54')
  }, [methods])
  return (
    <Box>
      <Flex alignItems='flex-end'>
        <Box mr={2}>
          <Controller
            name='phone_prefix'
            control={methods?.control}
            render={({ field: { onChange, value } }) => {
              /* forma para setear un defaultvalue sin usar la propiedad defaultValue (que solo sirve para uncontrolled fields) */
              return (
                <Select
                  label={label}
                  options={callingCodes}
                  value={callingCodes.find((c) => c.value === value)}
                  defaultValue='54'
                  handleOnChange={(val) => onChange(val.value)}
                  bigSize={bigSize}
                />
              )
            }}
          />
        </Box>
        <Box ml={2} flex='1'>
          <Input showErrors={false} {...rest} />
        </Box>
      </Flex>
      <Box mt={2}>
        <Text fontSize='sm' color='red.400'>
          {methods?.formState?.errors?.phone?.message}
        </Text>
      </Box>
    </Box>
  )
}

export default InputPhone
