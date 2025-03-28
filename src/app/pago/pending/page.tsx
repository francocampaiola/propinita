'use client'

import Link from 'next/link'

export default function PendingPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow text-center'>
        <div className='text-yellow-500 text-6xl mb-4'>⏳</div>
        <h2 className='text-3xl font-bold text-gray-900'>Pago Pendiente</h2>
        <p className='text-gray-600'>
          Tu pago está siendo procesado. Te notificaremos cuando se complete.
        </p>
        <div className='mt-8'>
          <Link
            href='/'
            className='inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700'
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
