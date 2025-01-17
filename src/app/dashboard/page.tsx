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

  return (
    <Text>{user?.email}</Text>
  )
}

export default Dashboard