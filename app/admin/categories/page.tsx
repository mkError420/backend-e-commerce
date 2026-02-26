'use client'

import React, { useEffect, useState } from 'react'

// Sample category data
const sampleCategories = [
  {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets',
    productCount: 45,
    image: '/images/categories/electronics.jpg'
  },
  {
    id: 2,
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing and accessories',
    productCount: 32,
    image: '/images/categories/fashion.jpg'
  },
  {
    id: 3,
    name: 'Health',
    slug: 'health',
    description: 'Health and beauty products',
    productCount: 18,
    image: '/images/categories/health.jpg'
  },
  {
    id: 4,
    name: 'Gaming',
    slug: 'gaming',
    description: 'Gaming consoles and accessories',
    productCount: 24,
    image: '/images/categories/gaming.jpg'
  },
  {
    id: 5,
    name: 'Home',
    slug: 'home',
    description: 'Home and kitchen appliances',
    productCount: 28,
    image: '/images/categories/home.jpg'
  },
  {
    id: 6,
    name: 'Sports',
    slug: 'sports',
    description: 'Sports and fitness equipment',
    productCount: 15,
    image: '/images/categories/sports.jpg'
  }
]

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(sampleCategories)
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ))
    } else {
      // Add new category
      const newCategory = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        ...formData,
        productCount: 0
      }
      setCategories([...categories, newCategory])
    }
    
    // Reset form
    setFormData({ name: '', slug: '', description: '', image: '' })
    setEditingCategory(null)
    setShowAddForm(false)
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image
    })
    setShowAddForm(true)
  }

  const handleDelete = (categoryId: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId))
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', slug: '', description: '', image: '' })
    setEditingCategory(null)
    setShowAddForm(false)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-shop_dark_green text-white rounded hover:bg-shop_dark_green"
        >
          Add New Category
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full border rounded px-3 py-2"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-shop_dark_green text-white rounded hover:bg-shop_dark_green"
              >
                {editingCategory ? 'Update' : 'Create'} Category
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.slug}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {category.productCount} products
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Categories</h3>
          <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
          <p className="text-2xl font-bold text-shop_dark_green">
            {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Avg Products/Category</h3>
          <p className="text-2xl font-bold text-blue-600">
            {Math.round(categories.reduce((sum, cat) => sum + cat.productCount, 0) / categories.length)}
          </p>
        </div>
      </div>
    </div>
  )
}
