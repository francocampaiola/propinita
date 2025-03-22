'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const Dashboard = dynamic(() => import('./dashboard'), {
  ssr: false,
  loading: () => <div>Cargando...</div>
})

const DashboardClient = () => {
  return <Dashboard />
}

export default DashboardClient
