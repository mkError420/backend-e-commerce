'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { X, Upload, Image as ImageIcon } from 'lucide-react'

export default function NewProductPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: '',
    shortDescription: '',
    fullDescription: '',
    countInStock: '',
    sku: '',
    brand: '',
    tags: '',
    weight: '',
    dimensions: '',
    color: '',
    size: '',
    material: ''
  })
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages: string[] = []
      Array.from(files).forEach(file => {
        // Create a preview URL for the image
        const imageUrl = URL.createObjectURL(file)
        newImages.push(imageUrl)
      })
      setUploadedImages([...uploadedImages, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index)
    setUploadedImages(newImages)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate required fields
      if (!formData.name || !formData.price || !formData.category || !formData.shortDescription) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      // Create product object
      const newProduct = {
        id: Date.now(), // Use timestamp as temporary ID
        _id: Date.now(), // Also set _id for consistency
        name: formData.name,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        countInStock: parseInt(formData.countInStock),
        sku: formData.sku || `PRD-${Date.now()}`,
        brand: formData.brand,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        weight: formData.weight,
        dimensions: formData.dimensions,
        color: formData.color,
        size: formData.size,
        material: formData.material,
        images: uploadedImages.length > 0 ? uploadedImages : ['/images/products/placeholder.jpg'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Save to localStorage for demo purposes
      const existingProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]')
      const updatedProducts = [...existingProducts, newProduct]
      localStorage.setItem('adminProducts', JSON.stringify(updatedProducts))

      console.log('Product created:', newProduct)
      alert('Product created successfully!')
      router.push('/admin/products')
    } catch (err) {
      console.error('Error creating product:', err)
      setError('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/products" className="text-blue-600 hover:underline flex items-center gap-2">
          ← Back to Products
        </Link>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Create New Product</h1>
          <p className="mt-1 text-sm text-gray-600">Add a new product to your inventory</p>
        </div>
        
        {error && (
          <div className="px-6 py-4 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                placeholder="AUTO-GENERATE"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sale Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">৳</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">৳</span>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                  placeholder="For discount display"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Category and Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Health">Health</option>
                <option value="Gaming">Gaming</option>
                <option value="Photography">Photography</option>
                <option value="Home">Home</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
                <option value="Appliances">Appliances</option>
                <option value="Footwear">Footwear</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                placeholder="e.g., Apple, Nike, Sony"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={3}
                maxLength={200}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                placeholder="Brief description for product listings (max 200 characters)"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.shortDescription.length}/200 characters
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                placeholder="Detailed product description with features, specifications, and benefits"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
            <div className="space-y-4">
              {/* Upload Button */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-shop_dark_green hover:bg-shop_dark_green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shop_dark_green"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Images
                </button>
                <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
              </div>

              {/* Image Preview */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={image}
                          alt={`Product image ৳{index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Attributes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                placeholder="e.g., 1.5 kg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                placeholder="L x W x H (cm)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                placeholder="e.g., Black, Red, Blue"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                placeholder="e.g., S, M, L, XL"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                placeholder="e.g., Cotton, Leather, Plastic"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                placeholder="Comma-separated tags"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin/products"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-shop_dark_green text-white rounded-lg hover:bg-shop_dark_green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
