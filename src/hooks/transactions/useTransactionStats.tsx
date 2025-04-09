'use client'
import { useMemo } from 'react'
import { useGetTransactions } from './useGetTransactions'

export const useTransactionStats = () => {
  const { transactions, isLoading } = useGetTransactions()

  const stats = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        today: {
          amount: 0,
          percentageChange: 0
        },
        thisWeek: {
          amount: 0,
          percentageChange: 0
        },
        average: {
          amount: 0,
          totalTransactions: 0
        }
      }
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())

    const startOfLastWeek = new Date(startOfWeek)
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)

    // Calcular montos por día y semana
    const todayTransactions = transactions.filter((t) => new Date(t.created_at) >= today)
    const todayAmount = todayTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)

    const yesterdayTransactions = transactions.filter((t) => {
      const date = new Date(t.created_at)
      return date >= yesterday && date < today
    })
    const yesterdayAmount = yesterdayTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)

    const thisWeekTransactions = transactions.filter((t) => new Date(t.created_at) >= startOfWeek)
    const thisWeekAmount = thisWeekTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)

    const lastWeekTransactions = transactions.filter((t) => {
      const date = new Date(t.created_at)
      return date >= startOfLastWeek && date < startOfWeek
    })
    const lastWeekAmount = lastWeekTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)

    // Calcular cambios porcentuales
    const todayPercentageChange =
      yesterdayAmount === 0 ? 0 : ((todayAmount - yesterdayAmount) / yesterdayAmount) * 100

    const weekPercentageChange =
      lastWeekAmount === 0 ? 0 : ((thisWeekAmount - lastWeekAmount) / lastWeekAmount) * 100

    // Calcular promedio general
    const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0)
    const averageAmount = totalAmount / transactions.length

    return {
      today: {
        amount: todayAmount,
        percentageChange: todayPercentageChange
      },
      thisWeek: {
        amount: thisWeekAmount,
        percentageChange: weekPercentageChange
      },
      average: {
        amount: averageAmount,
        totalTransactions: transactions.length
      }
    }
  }, [transactions])

  return { stats, isLoading }
}
