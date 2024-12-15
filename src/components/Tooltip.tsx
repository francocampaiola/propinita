import React from 'react'
import { Tooltip as ChakraTooltip, Box, useDisclosure } from '@chakra-ui/react'
import type { TooltipProps } from '@chakra-ui/react'
import { TfiInfoAlt } from 'react-icons/tfi'
interface ITooltip extends TooltipProps {
    icon?: React.ReactElement
    children: React.ReactElement
}
const Tooltip = ({ icon = <TfiInfoAlt />, children, ...rest }: ITooltip) => {
    const { isOpen, onOpen, onToggle, onClose } = useDisclosure()

    return (
        <ChakraTooltip
            isOpen={isOpen}
            color='white'
            background='black'
            hasArrow
            placement='bottom-end'
            borderRadius='md'
            padding='2'
            {...rest}
            label={children}
        >
            <Box color='primary' onClick={onToggle} onMouseEnter={onOpen} onMouseLeave={onClose}>
                {icon}
            </Box>
        </ChakraTooltip>
    )
}

export default Tooltip