'use client'

import { Text } from '@chakra-ui/react'
import { useGetUser } from '@/src/hooks/users/useGetUser'

const Dashboard = () => {

  const { user, isLoading } = useGetUser()

  if (isLoading) {
    return (
      <Text>Cargando...</Text>
    )
  }

  console.log(user)

  return (
    <Text>{user?.created_at}</Text>
  )
}

export default Dashboard