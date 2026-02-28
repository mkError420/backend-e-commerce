'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ProductsPage = () => {
  const router = useRouter()

  useEffect(() => {
    // Redirect to shop page as it's the main products listing
    router.replace('/shop')
  }, [router])

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-shop_dark_green mx-auto mb-4'></div>
        <p className='text-gray-600'>Redirecting to shop...</p>
      </div>
    </div>
  )
}

export default ProductsPage
