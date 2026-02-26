'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetcher } from '@/lib/api'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetcher('/api/products')
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load products', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      <Link href="/admin/products/new" className="inline-block mb-4 px-4 py-2 bg-shop_dark_green text-white rounded">Create New Product</Link>
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
            {products.map(p => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="border px-2 py-1">{p.name}</td>
                <td className="border px-2 py-1">{p.price}</td>
                <td className="border px-2 py-1">{p.category?.name || p.category}</td>
                <td className="border px-2 py-1">
                  <Link href={`/admin/products/${p._id}`} className="text-blue-600 hover:underline mr-2">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
