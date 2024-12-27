import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Box } from '@chakra-ui/react'
const Checkbox = ({
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
      <input
        style={{ background: 'red' }}
        {...register(name)}
        {...rest}
        value={value}
        type='checkbox'
      />
    </Box>
  )
}

export default Checkbox