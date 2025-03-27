'use client'
import { useQuery } from '@tanstack/react-query'
import { getTransactions, getUser } from '@/src/app/action'

export const useGetTransactions = () => {
  const {
    isLoading,
    data: transactions,
    refetch
  } = useQuery({
    enabled: true,
    queryKey: ['transactions'],
    queryFn: async () => {
      const user = await getUser()
      return getTransactions(user.id)
    },
    staleTime: 0
  })

  return { transactions, isLoading, refetch }
}
