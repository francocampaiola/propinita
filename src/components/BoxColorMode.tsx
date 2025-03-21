'use client'
import React, { ReactNode } from 'react'
import { Box, BoxProps } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/react'

export interface IBoxColorMode extends BoxProps {
  children?: ReactNode
  bg?: string[]
  color?: string[]
}

const BoxColorMode = ({
  children,
  bg: bgProps = ['white', 'black'],
  color: colorProps = ['black', 'white'],
  ...rest
}: IBoxColorMode) => {
  const bg = useColorModeValue(bgProps[0], bgProps[1])
  const color = useColorModeValue(colorProps[0], colorProps[1])
  return (
    <Box
      background={bg}
      color={color}
      {...rest}
      boxShadow='rgba(0, 0, 0, 0.16) 0px 1px 4px'
    >
      {children}
    </Box>
  )
}

export default BoxColorMode
