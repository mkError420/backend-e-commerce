'use client'

import React, { useState } from 'react'
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  count: number
  subcategories?: {
    id: string
    name: string
    count: number
  }[]
}

interface FilterSidebarProps {
  categories: Category[]
  filters: {
    category: string
    subcategory: string
    priceRange: [number, number]
    sortBy: string
    search: string
  }
  onFilterChange: (filters: any) => void
}

const FilterSidebar = ({
  categories,
  filters,
  onFilterChange
}: FilterSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['categories', 'price'])
  
  // Convert array priceRange to object format for local state
  const [localPriceRange, setLocalPriceRange] = useState({
    min: filters.priceRange[0],
    max: filters.priceRange[1]
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const clearAllFilters = () => {
    onFilterChange({
      category: '',
      priceRange: [0, 1000],
      sortBy: 'name',
      search: ''
    })
    setLocalPriceRange({ min: 0, max: 1000 })
  }

  const applyPriceRange = () => {
    onFilterChange({
      ...filters,
      priceRange: [localPriceRange.min, localPriceRange.max]
    })
  }

  const handlePriceChange = (field: 'min' | 'max', value: number) => {
    setLocalPriceRange((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection('categories')}
        >
          <h4 className="font-medium text-gray-900">Categories</h4>
          {expandedSections.includes('categories') ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
        
        {expandedSections.includes('categories') && (
          <div className="space-y-1">
            {categories.map((category) => (
              <div key={category.id} className="space-y-1">
                {/* Main Category */}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.category === category.id}
                    onChange={(e) => {
                      onFilterChange({
                        ...filters,
                        category: e.target.checked ? category.id : '',
                        subcategory: ''
                      })
                    }}
                    className="rounded text-shop_dark_green focus:ring-shop_dark_green"
                  />
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  <span className="text-xs text-gray-500">({category.count})</span>
                </label>
                
                {/* Subcategories */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="ml-6 space-y-1">
                    {category.subcategories.map((subcategory) => (
                      <label key={subcategory.id} className="flex items-center space-x-2 cursor-pointer ml-6">
                        <input
                          type="checkbox"
                          checked={filters.subcategory === subcategory.id}
                          onChange={(e) => {
                            onFilterChange({
                              ...filters,
                              category: category.id,
                              subcategory: e.target.checked ? subcategory.id : ''
                            })
                          }}
                          className="rounded text-shop_dark_green focus:ring-shop_dark_green"
                        />
                        <span className="text-sm text-gray-700">{subcategory.name}</span>
                        <span className="text-xs text-gray-500">({subcategory.count})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => toggleSection('price')}
        >
          <h4 className="font-medium text-gray-900">Price Range</h4>
          {expandedSections.includes('price') ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
        
        {expandedSections.includes('price') && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-600 mb-2 block">Min Price</label>
                <input
                  type="number"
                  placeholder="0"
                  value={localPriceRange.min}
                  onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600 mb-2 block">Max Price</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={localPriceRange.max}
                  onChange={(e) => handlePriceChange('max', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Current Range: ${localPriceRange.min} - ${localPriceRange.max}</span>
              </div>
            </div>

            <button
              onClick={applyPriceRange}
              className="w-full bg-shop_dark_green text-white py-3 rounded-lg font-medium hover:bg-shop_dark_green/80 transition-colors duration-300"
            >
              Apply Price Range
            </button>
          </div>
        )}
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
        >
          <option value="name">Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </div>
  )
}

export default FilterSidebar
