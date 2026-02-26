'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetcher } from '@/lib/api'
import { productsData } from '@/constants/data'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleRefresh = () => {
    setLoading(true)
    setError(null)
    
    try {
      // Reload from localStorage
      const storedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]')
      
      if (storedProducts.length > 0) {
        setProducts(storedProducts)
      } else {
        setProducts(productsData.slice(0, 8))
      }
      setLoading(false)
    } catch (err) {
      console.error('Error refreshing products:', err)
      setError('Failed to refresh products')
      setProducts(productsData.slice(0, 8))
      setLoading(false)
    }
  }

  const handleDelete = (productId: number | string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      // Check if product is from localStorage (admin created)
      const storedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]')
      const storedProductIndex = storedProducts.findIndex((p: any) => (p._id === productId || p.id === productId))
      
      if (storedProductIndex !== -1) {
        // Remove from localStorage
        const updatedStoredProducts = storedProducts.filter((p: any) => (p._id !== productId && p.id !== productId))
        localStorage.setItem('adminProducts', JSON.stringify(updatedStoredProducts))
        setProducts(updatedStoredProducts)
      } else {
        // Handle sample data deletion (remove from current state)
        const updatedProducts = products.filter((p: any) => (p._id !== productId && p.id !== productId))
        setProducts(updatedProducts)
        
        // Also update localStorage if it contains sample data
        try {
          localStorage.setItem('adminProducts', JSON.stringify(updatedProducts))
        } catch (err) {
          console.error('Failed to update localStorage:', err)
        }
      }
    }
  }

  useEffect(() => {
    setLoading(true)
    setError(null)
    
    try {
      // First try to load from localStorage (newly created products)
      const storedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]')
      
      if (storedProducts.length > 0) {
        setProducts(storedProducts)
        setLoading(false)
        return
      }

      // Fallback to sample data directly (skip API to avoid errors)
      console.log('Loading sample products...')
      setProducts(productsData.slice(0, 8))
      setLoading(false)
      
    } catch (err) {
      console.error('Error loading products:', err)
      setError('Failed to load products')
      // Use sample data as ultimate fallback
      setProducts(productsData.slice(0, 8))
      setLoading(false)
    }
  }, [])

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <div className="flex gap-2">
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Refresh
          </button>
          <Link href="/admin/products/new" className="px-4 py-2 bg-shop_dark_green text-white rounded hover:bg-shop_dark_green">Create New Product</Link>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const productId = p._id || p.id
              console.log('Product in table:', { name: p.name, productId, type: typeof productId })
              return (
              <tr key={`${productId}`} className="hover:bg-gray-50">
                <td className="border px-2 py-1">{p.name}</td>
                <td className="border px-2 py-1">৳{p.price}</td>
                <td className="border px-2 py-1">{p.category?.name || p.category}</td>
                <td className="border px-2 py-1">
                  <Link href={`/admin/products/${productId}`} className="text-blue-600 hover:underline mr-2">Edit</Link>
                  <button 
                    onClick={() => handleDelete(productId)} 
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
