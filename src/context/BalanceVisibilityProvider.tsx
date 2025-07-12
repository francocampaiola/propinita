'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface BalanceVisibilityContextType {
  showBalance: boolean
  toggleBalanceVisibility: () => void
}

const BalanceVisibilityContext = createContext<BalanceVisibilityContextType | undefined>(undefined)

export const useBalanceVisibility = () => {
  const context = useContext(BalanceVisibilityContext)
  if (context === undefined) {
    throw new Error('useBalanceVisibility debe ser usado dentro de BalanceVisibilityProvider')
  }
  return context
}

interface BalanceVisibilityProviderProps {
  children: ReactNode
}

export const BalanceVisibilityProvider = ({ children }: BalanceVisibilityProviderProps) => {
  const [showBalance, setShowBalance] = useState(true)

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance)
  }

  return (
    <BalanceVisibilityContext.Provider value={{ showBalance, toggleBalanceVisibility }}>
      {children}
    </BalanceVisibilityContext.Provider>
  )
}
