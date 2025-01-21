'use client'
import React from 'react'
import dynamic from 'next/dynamic'

const Onboarding = dynamic(() => import('./onboarding'), {
  ssr: false,
  loading: () => <>Cargando..</>
})

const page = () => {
  return <Onboarding />
}

export default page