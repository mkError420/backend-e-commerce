'use client'

import React, { useEffect, useState } from 'react'

// Order type definition
type Order = {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: string;
  date: string;
  items: number;
}

// Sample order data
const sampleOrders: Order[] = [
  {
    id: 'ORD001',
    customer: 'John Doe',
    email: 'john@example.com',
    total: 299.99,
    status: 'pending',
    date: '2024-02-26',
    items: 3
  },
  {
    id: 'ORD002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    total: 149.99,
    status: 'processing',
    date: '2024-02-26',
    items: 2
  },
  {
    id: 'ORD003',
    customer: 'Bob Johnson',
    email: 'bob@example.com',
    total: 599.99,
    status: 'shipped',
    date: '2024-02-25',
    items: 1
  },
  {
    id: 'ORD004',
    customer: 'Alice Brown',
    email: 'alice@example.com',
    total: 89.99,
    status: 'delivered',
    date: '2024-02-25',
    items: 4
  },
  {
    id: 'ORD005',
    customer: 'Charlie Wilson',
    email: 'charlie@example.com',
    total: 199.99,
    status: 'cancelled',
    date: '2024-02-24',
    items: 2
  }
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }

  useEffect(() => {
    setLoading(true)
    
    try {
      // Load orders from localStorage (created by checkout system)
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      
      if (storedOrders.length > 0) {
        console.log('Loading orders from checkout system:', storedOrders.length)
        setOrders(storedOrders)
      } else {
        // Use sample orders if no real orders
        console.log('Using sample orders')
        setOrders(sampleOrders)
      }
      setLoading(false)
    } catch (err) {
      console.error('Error loading orders:', err)
      setError('Failed to load orders')
      setOrders(sampleOrders)
      setLoading(false)
    }
  }, [])

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    setOrders(updatedOrders)
    
    // Save to localStorage
    try {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const updatedAllOrders = allOrders.map((order: any) => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
      localStorage.setItem('orders', JSON.stringify(updatedAllOrders))
    } catch (err) {
      console.error('Failed to save order status:', err)
    }
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Orders</h1>
        <div className="flex gap-2">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ৳{order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status as keyof typeof statusColors]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Processing</h3>
          <p className="text-2xl font-bold text-blue-600">
            {orders.filter(o => o.status === 'processing').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Shipped</h3>
          <p className="text-2xl font-bold text-purple-600">
            {orders.filter(o => o.status === 'shipped').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
          <p className="text-2xl font-bold text-green-600">
            ৳{orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
