import React from 'react'
import Link from 'next/link'
import { 
  Package, 
  ShoppingCart, 
  FolderOpen, 
  FileText, 
  Users, 
  BarChart3,
  TrendingUp,
  DollarSign,
  UserPlus
} from 'lucide-react'

export default function AdminPage() {
  const stats = [
    {
      name: 'Total Revenue',
      value: '৳45,678',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign
    },
    {
      name: 'Total Orders',
      value: '234',
      change: '+8.2%',
      changeType: 'positive',
      icon: ShoppingCart
    },
    {
      name: 'Total Users',
      value: '156',
      change: '+15.3%',
      changeType: 'positive',
      icon: Users
    },
    {
      name: 'Conversion Rate',
      value: '3.2%',
      change: '+0.8%',
      changeType: 'positive',
      icon: TrendingUp
    }
  ]

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'Create a new product listing',
      href: '/admin/products/new',
      icon: Package,
      color: 'bg-shop_dark_green'
    },
    {
      title: 'View Orders',
      description: 'Manage customer orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      color: 'bg-blue-600'
    },
    {
      title: 'Manage Categories',
      description: 'Organize product categories',
      href: '/admin/categories',
      icon: FolderOpen,
      color: 'bg-purple-600'
    },
    {
      title: 'Write Blog Post',
      description: 'Create new blog content',
      href: '/admin/blogs',
      icon: FileText,
      color: 'bg-orange-600'
    }
  ]

  const recentActivity = [
    { id: 1, action: 'New order received', details: 'Order #ORD001 - John Doe', time: '2 minutes ago', type: 'order' },
    { id: 2, action: 'New user registered', details: 'Jane Smith joined', time: '15 minutes ago', type: 'user' },
    { id: 3, action: 'Product updated', details: 'Wireless Headphones price changed', time: '1 hour ago', type: 'product' },
    { id: 4, action: 'Blog published', details: 'Top 10 Gadgets for 2024', time: '2 hours ago', type: 'blog' },
    { id: 5, action: 'Category created', details: 'New category: Sports Equipment', time: '3 hours ago', type: 'category' }
  ]

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                href={action.href}
                className="relative block bg-white p-6 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className={`${action.color} rounded-lg p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900">{action.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{action.description}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white shadow rounded-lg">
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.details}</p>
                    </div>
                    <div className="text-xs text-gray-400">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Preview */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics Overview</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sales this month</span>
                <span className="text-sm font-semibold text-gray-900">৳22,400</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-shop_dark_green h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New customers</span>
                <span className="text-sm font-semibold text-gray-900">45</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Blog engagement</span>
                <span className="text-sm font-semibold text-gray-900">89%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>
            
            <Link 
              href="/admin/analytics" 
              className="mt-4 inline-flex items-center text-sm font-medium text-shop_dark_green hover:text-shop_dark_green"
            >
              View full analytics
              <BarChart3 className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}