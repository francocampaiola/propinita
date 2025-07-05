import 'react-phone-number-input/style.css'
import React from 'react'
import Select from './Select'
import Input from './Input'
import { Controller, useFormContext } from 'react-hook-form'
import { Flex, Box, Text, type InputProps, useBreakpointValue } from '@chakra-ui/react'
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
  }))

  const formContext = useFormContext()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const renderContent = () => {
    if (!formContext) {
      return (
        <Box>
          <Flex alignItems='flex-end'>
            <Box mr={2}>
              <Select
                label={label}
                options={callingCodes}
                value={callingCodes.find((c) => c.value === '54')}
                isDisabled={disabled}
                bigSize={bigSize}
              />
            </Box>
            <Box ml={2} flex='1'>
              <Input
                showErrors={false}
                name={name}
                disabled={disabled}
                height={isMobile ? '3rem' : undefined}
                py={isMobile ? 2 : undefined}
                inputMode={isMobile ? 'numeric' : undefined}
                autoComplete={isMobile ? 'tel' : undefined}
                {...rest}
              />
            </Box>
          </Flex>
        </Box>
      )
    }

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
            <Input
              showErrors={false}
              name={name}
              height={isMobile ? '3rem' : undefined}
              py={isMobile ? 2 : undefined}
              inputMode={isMobile ? 'numeric' : undefined}
              autoComplete={isMobile ? 'tel' : undefined}
              {...rest}
            />
          </Box>
        </Flex>
        <Box mt={2}>
          <Text fontSize='sm' color='red.400'>
            {formContext.formState?.errors?.[name]?.message?.toString()}
          </Text>
        </Box>
      </Box>
    )
  }

  return renderContent()
}

export default InputPhone
