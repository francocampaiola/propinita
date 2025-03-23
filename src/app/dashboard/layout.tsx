import React from 'react'
import dynamic from 'next/dynamic'
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getUser } from '../action'
const DashboardLayout = dynamic(() => import('./ui/DashboardLayout'))
type Props = {
  children: JSX.Element
}

export const metadata = {
  title: 'Dashboard | Propinita',
  description: 'Dashboard | Propinita'
}

const layout = async ({ children }: Props) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['user'],
    queryFn: getUser
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <DashboardLayout>{children}</DashboardLayout>
    </HydrationBoundary>
  )
}

export default layout
