'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, X, Upload, Plus, Minus } from 'lucide-react'
import { productsData } from '@/constants/data'
import { useAuth } from '@/contexts/AuthContext'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  
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

  useEffect(() => {
    const productId = params.id as string
    console.log('Edit page - productId from URL:', productId)
    console.log('productId type:', typeof productId)
    
    if (!productId) return

    // Temporarily bypass auth check for testing
    // TODO: Re-enable auth after testing
    /*
    // Check if user is logged in and is admin
    if (!user) {
      setError('Please login to edit products')
      setLoading(false)
      return
    }

    if (!user.isAdmin) {
      setError('Admin access required')
      setLoading(false)
      return
    }
    */

    try {
      // First try to find in localStorage (admin created products)
      const storedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]')
      console.log('Stored products:', storedProducts)
      console.log('Stored products count:', storedProducts.length)
      
      const product = storedProducts.find((p: any) => {
        const pId = String(p._id || p.id)
        const searchId = String(productId)
        console.log('Comparing:', { pId, searchId, match: pId === searchId })
        return pId === searchId
      })
      console.log('Found product in localStorage:', product)
      
      if (product) {
        // Load admin created product
        console.log('Loading admin product:', product.name)
        setFormData({
          name: product.name || '',
          price: product.price?.toString() || '',
          originalPrice: product.originalPrice?.toString() || '',
          category: product.category || '',
          shortDescription: product.shortDescription || '',
          fullDescription: product.fullDescription || '',
          countInStock: product.countInStock?.toString() || '',
          sku: product.sku || '',
          brand: product.brand || '',
          tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
          weight: product.weight || '',
          dimensions: product.dimensions || '',
          color: product.color || '',
          size: product.size || '',
          material: product.material || ''
        })
        setUploadedImages(product.images || [])
      } else {
        // Try to find in sample data
        console.log('Searching in sample data...')
        console.log('Sample products count:', productsData.length)
        console.log('Sample products IDs:', productsData.map(p => ({ id: p.id, name: p.name })))
        
        const sampleProduct = productsData.find((p: any) => {
          const pId = String(p._id || p.id)
          const searchId = String(productId)
          console.log('Sample comparing:', { pId, searchId, match: pId === searchId })
          return pId === searchId
        })
        console.log('Found sample product:', sampleProduct)
        
        if (sampleProduct) {
          console.log('Loading sample product:', sampleProduct.name)
          setFormData({
            name: sampleProduct.name || '',
            price: sampleProduct.price?.toString() || '',
            originalPrice: sampleProduct.originalPrice?.toString() || '',
            category: sampleProduct.category || '',
            shortDescription: sampleProduct.description || '',
            fullDescription: sampleProduct.description || '',
            countInStock: (sampleProduct as any).countInStock?.toString() || '10',
            sku: (sampleProduct as any).sku || '',
            brand: (sampleProduct as any).brand || '',
            tags: (sampleProduct as any).tags || '',
            weight: (sampleProduct as any).weight || '',
            dimensions: (sampleProduct as any).dimensions || '',
            color: (sampleProduct as any).color || '',
            size: (sampleProduct as any).size || '',
            material: (sampleProduct as any).material || ''
          })
          setUploadedImages(sampleProduct.image ? [sampleProduct.image] : [])
        } else {
          console.log('Product not found in either source')
          setError('Product not found')
        }
      }
    } catch (err) {
      console.error('Error loading product:', err)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }, [params.id, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages: string[] = []
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string)
          if (newImages.length === files.length) {
            setUploadedImages(prev => [...prev, ...newImages])
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const productId = params.id as string
      console.log('=== SUBMIT DEBUG ===')
      console.log('Product ID:', productId)
      console.log('Form data:', formData)
      
      // Temporarily bypass auth check for testing
      // TODO: Re-enable auth after testing
      /*
      // Check if user is logged in and is admin
      if (!user) {
        setError('Please login to update products')
        setSaving(false)
        return
      }

      if (!user.isAdmin) {
        setError('Admin access required')
        setSaving(false)
        return
      }
      */
      
      // Validate required fields
      if (!formData.name || !formData.price || !formData.category) {
        setError('Please fill in all required fields')
        setSaving(false)
        return
      }
      
      // Create updated product object
      const updatedProduct = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.shortDescription,
        countInStock: parseInt(formData.countInStock),
        images: uploadedImages.length > 0 ? uploadedImages : ['/images/products/placeholder.jpg'],
        brand: formData.brand,
        sku: formData.sku,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        weight: formData.weight,
        dimensions: formData.dimensions,
        color: formData.color,
        size: formData.size,
        material: formData.material
      }

      console.log('Updated product object:', updatedProduct)

      // Make API call to update product in database
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      // Temporarily bypass auth for testing
      // TODO: Re-enable auth after testing
      /*
      // Add auth token if user is logged in
      if (user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`
      }
      */

      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedProduct)
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (!response.ok) {
        const responseText = await response.text()
        console.error('Error response:', responseText)
        let errorData
        try {
          errorData = JSON.parse(responseText)
        } catch {
          throw new Error(`Server returned: ${responseText}`)
        }
        throw new Error(errorData.message || 'Failed to update product')
      }

      let result
      try {
        result = await response.json()
        console.log('Product updated in database:', result)
      } catch (parseError) {
        console.error('Error parsing success response:', parseError)
        const responseText = await response.text()
        console.log('Response text:', responseText)
        throw new Error('Invalid response from server')
      }

      // Also update in localStorage for admin products
      const storedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]')
      console.log('Updating localStorage product with ID:', productId)
      
      const productIndex = storedProducts.findIndex((p: any) => {
        const pId = String(p._id || p.id)
        const searchId = String(productId)
        return pId === searchId
      })
      
      if (productIndex !== -1) {
        storedProducts[productIndex] = { ...updatedProduct, _id: productId, id: productId }
        localStorage.setItem('adminProducts', JSON.stringify(storedProducts))
      }

      console.log('Product updated successfully!')
      alert('Product updated successfully!')
      router.push('/admin/products')
    } catch (err: any) {
      console.error('Error updating product:', err)
      setError(err.message || 'Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/admin/products" 
            className="inline-flex items-center px-6 py-3 bg-shop_dark_green text-white rounded-lg hover:bg-shop_dark_green"
          >
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/admin/products" 
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Products
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (৳) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (৳)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    min="0"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home">Home</option>
                    <option value="Sports">Sports</option>
                    <option value="Health">Health</option>
                    <option value="Books">Books</option>
                    <option value="Toys">Toys</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    name="countInStock"
                    required
                    min="0"
                    value={formData.countInStock}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Descriptions</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                  <textarea
                    name="shortDescription"
                    required
                    rows={3}
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                    placeholder="Brief description for product listings"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                  <textarea
                    name="fullDescription"
                    rows={6}
                    value={formData.fullDescription}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                    placeholder="Detailed product description"
                  />
                </div>
              </div>
            </div>

            {/* Product Attributes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Attributes</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                    placeholder="e.g., 500g"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                    placeholder="e.g., 10x5x2 inches"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600">Click to upload images</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </label>
                </div>
              </div>

              {uploadedImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Product image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
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
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/products"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-shop_dark_green text-white rounded-lg hover:bg-shop_dark_green disabled:opacity-50 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
