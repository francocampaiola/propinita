import React from 'react'
import dynamic from 'next/dynamic'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getUser } from '../action'
const OnboardingLayout = dynamic(() => import('./components/layout/OnboardingLayout'))

const Layout = async ({ children }: { children: React.ReactNode }) => {

    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
      queryKey: ['user'],
      queryFn: getUser
    })
    const dehydratedState = dehydrate(queryClient)
    return (
        <HydrationBoundary state={dehydratedState}>
            <OnboardingLayout>
                {children}
            </OnboardingLayout>
        </HydrationBoundary>
    )
}

export default Layout