'use client'
import { useQuery } from '@tanstack/react-query'
import { getMercadoPago, getUser } from '@/src/app/action'

export const useGetMercadoPago = () => {
  const {
    isLoading,
    data: mercadopago,
    refetch,
    error
  } = useQuery({
    enabled: true,
    queryKey: ['mercadopago'],
    queryFn: async () => {
      try {
        const user = await getUser()
        if (!user) {
          throw new Error('No se encontró el usuario')
        }

        const mpData = await getMercadoPago(user.id)

        // Si no hay datos de MercadoPago, retornamos null sin error
        if (!mpData) {
          return null
        }

        // Verificar el estado de la conexión con MercadoPago
        if (mpData.mp_user_id) {
          try {
            const response = await fetch('/api/mercadopago/check-connection', {
              credentials: 'include',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              }
            })

            if (!response.ok) {
              throw new Error('Error al verificar la conexión con MercadoPago')
            }

            const data = await response.json()
            if (!data.connected) {
              return null
            }

            return mpData
          } catch (error) {
            throw new Error('No se pudo verificar la conexión con MercadoPago')
          }
        }

        return mpData
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error('No se pudo obtener la información de MercadoPago')
      }
    },
    staleTime: 0,
    retry: 1
  })

  return { mercadopago, isLoading, refetch, error }
}
