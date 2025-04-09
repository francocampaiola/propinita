'use client'
import { useRouter } from 'next/navigation'
import HistoryComponent from '../components/history'
import { Flex, Text } from '@chakra-ui/react'
import { IoIosArrowBack } from 'react-icons/io'

const HistoryContainer = () => {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <>
      <Flex alignItems={'center'} gap={1} mb={3} onClick={handleBack} cursor={'pointer'}>
        <IoIosArrowBack size={15} />
        <Text>Volver</Text>
      </Flex>
      <HistoryComponent full />
    </>
  )
}

export default HistoryContainer
