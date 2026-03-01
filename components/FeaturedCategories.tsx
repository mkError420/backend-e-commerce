'use client'

import React, { useState, useEffect } from 'react'
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
  Package
} from 'lucide-react'
import Link from 'next/link'
import { categoryAPI, Category } from '@/lib/api/categories'

// Icon mapping for categories - same as categories page
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
    'bg-blue-100 text-blue-600 hover:bg-blue-200',
    'bg-purple-100 text-purple-600 hover:bg-purple-200',
    'bg-pink-100 text-pink-600 hover:bg-pink-200',
    'bg-green-100 text-green-600 hover:bg-green-200',
    'bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
    'bg-red-100 text-red-600 hover:bg-red-200',
    'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
    'bg-teal-100 text-teal-600 hover:bg-teal-200',
    'bg-orange-100 text-orange-600 hover:bg-orange-200',
    'bg-cyan-100 text-cyan-600 hover:bg-cyan-200',
  ];
  return schemes[index % schemes.length];
}

const FeaturedCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiCategories = await categoryAPI.getCategories()
        const transformedCategories = categoryAPI.transformToCategoriesPageFormat(apiCategories)
        // Show only first 8 categories for featured section
        setCategories(transformedCategories.slice(0, 8))
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        // Keep empty if failed - don't show hardcoded categories
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className='py-8 sm:py-12 md:py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8'>
          <div className='text-center mb-8 sm:mb-10 md:mb-12'>
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4'>
              Shop by <span className='text-shop_dark_green'>Category</span>
            </h2>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6'>
            {[...Array(8)].map((_, index) => (
              <div key={index} className='bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 text-center shadow-sm border border-gray-100'>
                <div className='inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gray-100 mb-3 sm:mb-4'>
                  <div className='w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-300 rounded animate-pulse'></div>
                </div>
                <div className='h-4 sm:h-5 bg-gray-300 rounded animate-pulse mb-2'></div>
                <div className='h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-16 mx-auto'></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='py-8 sm:py-12 md:py-16 bg-white'>
      <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-8 sm:mb-10 md:mb-12'>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4'>
            Shop by <span className='text-shop_dark_green'>Category</span>
          </h2>
          <p className='text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4'>
            Browse our wide selection of products across different categories
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className='text-center py-12'>
            <Package className='w-16 h-16 mx-auto text-gray-400 mb-4' />
            <p className='text-gray-600 text-lg mb-2'>No categories available</p>
            <p className='text-gray-500 text-sm mb-6'>Categories will appear here once they are added by the administrator.</p>
            <Link
              href='/categories'
              className='inline-flex items-center gap-2 bg-shop_btn_dark_green text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg text-sm sm:text-base'
            >
              View All Categories
              <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
              </svg>
            </Link>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6'>
              {categories.map((category: Category, index: number) => {
                const Icon = getIconForCategory(category.name)
                const color = getColorScheme(index)
                
                return (
                  <Link
                    key={category._id}
                    href={`/shop?category=${category._id}`}
                    className='group'
                  >
                    <div className='bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 hoverEffect transform hover:-translate-y-2 border border-gray-100'>
                      <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl ${color} mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className='w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8' />
                      </div>
                      <h3 className='text-sm sm:text-base md:text-lg font-semibold text-gray-900 group-hover:text-shop_dark_green transition-colors duration-300'>
                        {category.name}
                      </h3>
                      <div className='mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500'>
                        {category.productCount} products →
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* View All Button */}
            <div className='text-center mt-8 sm:mt-10 md:mt-12'>
              <Link
                href='/categories'
                className='inline-flex items-center gap-2 bg-shop_btn_dark_green text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg hoverEffect text-sm sm:text-base'
              >
                View All Categories
                <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default FeaturedCategories
