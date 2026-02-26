'use client'

import React, { useEffect, useState } from 'react'

// Sample user data
const sampleUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    status: 'active',
    joinedAt: '2024-01-15',
    lastLogin: '2024-02-26',
    orders: 5,
    totalSpent: 1299.99,
    avatar: '/images/avatars/john.jpg'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'customer',
    status: 'active',
    joinedAt: '2024-01-20',
    lastLogin: '2024-02-25',
    orders: 3,
    totalSpent: 599.99,
    avatar: '/images/avatars/jane.jpg'
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-01-01',
    lastLogin: '2024-02-26',
    orders: 0,
    totalSpent: 0,
    avatar: '/images/avatars/admin.jpg'
  },
  {
    id: 4,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'customer',
    status: 'inactive',
    joinedAt: '2024-02-01',
    lastLogin: '2024-02-10',
    orders: 1,
    totalSpent: 89.99,
    avatar: '/images/avatars/bob.jpg'
  },
  {
    id: 5,
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'customer',
    status: 'active',
    joinedAt: '2024-02-05',
    lastLogin: '2024-02-24',
    orders: 2,
    totalSpent: 299.99,
    avatar: '/images/avatars/alice.jpg'
  },
  {
    id: 6,
    name: 'Moderator User',
    email: 'moderator@example.com',
    role: 'moderator',
    status: 'active',
    joinedAt: '2024-01-10',
    lastLogin: '2024-02-26',
    orders: 0,
    totalSpent: 0,
    avatar: '/images/avatars/moderator.jpg'
  }
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState(sampleUsers)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    suspended: 'bg-yellow-100 text-yellow-800'
  }

  const roleColors = {
    admin: 'bg-purple-100 text-purple-800',
    moderator: 'bg-blue-100 text-blue-800',
    customer: 'bg-gray-100 text-gray-800'
  }

  const updateUserStatus = (userId: number, newStatus: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ))
  }

  const updateUserRole = (userId: number, newRole: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ))
  }

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.status === filter || user.role === filter
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="admin">Admins</option>
            <option value="moderator">Moderators</option>
            <option value="customer">Customers</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[user.role as keyof typeof roleColors]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[user.status as keyof typeof statusColors]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${user.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>{user.joinedAt}</div>
                      <div className="text-xs">Last: {user.lastLogin}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col gap-1">
                      <select 
                        value={user.status}
                        onChange={(e) => updateUserStatus(user.id, e.target.value)}
                        className="border rounded px-2 py-1 text-xs"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                      <select 
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="border rounded px-2 py-1 text-xs"
                      >
                        <option value="customer">Customer</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
          <p className="text-2xl font-bold text-green-600">
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Admins</h3>
          <p className="text-2xl font-bold text-purple-600">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-600">
            {users.reduce((sum, u) => sum + u.orders, 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-shop_dark_green">
            ${users.reduce((sum, u) => sum + u.totalSpent, 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
