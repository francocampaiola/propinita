'use client'
import React, { useRef, useState } from 'react'
import {
    Input as ChakraInput,
    InputGroup,
    InputRightAddon,
    Text,
    FormLabel,
    FormControl,
    Button,
    Box,
    Flex
} from '@chakra-ui/react'
import Tooltip from '../Tooltip'
import { useFormContext } from 'react-hook-form'
import { LuPaperclip } from 'react-icons/lu'
import { TfiTrash } from 'react-icons/tfi'

import { LuEye } from 'react-icons/lu'
import { LuEyeOff } from 'react-icons/lu'

import type { InputProps, BoxProps } from '@chakra-ui/react'

export interface IInput extends InputProps {
    inputRight?: string | React.ReactNode
    inputRightProps?: BoxProps
    label?: string
    showPassword?: boolean
    tooltip?: string | React.ReactNode
    showErrors?: boolean
    reactHookForm?: boolean
}

export interface IInputFile {
    name: string
    label?: string
    info?: string
    defaultValue?: string
}
const Input = ({
    inputRight,
    inputRightProps,
    label,
    showPassword,
    type,
    name,
    tooltip,
    showErrors = true,
    ...rest
}: IInput) => {
    const [showInput, setShowInput] = useState(false)
    const rightAddonRef = useRef(null)

    const { register, formState, watch } = useFormContext()

    return (
        <FormControl>
            <Flex alignItems='center' mb={2}>
                <FormLabel mb={0} fontSize='sm'>
                    {label}
                </FormLabel>
                {tooltip && (
                    <Tooltip color='white' background='black' hasArrow borderRadius='md' padding='2'>
                        <Box>{tooltip}</Box>
                    </Tooltip>
                )}
            </Flex>

            <InputGroup borderTopRightRadius='20px'>
                <ChakraInput
                    pl={4}
                    pr={4 + rightAddonRef?.current?.offsetWidth}
                    {...rest}
                    {...register(name)}
                    borderRadius='15px !important'
                    fontSize='sm'
                    _placeholder={{ fontSize: 'sm' }}
                    type={showInput ? 'text' : type}
                />
                {showPassword && (
                    <>
                        <InputRightAddon
                            height='100%'
                            zIndex='10'
                            position='absolute'
                            background='transparent'
                            right='0'
                            top='0'
                            mr={0}
                            ref={rightAddonRef}
                            {...inputRightProps}
                        >
                            <Button
                                isDisabled={!watch(name)}
                                size='sm'
                                padding={0}
                                background='transparent'
                                fontSize='24px'
                                color={'primary'}
                                onClick={() => setShowInput(!showInput)}
                                _hover={{ background: 'transparent' }}
                                _active={{ background: 'transparent' }}
                                _focus={{ boxShadow: 'none' }}
                            >
                                {showInput ? <LuEyeOff /> : <LuEye />}
                            </Button>
                        </InputRightAddon>
                    </>
                )}
                {inputRight && (
                    <InputRightAddon
                        height='100%'
                        zIndex='10'
                        position='absolute'
                        background='transparent'
                        right='0'
                        top='0'
                        mr={0}
                        ref={rightAddonRef}
                        {...inputRightProps}
                    >
                        {typeof inputRight === 'object' ? inputRight : <Text>{inputRight}</Text>}
                    </InputRightAddon>
                )}
            </InputGroup>
            {showErrors && formState.errors[name] && (
                <Text color='red.400' mt={1} fontSize='sm'>
                    {formState.errors[name].message as string}
                </Text>
            )}
        </FormControl>
    )
}

export const Radio = ({
    children,
    name,
    value,
    defaultChecked,
    ...rest
}: {
    children?: React.ReactElement
    name: string
    value?: any
    defaultChecked?: any
}) => {
    const { register } = useFormContext()
    return (
        <Box>
            {children}
            <input
                {...register(name)}
                value={value}
                defaultChecked={defaultChecked}
                type='radio'
                style={{
                    height: '20px',
                    width: '20px',
                    cursor: 'pointer',
                    verticalAlign: 'middle'
                }}
                {...rest}
            />
        </Box>
    )
}

export const InputFile = ({
    name,
    label,
    defaultValue,
    info,
    ...rest
}: {
    name: string
    label?: string
    info?: string
    defaultValue?: string
}) => {
    const { register, formState, resetField, watch } = useFormContext()
    return (
        <>
            <Flex alignItems='center' justifyContent='space-between'>
                <FormLabel fontSize='sm' htmlFor={name} mb={2}>
                    {label}
                </FormLabel>
            </Flex>
            <Flex
                backgroundColor='#292929'
                cursor='pointer'
                position='relative'
                border='1px dashed gray'
                borderRadius='xl'
                alignItems='center'
                p={6}
                height='100%'
            >
                {watch(name)?.[0]?.name || defaultValue ? (
                    <Flex width='100%' alignItems='center' justifyContent='space-between'>
                        <Box borderRadius='xl' border='1px solid white' p={1}>
                            <Text fontSize='sm' isTruncated maxWidth={{ base: '150px', md: '200px' }}>
                                {watch(name)?.[0]?.name ? watch(name)?.[0]?.name : defaultValue}
                            </Text>
                        </Box>
                        {watch(name)?.[0]?.name && (
                            <Box onClick={() => resetField(name)} color='red.600' fontSize='2xl' zIndex='2'>
                                <TfiTrash />
                            </Box>
                        )}
                    </Flex>
                ) : (
                    <Flex width='100%' justifyContent='space-between' alignItems='center'>
                        <Box>
                            <Text fontSize='sm'>Arrastra y suelta o selecciona la imagen</Text>
                            {info && (
                                <Text mt={2} color='gray' fontSize='xs'>
                                    {info}
                                </Text>
                            )}
                        </Box>
                        <Box fontSize='2xl' color='primary'>
                            <LuPaperclip />
                        </Box>
                    </Flex>
                )}
                <FormControl position='absolute' opacity='0' top={0} left={0} height='100%'>
                    <ChakraInput
                        {...register(name)}
                        {...rest}
                        name={name}
                        type='file'
                        style={{
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer'
                        }}
                    />
                </FormControl>
            </Flex>
            {formState.errors[name] && (
                <Text color='red.400' mt={1} fontSize='sm'>
                    {formState.errors[name].message as string}
                </Text>
            )}
        </>
    )
}

export const SimpleInput = ({
    inputRight,
    inputRightProps,
    label,
    showPassword,
    type,
    name,
    tooltip,
    reactHookForm = true,
    ...rest
}: IInput) => {
    const [showInput, setShowInput] = useState(false)
    const rightAddonRef = useRef(null)
    return (
        <FormControl>
            <Flex alignItems='center' mb={2}>
                <FormLabel mb={0} fontSize='sm'>
                    {label}
                </FormLabel>
                {tooltip && (
                    <Tooltip color='white' background='black' hasArrow borderRadius='md' padding='2'>
                        <Box>{tooltip}</Box>
                    </Tooltip>
                )}
            </Flex>

            <InputGroup borderTopRightRadius='20px'>
                <ChakraInput
                    pl={4}
                    pr={4 + rightAddonRef?.current?.offsetWidth}
                    {...rest}
                    borderRadius='md !important'
                    fontSize='sm'
                    _placeholder={{ fontSize: 'sm' }}
                    type={showInput ? 'text' : type}
                />
                {showPassword && (
                    <>
                        <InputRightAddon
                            height='100%'
                            zIndex='10'
                            position='absolute'
                            background='transparent'
                            right='0'
                            top='0'
                            mr={0}
                            ref={rightAddonRef}
                            {...inputRightProps}
                        >
                            <Button variant='transparent' size='sm' onClick={() => setShowInput(!showInput)}>
                                {showInput ? <LuEyeOff /> : <LuEye />}
                            </Button>
                        </InputRightAddon>
                    </>
                )}
                {inputRight && (
                    <InputRightAddon
                        height='100%'
                        zIndex='10'
                        position='absolute'
                        background='transparent'
                        right='0'
                        top='0'
                        mr={0}
                        ref={rightAddonRef}
                        {...inputRightProps}
                    >
                        {typeof inputRight === 'object' ? inputRight : <Text>{inputRight}</Text>}
                    </InputRightAddon>
                )}
            </InputGroup>
        </FormControl>
    )
}

export default Input