'use client'
import { useQuery } from '@tanstack/react-query'
import { getUser } from '@/src/app/action'
export const useGetUser = () => {
  const {
    isLoading,
    data: user,
    isError,
    error,
    refetch
  } = useQuery({
    enabled: true,
    queryKey: ['user'],
    queryFn: () => getUser()
  })

  return { user, isLoading, refetch }
}
