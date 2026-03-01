'use client'

import React, { useState, useEffect } from 'react'
import Container from '@/components/Container'
import { categoryAPI, Category } from '@/lib/api/categories'
import { 
  Smartphone, 
  Laptop, 
  Shirt, 
  Home, 
  Book, 
  Heart, 
  Gamepad2, 
  Camera,
  Baby,
  Car,
  Dumbbell,
  Music,
  Plane,
  ShoppingBag,
  Watch,
  Utensils,
  Palette,
  Dog,
  Wrench,
  Coffee,
  Tv,
  Headphones,
  Package,
  Grid3X3,
  List
} from 'lucide-react'
import Link from 'next/link'

// Icon mapping for categories
const getIconForCategory = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('electronic') || name.includes('phone') || name.includes('smartphone')) return Smartphone;
  if (name.includes('computer') || name.includes('laptop')) return Laptop;
  if (name.includes('fashion') || name.includes('clothing') || name.includes('shirt')) return Shirt;
  if (name.includes('home') || name.includes('living')) return Home;
  if (name.includes('book')) return Book;
  if (name.includes('health') || name.includes('beauty')) return Heart;
  if (name.includes('game') || name.includes('gaming')) return Gamepad2;
  if (name.includes('camera') || name.includes('photo')) return Camera;
  if (name.includes('baby') || name.includes('kid')) return Baby;
  if (name.includes('car') || name.includes('auto')) return Car;
  if (name.includes('sport') || name.includes('fitness')) return Dumbbell;
  if (name.includes('music') || name.includes('audio')) return Music;
  if (name.includes('travel')) return Plane;
  if (name.includes('shop') || name.includes('bag')) return ShoppingBag;
  if (name.includes('watch') || name.includes('jewelry')) return Watch;
  if (name.includes('kitchen') || name.includes('food')) return Utensils;
  if (name.includes('art') || name.includes('craft')) return Palette;
  if (name.includes('pet') || name.includes('dog')) return Dog;
  if (name.includes('tool') || name.includes('wrench')) return Wrench;
  if (name.includes('coffee') || name.includes('drink')) return Coffee;
  if (name.includes('tv') || name.includes('television')) return Tv;
  if (name.includes('headphone')) return Headphones;
  return Package; // Default icon
}

// Color schemes for categories
const getColorScheme = (index: number) => {
  const schemes = [
    { card: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200', icon: 'bg-blue-100 text-blue-600' },
    { card: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200', icon: 'bg-green-100 text-green-600' },
    { card: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200', icon: 'bg-purple-100 text-purple-600' },
    { card: 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200', icon: 'bg-orange-100 text-orange-600' },
    { card: 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200', icon: 'bg-cyan-100 text-cyan-600' },
    { card: 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200', icon: 'bg-yellow-100 text-yellow-600' },
  ];
  return schemes[index % schemes.length];
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiCategories = await categoryAPI.getCategories()
        const transformedCategories = categoryAPI.transformToCategoriesPageFormat(apiCategories)
        setCategories(transformedCategories)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        setError('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading categories...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
            <p className="text-gray-600">Browse our wide range of product categories</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Grid/List */}
        {categories.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No categories available</p>
            <p className="text-gray-500 mt-2">Categories will appear here once they are added by the administrator.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }>
            {categories.map((category: Category, index: number) => {
              const Icon = getIconForCategory(category.name)
              const colorScheme = getColorScheme(index)
              
              if (viewMode === 'grid') {
                return (
                  <Link
                    key={category._id}
                    href={`/shop?category=${category._id}`}
                    className={`block p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${colorScheme.card}`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorScheme.icon}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{category.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {category.productCount} products
                      </span>
                      <span className="text-blue-600 text-sm font-medium hover:text-blue-800">
                        Browse →
                      </span>
                    </div>
                  </Link>
                )
              } else {
                return (
                  <Link
                    key={category._id}
                    href={`/shop?category=${category._id}`}
                    className={`flex items-center p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${colorScheme.card}`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${colorScheme.icon}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">
                        {category.productCount} products
                      </div>
                      <span className="text-blue-600 text-sm font-medium">
                        Browse →
                      </span>
                    </div>
                  </Link>
                )
              }
            })}
          </div>
        )}

        {/* Admin Note */}
        <div className="mt-12 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Admin:</strong> Categories are managed dynamically through the admin dashboard. 
            Any changes made in the Categories Management section will be reflected here automatically.
          </p>
        </div>
      </div>
    </Container>
  )
}

export default CategoriesPage
