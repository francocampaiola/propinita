'use client'

import { handleToast } from '@/src/utils/toast'
import { IResponse } from '../types'

export const handleRequest = async <T>(
  request: () => Promise<IResponse<T>>
): Promise<{ data?: T; success: boolean }> => {
  const requestData = await request()
  if (Array.isArray(requestData?.errorMessage)) {
    requestData?.errorMessage.map((error) =>
      handleToast({
        status: 'error',
        title: 'Hubo un error',
        text: error
      })
    )
    return { success: false }
  } else if (typeof requestData?.errorMessage === 'string') {
    handleToast({
      status: 'error',
      title: 'Hubo un error',
      text: requestData?.errorMessage
    })
    return { success: false }
  }

  return { data: requestData?.data, success: true }
}

export const formatDate = (date: string) => {
  const dateObject = new Date(date)
  return dateObject.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
