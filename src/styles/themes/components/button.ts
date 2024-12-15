import { StyleFunctionProps } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const Button = {
  baseStyle: (props: StyleFunctionProps) => ({
    transition: '150ms ease-in-out',
    fontWeight: '600',
    bg: mode('gray.100', 'gray.700')(props),
    color: mode('gray.700', 'gray.100')(props),
    _hover: {
      background: mode('gray.200', 'gray.600')(props),
      opacity: '0.8',
      _disabled: {
        opacity: '0.4'
      }
    }
  }),
  variants: {
    primary: {
      background: 'primary',
      borderColor: 'primary',
      color: 'gray.50',
      height: '10',
      _disabled: {
        bg: 'primary'
      },
      _hover: {
        background: 'primary',
        _disabled: {
          bg: 'primary'
        }
      }
    },
    secondary: {
      outline: 'none',
      fontWeight: '400',
      height: '10'
    }
  }
}

export default Button
