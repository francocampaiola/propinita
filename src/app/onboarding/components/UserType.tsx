'use client'
import { Box, Text, Button, Flex } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { OnboardingStepProps, UserType as UserTypeEnum } from '../onboarding.types'

const options = [
  {
    value: 'user' as UserTypeEnum,
    title: 'Usuario',
    description: 'Voy a utilizar Propinita para gestionar propinas'
  },
  {
    value: 'provider' as UserTypeEnum,
    title: 'Proveedor', 
    description: 'Voy a recibir propinas a través de la plataforma'
  }
]

const UserType = ({ userData, onNext, isLoading }: OnboardingStepProps) => {
  const { handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      user_type: userData.user_type
    }
  })

  const onSubmit = handleSubmit((data) => onNext(data))

  return (
    <Box>
      <Text fontSize="2xl" mb={4}>¿Con qué perfil te identificás?</Text>
      
      <form onSubmit={onSubmit}>
        <Flex direction="column" gap={4} mb={6}>
          {options.map(option => (
            <Box
              key={option.value}
              onClick={() => setValue('user_type', option.value)}
              p={4}
              border="1px solid"
              borderColor={watch('user_type') === option.value ? 'primary' : 'gray.200'}
              borderRadius="md"
              cursor="pointer"
            >
              <Text fontWeight="bold">{option.title}</Text>
              <Text fontSize="sm">{option.description}</Text>
            </Box>
          ))}
        </Flex>

        <Button
          type="submit"
          isLoading={isLoading}
          isDisabled={!watch('user_type')}
          colorScheme="blue"
          width="full"
        >
          Continuar
        </Button>
      </form>
    </Box>
  )
}

export default UserType