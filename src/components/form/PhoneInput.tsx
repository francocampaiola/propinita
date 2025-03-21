import 'react-phone-number-input/style.css'
import React from 'react'
import Select from './Select'
import Input from './Input'
import { Controller, useFormContext } from 'react-hook-form'
import { Flex, Box, Text, type InputProps } from '@chakra-ui/react'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'

interface IInputPhone extends InputProps {
  label: string
  name: string
  bigSize?: boolean
  disabled?: boolean
}

const InputPhone = ({ label, name, bigSize, disabled, ...rest }: IInputPhone) => {
  const callingCodes = getCountries().map((countrie) => ({
    label: (
      <Flex alignItems='center'>
        <Text>+{getCountryCallingCode(countrie)}</Text>
      </Flex>
    ),
    value: getCountryCallingCode(countrie)
  }));

  let formContext;
  try {
    formContext = useFormContext();
  } catch (error) {
    formContext = null;
  }

  // Versión simplificada cuando no hay FormProvider
  if (!formContext) {
    return (
      <Box>
        <Flex alignItems='flex-end'>
          <Box mr={2}>
            <Select
              label={label}
              options={callingCodes}
              value={callingCodes.find((c) => c.value === '54')}
              disabled={disabled}
              bigSize={bigSize}
            />
          </Box>
          <Box ml={2} flex='1'>
            <Input 
              showErrors={false} 
              name={name} 
              disabled={disabled}
              {...rest} 
            />
          </Box>
        </Flex>
      </Box>
    );
  }

  // Versión completa con FormProvider
  return (
    <Box>
      <Flex alignItems='flex-end'>
        <Box mr={2}>
          <Controller
            name='phone_prefix'
            control={formContext.control}
            defaultValue='54'
            render={({ field: { onChange, value } }) => (
              <Select
                label={label}
                options={callingCodes}
                value={callingCodes.find((c) => c.value === value)}
                handleOnChange={(val) => onChange(val.value)}
                bigSize={bigSize}
              />
            )}
          />
        </Box>
        <Box ml={2} flex='1'>
          <Input showErrors={false} name={name} {...rest} />
        </Box>
      </Flex>
      <Box mt={2}>
        <Text fontSize='sm' color='red.400'>
          {formContext?.formState?.errors?.[name]?.message}
        </Text>
      </Box>
    </Box>
  );
}

export default InputPhone
