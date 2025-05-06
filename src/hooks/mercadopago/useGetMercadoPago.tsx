'use client'
import { useQuery } from '@tanstack/react-query'
import { getMercadoPago, getUser } from '@/src/app/action'

export const useGetMercadoPago = () => {
  const {
    isLoading,
    data: mercadopago,
    refetch
  } = useQuery({
    enabled: true,
    queryKey: ['mercadopago'],
    queryFn: async () => {
      const user = await getUser()
      return getMercadoPago(user.id)
    },
    staleTime: 0
  })

  return { mercadopago, isLoading, refetch }
}
