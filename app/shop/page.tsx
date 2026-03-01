'use client'

import React, { useState, useEffect } from 'react'
import Container from '@/components/Container';
import ShopHeader from '@/components/ShopHeader';
import FilterSidebar from '@/components/FilterSidebar';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { productAPI, Product } from '@/lib/api/products';
import { categoryAPI } from '@/lib/api/categories';

// Local Category interface for shop page
interface ShopCategory {
  id: string;
  name: string;
  count: number;
}

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ShopCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    priceRange: [0, 1000] as [number, number],
    sortBy: 'name',
    search: ''
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [currentPage, filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(filters.category && { category: filters.category }),
        ...(filters.priceRange[0] > 0 && { minPrice: filters.priceRange[0].toString() }),
        ...(filters.priceRange[1] < 1000 && { maxPrice: filters.priceRange[1].toString() }),
        ...(filters.sortBy && { sort: filters.sortBy }),
        ...(filters.search && { search: filters.search })
      })

      const response = await productAPI.getProducts(params.toString())
      setProducts(response.products || [])
      setTotalPages(response.pages || 1)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const apiCategories = await categoryAPI.getCategories()
      // Transform API categories to the format expected by FilterSidebar
      const transformedCategories = apiCategories.map(cat => ({
        id: cat._id,
        name: cat.name,
        count: cat.productCount || 0
      }))
      setCategories(transformedCategories)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading && products.length === 0) {
    return (
      <Container>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Loading products...</p>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <div className="text-center py-16">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchProducts} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <ShopHeader 
          productsCount={products.length}
          onSearch={(search) => handleFilterChange({ ...filters, search })}
        />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <FilterSidebar
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">No products found</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ShopPage
