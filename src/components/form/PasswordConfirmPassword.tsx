import React, { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Box, Flex, Text } from '@chakra-ui/react'
import Input, { IInput } from './Input'
import type { BoxProps } from '@chakra-ui/react'
import { IoCheckmark } from 'react-icons/io5'
interface IPasswordConfirmPassword {
    methods: UseFormReturn<any>
    newPassword: {
        inputProps: IInput
        boxProps?: BoxProps
    }
    confirmPassword?: {
        inputProps: IInput
        boxProps?: BoxProps
    }
}

const PasswordConfirmPassword = ({
    methods,
    newPassword,
    confirmPassword
}: IPasswordConfirmPassword) => {
    const [isPasswordTouched, setIsPasswordTouched] = useState(null)

    const hasMinimumCharacters = methods?.watch(newPassword?.inputProps?.name)
        ? methods?.watch(newPassword?.inputProps?.name)?.length >= 8
        : null

    const hasSpecialCharacter = methods.watch(newPassword?.inputProps?.name)
        ? new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*').test(
            methods.watch(newPassword?.inputProps?.name)
        )
        : null

    const isPasswordMatching =
        isPasswordTouched !== null && methods?.watch(newPassword?.inputProps?.name)?.length !== 0
            ? methods?.watch(newPassword?.inputProps?.name) ===
            methods?.watch(confirmPassword?.inputProps?.name)
            : null
    return (
        <>
            {/* newPassword Input */}
            <Box {...newPassword?.boxProps}>
                <Input
                    {...newPassword?.inputProps}
                    type='password'
                    size='lg'
                    showErrors={false}
                    showPassword
                />
                <Flex fontSize='xs' mt={2} color='gray' justifyContent={'space-between'}>
                    <Flex alignItems='center'>
                        {hasMinimumCharacters ? (
                            <Box color='primary' mr={1} fontSize='xl'>
                                <IoCheckmark />
                            </Box>
                        ) : (
                            <Text color={hasMinimumCharacters === false && 'red.400'} mr={1}>
                                ∙
                            </Text>
                        )}
                        <Text color={hasMinimumCharacters === false && 'red.400'}>Mínimo de 8 caracteres</Text>
                    </Flex>

                    <Flex alignItems='center'>
                        {hasSpecialCharacter ? (
                            <Box color='primary' mr={1} fontSize='xl'>
                                <IoCheckmark />
                            </Box>
                        ) : (
                            <Text color={hasSpecialCharacter === false && 'red.400'} mr={1}>
                                ∙
                            </Text>
                        )}
                        <Text color={hasSpecialCharacter === false && 'red.400'}>
                            1 caracter especial (!”#$%&/()=?)
                        </Text>
                    </Flex>
                </Flex>
            </Box>
            {confirmPassword && (
                <Box {...confirmPassword?.boxProps}>
                    <Input
                        {...confirmPassword?.inputProps}
                        type='password'
                        size='lg'
                        showPassword
                        onFocus={() => setIsPasswordTouched(true)}
                        showErrors={false}
                    />
                    <Flex fontSize='xs' mt={2} color='gray'>
                        {isPasswordMatching === null
                            ? null
                            : isPasswordMatching && (
                                <Box color='primary' mr={1} fontSize='xl'>
                                    <IoCheckmark />
                                </Box>
                            )}
                        <Text color={isPasswordMatching === false && 'red.400'}>
                            Coincidencia de contraseña
                        </Text>
                    </Flex>
                </Box>
            )}
        </>
    )
}

export default PasswordConfirmPassword