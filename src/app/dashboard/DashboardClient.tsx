'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import DashboardSkeleton from './components/DashboardSkeleton'

const Dashboard = dynamic(() => import('./dashboard'), {
  ssr: false,
  loading: () => <DashboardSkeleton />
})

const DashboardClient = () => {
  return <Dashboard />
}

export default DashboardClient
