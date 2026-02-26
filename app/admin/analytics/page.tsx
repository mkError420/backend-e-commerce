'use client'

import React, { useEffect, useState } from 'react'

// Sample analytics data
const analyticsData = {
  overview: {
    totalRevenue: 45678.90,
    totalOrders: 234,
    totalUsers: 156,
    conversionRate: 3.2
  },
  salesData: [
    { month: 'Jan', revenue: 8900, orders: 45 },
    { month: 'Feb', revenue: 12400, orders: 67 },
    { month: 'Mar', revenue: 15600, orders: 89 },
    { month: 'Apr', revenue: 11200, orders: 56 },
    { month: 'May', revenue: 18900, orders: 98 },
    { month: 'Jun', revenue: 22400, orders: 112 }
  ],
  topProducts: [
    { name: 'Wireless Headphones', sales: 89, revenue: 7999.11 },
    { name: 'Smart Watch Pro', sales: 67, revenue: 13399.33 },
    { name: 'Gaming Keyboard', sales: 45, revenue: 5849.55 },
    { name: 'Yoga Mat', sales: 34, revenue: 1699.66 },
    { name: 'Coffee Maker', sales: 28, revenue: 4199.72 }
  ],
  topCategories: [
    { name: 'Electronics', revenue: 15600, percentage: 34.2 },
    { name: 'Fashion', revenue: 12300, percentage: 26.9 },
    { name: 'Home', revenue: 8900, percentage: 19.5 },
    { name: 'Sports', revenue: 5600, percentage: 12.3 },
    { name: 'Health', revenue: 3278.90, percentage: 7.1 }
  ],
  recentOrders: [
    { id: 'ORD001', customer: 'John Doe', amount: 299.99, status: 'completed', date: '2024-02-26' },
    { id: 'ORD002', customer: 'Jane Smith', amount: 149.99, status: 'processing', date: '2024-02-26' },
    { id: 'ORD003', customer: 'Bob Johnson', amount: 599.99, status: 'shipped', date: '2024-02-25' },
    { id: 'ORD004', customer: 'Alice Brown', amount: 89.99, status: 'completed', date: '2024-02-25' },
    { id: 'ORD005', customer: 'Charlie Wilson', amount: 199.99, status: 'pending', date: '2024-02-24' }
  ]
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(analyticsData)
  const [timeRange, setTimeRange] = useState('6months')
  const [loading, setLoading] = useState(false)

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-shop_dark_green p-3 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <div className="text-2xl font-bold text-gray-900">৳{data.overview.totalRevenue.toLocaleString()}</div>
              <p className="text-sm text-green-600">+12.5% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-600 p-3 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
              <p className="text-2xl font-bold text-gray-900">{data.overview.totalOrders}</p>
              <p className="text-sm text-green-600">+8.2% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-600 p-3 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <p className="text-2xl font-bold text-gray-900">{data.overview.totalUsers}</p>
              <p className="text-sm text-green-600">+15.3% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-orange-600 p-3 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
              <p className="text-2xl font-bold text-gray-900">{data.overview.conversionRate}%</p>
              <p className="text-sm text-green-600">+0.8% from last month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
