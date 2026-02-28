'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Container from '@/components/Container';
import ShopHeader from '@/components/ShopHeader';
import FilterSidebar from '@/components/FilterSidebar';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { productAPI, Product } from '@/lib/api/products';
import { categoryAPI, Category } from '@/lib/api/categories';

// Categories and deal types for filters
const defaultCategories = [
  { 
    id: 'electronics', 
    name: 'Electronics', 
    count: 206,
    subcategories: [
      { id: 'smartphones', name: 'Smartphones', count: 85 },
      { id: 'laptops', name: 'Laptops', count: 45 },
      { id: 'tablets', name: 'Tablets', count: 32 },
      { id: 'accessories', name: 'Accessories', count: 44 }
    ]
  },
  { 
    id: 'computers', 
    name: 'Computers', 
    count: 89,
    subcategories: [
      { id: 'desktops', name: 'Desktops', count: 35 },
      { id: 'monitors', name: 'Monitors', count: 28 },
      { id: 'components', name: 'Components', count: 26 }
    ]
  },
  { 
    id: 'fashion', 
    name: 'Fashion', 
    count: 156,
    subcategories: [
      { id: 'mens-clothing', name: "Men's Clothing", count: 78 },
      { id: 'womens-clothing', name: "Women's Clothing", count: 92 },
      { id: 'shoes', name: 'Shoes', count: 45 }
    ]
  },
  { 
    id: 'home', 
    name: 'Home & Living', 
    count: 134,
    subcategories: [
      { id: 'furniture', name: 'Furniture', count: 67 },
      { id: 'decor', name: 'Home Decor', count: 43 },
      { id: 'kitchen', name: 'Kitchen', count: 24 }
    ]
  },
  { 
    id: 'books', 
    name: 'Books', 
    count: 89,
    subcategories: [
      { id: 'fiction', name: 'Fiction', count: 34 },
      { id: 'non-fiction', name: 'Non-Fiction', count: 29 },
      { id: 'educational', name: 'Educational', count: 26 }
    ]
  },
  { 
    id: 'health', 
    name: 'Health & Beauty', 
    count: 167,
    subcategories: [
      { id: 'skincare', name: 'Skincare', count: 58 },
      { id: 'makeup', name: 'Makeup', count: 47 },
      { id: 'wellness', name: 'Wellness', count: 62 }
    ]
  },
  { 
    id: 'gaming', 
    name: 'Gaming', 
    count: 145,
    subcategories: [
      { id: 'consoles', name: 'Gaming Consoles', count: 38 },
      { id: 'games', name: 'Video Games', count: 67 },
      { id: 'accessories', name: 'Gaming Accessories', count: 40 }
    ]
  },
  { 
    id: 'photography', 
    name: 'Photography', 
    count: 78,
    subcategories: [
      { id: 'cameras', name: 'Cameras', count: 32 },
      { id: 'lenses', name: 'Lenses', count: 18 },
      { id: 'accessories', name: 'Photography Accessories', count: 28 }
    ]
  },
  { 
    id: 'sports', 
    name: 'Sports & Outdoors', 
    count: 198,
    subcategories: [
      { id: 'fitness', name: 'Fitness', count: 67 },
      { id: 'outdoor', name: 'Outdoor Gear', count: 89 },
      { id: 'sports', name: 'Sports Equipment', count: 42 }
    ]
  },
  { 
    id: 'toys', 
    name: 'Toys & Games', 
    count: 123,
    subcategories: [
      { id: 'toys', name: 'Toys', count: 68 },
      { id: 'games', name: 'Games', count: 55 }
    ]
  },
  { 
    id: 'baby', 
    name: 'Baby & Kids', 
    count: 156,
    subcategories: [
      { id: 'baby-clothing', name: 'Baby Clothing', count: 78 },
      { id: 'toys', name: 'Kids Toys', count: 45 },
      { id: 'furniture', name: 'Kids Furniture', count: 33 }
    ]
  },
  { 
    id: 'automotive', 
    name: 'Automotive', 
    count: 89,
    subcategories: [
      { id: 'parts', name: 'Auto Parts', count: 45 },
      { id: 'accessories', name: 'Car Accessories', count: 44 }
    ]
  },
  { 
    id: 'music', 
    name: 'Music & Audio', 
    count: 134,
    subcategories: [
      { id: 'headphones', name: 'Headphones', count: 58 },
      { id: 'speakers', name: 'Speakers', count: 42 },
      { id: 'instruments', name: 'Musical Instruments', count: 34 }
    ]
  },
  { 
    id: 'travel', 
    name: 'Travel', 
    count: 112,
    subcategories: [
      { id: 'luggage', name: 'Luggage', count: 56 },
      { id: 'accessories', name: 'Travel Accessories', count: 56 }
    ]
  },
  { 
    id: 'jewelry', 
    name: 'Jewelry & Watches', 
    count: 145,
    subcategories: [
      { id: 'watches', name: 'Watches', count: 67 },
      { id: 'jewelry', name: 'Jewelry', count: 78 }
    ]
  },
  { 
    id: 'food', 
    name: 'Food & Beverages', 
    count: 98,
    subcategories: [
      { id: 'snacks', name: 'Snacks', count: 45 },
      { id: 'beverages', name: 'Beverages', count: 53 }
    ]
  },
  { 
    id: 'art', 
    name: 'Art & Crafts', 
    count: 67,
    subcategories: [
      { id: 'art-supplies', name: 'Art Supplies', count: 34 },
      { id: 'crafts', name: 'Crafts', count: 33 }
    ]
  },
  { 
    id: 'pets', 
    name: 'Pet Supplies', 
    count: 89,
    subcategories: [
      { id: 'dog', name: 'Dog Supplies', count: 45 },
      { id: 'cat', name: 'Cat Supplies', count: 44 }
    ]
  },
  { 
    id: 'tools', 
    name: 'Tools & Hardware', 
    count: 123,
    subcategories: [
      { id: 'power-tools', name: 'Power Tools', count: 56 },
      { id: 'hand-tools', name: 'Hand Tools', count: 67 }
    ]
  },
  { 
    id: 'kitchen', 
    name: 'Kitchen & Dining', 
    count: 145,
    subcategories: [
      { id: 'cookware', name: 'Cookware', count: 67 },
      { id: 'dinnerware', name: 'Dinnerware', count: 78 }
    ]
  },
  { 
    id: 'tv', 
    name: 'TV & Home Theater', 
    count: 89,
    subcategories: [
      { id: 'tvs', name: 'TVs', count: 45 },
      { id: 'audio', name: 'Audio Systems', count: 44 }
    ]
  },
  { 
    id: 'audio', 
    name: 'Audio & Headphones', 
    count: 112,
    subcategories: [
      { id: 'headphones', name: 'Headphones', count: 67 },
      { id: 'speakers', name: 'Speakers', count: 45 }
    ]
  },
  { 
    id: 'office', 
    name: 'Office Supplies', 
    count: 78,
    subcategories: [
      { id: 'desk-supplies', name: 'Desk Supplies', count: 45 },
      { id: 'furniture', name: 'Office Furniture', count: 33 }
    ]
  },
  { 
    id: 'gifts', 
    name: 'Gifts & Occasions', 
    count: 89,
    subcategories: [
      { id: 'gifts', name: 'Gifts', count: 56 },
      { id: 'occasions', name: 'Occasions', count: 33 }
    ]
  },
  { 
    id: 'books', 
    name: 'Books', 
    count: 67,
    subcategories: [
      { id: 'fiction', name: 'Fiction', count: 25 },
      { id: 'non-fiction', name: 'Non-Fiction', count: 22 },
      { id: 'educational', name: 'Educational', count: 20 }
    ]
  },
  { 
    id: 'health', 
    name: 'Health', 
    count: 63,
    subcategories: [
      { id: 'supplements', name: 'Supplements', count: 28 },
      { id: 'fitness', name: 'Fitness Equipment', count: 20 },
      { id: 'personal-care', name: 'Personal Care', count: 15 }
    ]
  },
  { 
    id: 'sports', 
    name: 'Sports', 
    count: 45,
    subcategories: [
      { id: 'outdoor', name: 'Outdoor Sports', count: 20 },
      { id: 'indoor', name: 'Indoor Sports', count: 15 },
      { id: 'fitness', name: 'Fitness', count: 10 }
    ]
  },
  { 
    id: 'toys', 
    name: 'Toys & Games', 
    count: 78,
    subcategories: [
      { id: 'educational-toys', name: 'Educational Toys', count: 30 },
      { id: 'board-games', name: 'Board Games', count: 25 },
      { id: 'action-figures', name: 'Action Figures', count: 23 }
    ]
  },
  { 
    id: 'gaming', 
    name: 'Gaming', 
    count: 52,
    subcategories: [
      { id: 'consoles', name: 'Gaming Consoles', count: 18 },
      { id: 'video-games', name: 'Video Games', count: 22 },
      { id: 'accessories', name: 'Gaming Accessories', count: 12 }
    ]
  },
  { 
    id: 'photography', 
    name: 'Photography', 
    count: 29,
    subcategories: [
      { id: 'cameras', name: 'Cameras', count: 15 },
      { id: 'lenses', name: 'Lenses', count: 8 },
      { id: 'accessories', name: 'Photography Accessories', count: 6 }
    ]
  }
]

const dealTypes = [
  { name: 'Lightning Deal', slug: 'lightning', icon: '🌩' },
  { name: 'Daily Deal', slug: 'daily', icon: '📅' }
]

// Sample product data - in a real app, this would come from an API
const sampleProducts = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones Premium',
    price: 89.99,
    originalPrice: 149.99,
    image: '/api/placeholder/300/300',
    rating: 4.5,
    reviews: 128,
    badge: 'Best Seller',
    category: 'Electronics',
    size: 'M',
    description: 'Premium wireless headphones with noise cancellation and superior sound quality.'
  },
  {
    id: 2,
    name: 'Smart Watch Pro Series 5',
    price: 199.99,
    originalPrice: 299.99,
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 89,
    badge: 'New',
    category: 'Electronics',
    size: 'M',
    description: 'Advanced fitness tracking and health monitoring in a sleek design.'
  },
  {
    id: 3,
    name: 'Premium Leather Jacket Classic',
    price: 149.99,
    originalPrice: 249.99,
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 56,
    badge: 'Limited',
    category: 'Fashion',
    size: 'L',
    description: 'Genuine leather jacket with timeless style and exceptional craftsmanship.'
  },
  {
    id: 4,
    name: 'Organic Skincare Set Complete',
    price: 59.99,
    originalPrice: 119.99,
    image: '/api/placeholder/300/300',
    rating: 4.9,
    reviews: 278,
    badge: 'Eco',
    category: 'Health & Beauty',
    size: 'S',
    description: 'Complete organic skincare routine for radiant skin.'
  },
  {
    id: 5,
    name: 'Yoga Mat Premium Non-Slip',
    price: 49.99,
    originalPrice: 79.99,
    image: '/api/placeholder/300/300',
    rating: 4.5,
    reviews: 89,
    badge: 'Popular',
    category: 'Sports & Outdoors',
    size: 'S',
    description: 'Extra thick yoga mat with superior grip and cushioning.'
  },
  {
    id: 6,
    name: 'Smart Home Security Camera',
    price: 159.99,
    originalPrice: 249.99,
    image: '/api/placeholder/300/300',
    rating: 4.6,
    reviews: 156,
    badge: 'Smart',
    category: 'Electronics',
    size: 'M',
    description: 'HD security camera with night vision and mobile app control.'
  },
  {
    id: 7,
    name: 'Kids Educational Building Blocks',
    price: 34.99,
    originalPrice: 54.99,
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 234,
    badge: 'Toys',
    category: 'Toys & Games',
    size: 'S',
    description: 'Creative building blocks that enhance problem-solving skills.'
  },
  {
    id: 8,
    name: 'Stainless Steel Water Bottle',
    price: 24.99,
    originalPrice: 39.99,
    image: '/api/placeholder/300/300',
    rating: 4.3,
    reviews: 67,
    badge: 'Eco',
    category: 'Sports & Outdoors',
    size: 'S',
    description: 'Insulated water bottle that keeps drinks cold for 24 hours.'
  },
  {
    id: 9,
    name: 'Professional Camera Lens Kit',
    price: 299.99,
    originalPrice: 449.99,
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 145,
    badge: 'Pro',
    category: 'Photography',
    size: 'M',
    description: 'Professional lens kit for photography enthusiasts.'
  },
  {
    id: 10,
    name: 'Gaming Laptop Pro',
    price: 1299.99,
    originalPrice: 1599.99,
    image: '/api/placeholder/300/300',
    rating: 4.6,
    reviews: 89,
    badge: 'Gaming',
    category: 'Computers',
    size: 'M',
    description: 'High-performance gaming laptop with dedicated graphics card.'
  },
  {
    id: 11,
    name: 'Smart Home Security Camera',
    price: 159.99,
    originalPrice: 249.99,
    image: '/api/placeholder/300/300',
    rating: 4.6,
    reviews: 156,
    badge: 'Smart',
    category: 'Electronics',
    size: 'M',
    description: 'HD security camera with night vision and mobile app control.'
  },
  {
    id: 12,
    name: 'Kids Educational Building Blocks',
    price: 34.99,
    originalPrice: 54.99,
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 234,
    badge: 'Toys',
    category: 'Toys',
    size: 'S',
    description: 'Creative building blocks that enhance problem-solving skills.'
  }
]

// Hero carousel data
const heroSlides = [
  {
    id: 1,
    title: 'Summer Sale Collection',
    subtitle: 'Up to 50% off on selected items',
    description: 'Discover amazing deals on your favorite products this summer',
    image: '/api/placeholder/1920/600',
    ctaText: 'Shop Now',
    ctaLink: '/shop?category=fashion',
    backgroundColor: 'bg-gradient-to-r from-shop_dark_green to-shop_light_green'
  },
  {
    id: 2,
    title: 'Tech Innovation Week',
    subtitle: 'Latest gadgets and electronics',
    description: 'Explore cutting-edge technology with exclusive discounts',
    image: '/api/placeholder/1920/600',
    ctaText: 'Explore Tech',
    ctaLink: '/shop?category=electronics',
    backgroundColor: 'bg-gradient-to-r from-shop_orange to-shop_light_green'
  },
  {
    id: 3,
    title: 'Home Essentials',
    subtitle: 'Transform your living space',
    description: 'Premium home and living products at unbeatable prices',
    image: '/api/placeholder/1920/600',
    ctaText: 'Discover More',
    ctaLink: '/shop?category=home',
    backgroundColor: 'bg-gradient-to-r from-shop_dark_green to-shop_orange'
  },
  {
    id: 4,
    title: 'Sports & Fitness',
    subtitle: 'Gear up for your active lifestyle',
    description: 'Professional sports equipment and fitness accessories',
    image: '/api/placeholder/1920/600',
    ctaText: 'Get Active',
    ctaLink: '/shop?category=sports',
    backgroundColor: 'bg-gradient-to-r from-shop_light_green to-shop_orange'
  }
]

const ShopPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState(defaultCategories)

  // Fetch categories from API to sync with admin categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiCategories = await categoryAPI.getCategories()
        const transformedCategories = categoryAPI.transformToShopFormat(apiCategories)
        setCategories(transformedCategories)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        // Keep default categories if API fails
      }
    }
    
    fetchCategories()
    
    // Set up periodic refresh to sync with admin changes
    const interval = setInterval(fetchCategories, 30000) // Refresh every 30 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all'])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all products without pagination for proper filtering
        const params: any = {
          pageNumber: 1,
        }
        
        if (searchTerm) {
          params.keyword = searchTerm
        }
        
        // Remove category filtering from API call - do it client-side instead
        
        const response = await productAPI.getProducts(params)
        setProducts(response.products || [])
        // Don't set totalPages here since we're doing client-side pagination
      } catch (err: any) {
        setError('Failed to load products')
        console.error('Error fetching products:', err)
        console.error('Error details:', err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, []) // Remove dependencies since we're using sample products

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = sampleProducts.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Category filter - match by category name
      const matchesCategory = selectedCategories.includes('all') || 
        selectedCategories.some(cat => product.category === cat)
      
      return matchesSearch && matchesCategory
    })

    // Sort products
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price)
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price)
      case 'name-asc':
        return filtered.sort((a, b) => a.name.localeCompare(b.name))
      case 'name-desc':
        return filtered.sort((a, b) => b.name.localeCompare(a.name))
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating)
      default:
        // featured - keep original order
        return filtered
    }
  }, [sampleProducts, searchTerm, selectedCategories, sortBy])

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Manual carousel controls
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Pagination
  const totalProducts = filteredAndSortedProducts.length
  const totalPages = Math.ceil(totalProducts / itemsPerPage)
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='min-h-screen bg-shop_light_bg'>
      {/* Hero Carousel Section */}
      <div className='relative h-80 sm:h-96 md:h-[500px] overflow-hidden'>
        {/* Carousel Slides */}
        <div className='relative h-full'>
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className={`h-full ${slide.backgroundColor}`}>
                <div className='container mx-auto px-4 sm:px-6 h-full flex items-center'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center h-full w-full'>
                    {/* Left Content - Hidden on Mobile */}
                    <div className='hidden md:block text-white space-y-3 sm:space-y-4 md:space-y-6 text-center md:text-left'>
                      <h1 className='text-2xl sm:text-3xl md:text-5xl font-bold leading-tight'>
                        {slide.title}
                      </h1>
                      <p className='text-base sm:text-lg md:text-xl font-medium opacity-90'>
                        {slide.subtitle}
                      </p>
                      <p className='text-xs sm:text-sm md:text-base opacity-80 max-w-xs sm:max-w-md md:max-w-lg'>
                        {slide.description}
                      </p>
                      <Link
                        href={slide.ctaLink}
                        className='inline-flex items-center bg-white text-gray-900 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:shadow-lg text-sm sm:text-base cursor-pointer'
                      >
                        {slide.ctaText}
                      </Link>
                    </div>

                    {/* Right Content - Image on All Screens */}
                    <div className='relative h-48 sm:h-56 md:h-80 lg:h-96 w-full'>
                      <div className='w-full h-full bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-white/20'>
                        <div className='w-full h-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center'>
                          <div className='text-white/80 text-center'>
                            <div className='w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 bg-white/20 rounded-xl mx-auto mb-2 sm:mb-4'></div>
                            <p className='text-xs sm:text-sm md:text-base'>Hero Image</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile CTA Button - Centered Below Image */}
                    <div className='block md:hidden text-center mt-4'>
                      <Link
                        href={slide.ctaLink}
                        className='inline-flex items-center bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:shadow-lg cursor-pointer'
                      >
                        {slide.ctaText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className='absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2 z-10'>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-6 sm:w-8'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Shop Header */}
      <ShopHeader
        totalProducts={filteredAndSortedProducts.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      <Container className='py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar */}
          <aside className='lg:w-80 flex-shrink-0'>
            <FilterSidebar
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              categories={categories}
              dealTypes={dealTypes}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedDealType="all"
              setSelectedDealType={() => {}}
              sortBy={sortBy}
              setSortBy={setSortBy}
              selectedRatings={[]}
              setSelectedRatings={() => {}}
              selectedSizes={[]}
              setSelectedSizes={() => {}}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </aside>

          {/* Main Content */}
          <main className='flex-1'>
            {/* Loading State */}
            {loading && (
              <div className='text-center py-16'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-shop_dark_green mx-auto mb-4'></div>
                <p className='text-gray-600'>Loading products...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className='text-center py-16'>
                <div className='text-red-500 text-6xl mb-4'>⚠️</div>
                <h3 className='text-xl font-semibold text-red-600 mb-2'>Error Loading Products</h3>
                <p className='text-gray-600 mb-6'>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className='bg-shop_dark_green text-white px-6 py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg hoverEffect'
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Products Grid/List */}
            {!loading && !error && currentProducts.length > 0 ? (
              <>
                <div className={`
                  grid gap-6
                  ${viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                  }
                `}>
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={filteredAndSortedProducts.length}
                    itemsPerPage={itemsPerPage}
                  />
                )}
              </>
            ) : !loading && !error && (
              <div className='text-center py-16'>
                <div className='text-shop_dark_green text-6xl mb-4'>🔍</div>
                <h3 className='text-xl font-semibold text-shop_light_green mb-2'>
                  No products found
                </h3>
                <p className='text-shop_dark_green mb-6'>
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setCurrentPage(1)
                    setSelectedCategories(['all'])
                    setSelectedRatings([])
                    setSelectedSizes([])
                    setPriceRange({ min: 0, max: 1000 })
                    setSortBy('featured')
                  }}
                  className='bg-shop_dark_green text-white px-6 py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg hoverEffect'
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </Container>
    </div>
  )
}

export default ShopPage;



