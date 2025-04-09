import React from 'react'
import Onboarding from './onboarding'
import { getUserRawData } from './action'

const Page = async () => {
  const data = await getUserRawData()
  return <Onboarding userData={data} />
}

export default Page