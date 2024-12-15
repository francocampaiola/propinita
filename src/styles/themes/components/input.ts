import { StyleFunctionProps } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
const Input = {
  baseStyle: (props: StyleFunctionProps) => ({
    field: {
      fontWeight: '400',
      outline: '1px solid #828282',
      px: '4',
      color: mode('black', 'white')(props),
      backgroundColor: mode('gray.100 !important', '#292929 !important')(props),
      borderWidth: '0px !important',
      transition: '150ms ease-in-out',
      ':focus-visible': {
        outlineWidth: '2px !important',
        boxShadow: 'none !important',
        outlineColor: 'primary !important'
      }
    }
  })
}

export default Input
