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
      const mpData = await getMercadoPago(user.id)

      // Verificar el estado de la conexión con MercadoPago
      if (mpData?.mp_user_id) {
        try {
          const response = await fetch('/api/mercadopago/check-connection', {
            credentials: 'include',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          })

          if (!response.ok) {
            return null
          }

          const data = await response.json()
          if (!data.connected) {
            return null
          }

          return mpData
        } catch (error) {
          console.error('Error verificando conexión con MercadoPago:', error)
          return null
        }
      }

      return mpData
    },
    staleTime: 0
  })

  return { mercadopago, isLoading, refetch }
}
