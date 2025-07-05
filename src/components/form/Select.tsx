'use client'
import ReactSelect from 'react-select'
import type { Props } from 'react-select'
import { useColorModeValue, FormLabel, Box, Flex } from '@chakra-ui/react'
import type { IColors } from '@/src/styles/themes/default/colors'
import Tooltip from '../Tooltip'
import colors from '@/src/styles/themes/default/colors'

export interface ISelect extends Props {
  bgProps?: string[]
  colorProps?: string[]
  handleOnChange?: (option: IHandleOnChange) => void
  label?: string
  bigSize?: boolean
  tooltip?: string | React.ReactNode
}

interface IHandleOnChange {
  label: string
  value: number
}

const Select = ({
  bgProps = ['white', 'transparent'],
  colorProps = ['black', 'white'],
  handleOnChange,
  label,
  name,
  bigSize,
  styles,
  tooltip,
  ...rest
}: ISelect) => {
  const background = useColorModeValue(bgProps[0], bgProps[1])
  const color = useColorModeValue(colorProps[0], colorProps[1])
  const backgroundHover = useColorModeValue('gray.300', '#2C2C2C')

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <Flex direction='column'>
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
      <ReactSelect
        onChange={(newValue: unknown) => handleOnChange?.(newValue as IHandleOnChange)}
        {...rest}
        menuPosition='absolute'
        menuPlacement='auto'
        menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
        isSearchable={!isMobile}
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            width: '100%',
            minWidth: '121px',
            padding: '8px',
            height: bigSize ? '3rem' : '100%',
            fontSize: '0.875rem',
            outline: '1px solid #828282',
            borderRadius: '15px !important',
            ':hover': {
              borderColor: colors[background as keyof IColors] || background
            },
            color: colors[color as keyof IColors] || color,
            background: colors[background as keyof IColors] || background,
            borderColor: colors[background as keyof IColors] || background,
            boxShadow: 'none'
          }),
          indicatorSeparator: () => null,
          singleValue: (baseStyles) => ({
            ...baseStyles,
            color: colors[color as keyof IColors] || color
          }),
          input: (baseStyles) => ({
            ...baseStyles,
            color: colors[color as keyof IColors] || color,
            fontSize: '16px'
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            background: colors[background as keyof IColors] || background,
            zIndex: 3,
            borderRadius: '15px !important',
            marginTop: '8px',
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)'
          }),
          menuList: (baseStyles) => ({
            ...baseStyles,
            padding: 0,
            background: 'gray',
            borderRadius: '15px !important'
          }),
          option: (baseStyles) => ({
            ...baseStyles,
            paddingLeft: 14,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            background: colors[background as keyof IColors] || background,
            color: colors[color as keyof IColors] || color,
            ':hover': {
              opacity: '0.8',
              background: backgroundHover
            }
          }),
          ...styles
        }}
      />
    </Flex>
  )
}

export default Select
