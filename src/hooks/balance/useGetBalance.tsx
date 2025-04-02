'use client'
import { useQuery } from '@tanstack/react-query'
import { getBalance, getUser } from '@/src/app/action'

export const useGetBalance = () => {
  const {
    isLoading,
    data: balance,
    refetch
  } = useQuery({
    enabled: true,
    queryKey: ['balance'],
    queryFn: async () => {
      const user = await getUser()
      return getBalance(user.id)
    },
    staleTime: 0
  })

  return { balance, isLoading, refetch }
}
