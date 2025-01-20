'use client'
import React, { useTransition } from 'react'
import { OnboardingComponent } from '../onboarding.types'
import { useGetUser } from '@/src/hooks/users/useGetUser'
import { useForm, FormProvider } from 'react-hook-form'
import type {
    UserType
} from '../../types';
import { Box, Text } from '@chakra-ui/react';

interface IRadioInputs {
    title: string
    description: string
    value: UserType
}

const UserType = ({ nextStep }: OnboardingComponent) => {

    const { user } = useGetUser()
    const methods = useForm()

    const [isLoading, startTransition] = useTransition()

    const action: () => void = methods.handleSubmit(async (data) => {
        startTransition(() => {
            nextStep({ userData: data })
        })
    })

    const radioInputs: IRadioInputs[] = [
        {
            title: 'Usuario',
            description: 'Voy a utilizar Propinita para vincular mi cuenta bancaria o billetera virtual y poder gestionar las propinas que brindo desde la aplicación.',
            value: 'user'
        },
        {
            title: 'Proveedor',
            description: 'Como proveedor, recibo ventajas en el régimen monotributista. Me clasifico en categorías según mis ingresos y no tengo la opción de contratar empleados.',
            value: 'provider'
        }
    ]

    return (
        <Box>
            <Text fontWeight='600' fontSize='2xl' mb={6} color={'white'}>
                ¿Con qué perfil te identificás?
            </Text>
        </Box>
    )
}

export default UserType