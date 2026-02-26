'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
  existingProduct?: any; // when provided, modal works in edit mode
}

export default function AddProductModal({ isOpen, onClose, onProductAdded, existingProduct }: AddProductModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [thumbnail, setThumbnail] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    category: '',
    brand: '',
    tags: '',
    isFeatured: false,
    isOnSale: false,
    discountPercentage: '',
    specifications: {} as Record<string, string>
  });
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      
      if (existingProduct) {
        // populate fields for edit
        setFormData({
          name: existingProduct.name || '',
          shortDescription: existingProduct.shortDescription || '',
          description: existingProduct.description || '',
          price: String(existingProduct.price || ''),
          originalPrice: String(existingProduct.originalPrice || ''),
          stock: String(existingProduct.stock || ''),
          category: existingProduct.category?._id || existingProduct.category || '',
          brand: existingProduct.brand || '',
          tags: (existingProduct.tags || []).join(','),
          isFeatured: existingProduct.isFeatured || false,
          isOnSale: existingProduct.isOnSale || false,
          discountPercentage: String(existingProduct.discountPercentage || ''),
          specifications: existingProduct.specifications || {}
        });
        // Set existing images
        setThumbnail(existingProduct.thumbnail || '');
        setImages(existingProduct.images?.map((img: any) => img.url) || []);
      } else {
        setFormData({
          name: '',
          shortDescription: '',
          description: '',
          price: '',
          originalPrice: '',
          stock: '',
          category: '',
          brand: '',
          tags: '',
          isFeatured: false,
          isOnSale: false,
          discountPercentage: '',
          specifications: {}
        });
        setThumbnail('');
        setImages([]);
      }
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    };
  }, [isOpen, existingProduct]);

  const handleImageUpload = async (files: FileList, isThumbnail: boolean = false) => {
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required');
        setUploading(false);
        return;
      }

      console.log('Starting upload...', { files: files.length, isThumbnail });
      
      const formData = new FormData();
      const endpoint = isThumbnail ? '/api/upload-simple/image' : '/api/upload-simple/images';
      
      if (isThumbnail) {
        formData.append('image', files[0]);
        console.log('Uploading thumbnail:', files[0].name, files[0].size);
      } else {
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i]);
          console.log(`Uploading image ${i + 1}:`, files[i].name, files[i].size);
        }
      }

      console.log('Sending request to:', endpoint);
      console.log('Full URL:', `${window.location.origin}${endpoint}`);
      console.log('Token exists:', !!token);
      console.log('Token length:', token?.length);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        if (isThumbnail) {
          // Use relative URL that will be proxied
          const fullUrl = data.data.url.startsWith('http') 
            ? data.data.url 
            : `${window.location.origin}${data.data.url}`;
          setThumbnail(fullUrl);
          console.log('Thumbnail set:', fullUrl);
        } else {
          const fullUrls = data.data.map((img: any) => 
            img.url.startsWith('http') ? img.url : `${window.location.origin}${img.url}`
          );
          setImages(prev => [...prev, ...fullUrls]);
          console.log('Gallery images set:', fullUrls);
        }
        alert(`Successfully uploaded ${isThumbnail ? 'thumbnail' : 'gallery images'}`);
      } else {
        console.error('Upload failed:', data);
        alert(`Failed to upload images: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please check your internet connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files, true);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files, false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeThumbnail = () => {
    setThumbnail('');
  };

  // Helper function to get correct image URL
  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) {
      return `${window.location.origin}${url}`;
    }
    // Handle mock data image paths
    if (url.startsWith('/images/products/')) {
      return url; // Use as-is for mock data
    }
    return url;
  };

  // Test function to verify upload endpoint
  const testUploadEndpoint = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token for test');
        return;
      }

      console.log('Testing upload endpoint...');
      const response = await fetch('/api/upload-simple/test', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Test response:', response.status);
      const data = await response.json();
      console.log('Test data:', data);
    } catch (error) {
      console.error('Test error:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories || data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to add products');
        setLoading(false);
        return;
      }

      // Validate required fields
      if (!formData.name || !formData.price || !formData.stock || !formData.category || !formData.description) {
        alert('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // prepare product data
      const productData = {
        name: formData.name,
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        thumbnail: thumbnail || '/images/products/placeholder.png',
        images: images.length > 0 ? images.map(url => ({ url, public_id: url.split('/').pop() || '' })) : [{
          url: '/images/products/placeholder.png',
          public_id: 'products/placeholder'
        }],
        isActive: true, // Ensure product is active and appears on shop page
        ...(formData.originalPrice && { originalPrice: parseFloat(formData.originalPrice) }),
        ...(formData.brand && { brand: formData.brand }),
        ...(formData.tags && { tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) }),
        isFeatured: formData.isFeatured,
        ...(formData.isOnSale && { isOnSale: formData.isOnSale }),
        ...(formData.discountPercentage && { discountPercentage: parseFloat(formData.discountPercentage) }),
        ...(Object.keys(formData.specifications).length > 0 && { specifications: formData.specifications })
      };

      console.log('Product data:', JSON.stringify(productData, null, 2));

      const url = existingProduct ? `/api/products/${existingProduct._id}` : '/api/products';
      const method = existingProduct ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));

      if (data.success) {
        alert(existingProduct ? 'Product updated successfully!' : 'Product saved successfully!');
        onProductAdded();
        onClose();
        // Reset form handled by effect when closing
      } else {
        console.error('Product creation failed:', data);
        alert(`Failed to save product: ${data.message}${data.error ? ' - ' + data.error : ''}`);
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add product. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const addSpecification = () => {
    if (specKey && specValue) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey]: specValue
        }
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return {
        ...prev,
        specifications: newSpecs
      };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 pt-8">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto dashboard-scrollbar">
        <Card className="w-full bg-white border-2 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">
                  {existingProduct ? 'Edit Product' : 'Add New Product'}
                </CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-white hover:bg-white/20 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload Section */}
              <div className="bg-gray-50 rounded-lg p-4 border">
                <Label className="text-base font-semibold mb-3 block">Product Images</Label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Thumbnail Upload */}
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Thumbnail *
                    </Label>
                    <div className="flex justify-center">
                      {thumbnail ? (
                        <div className="relative group">
                          <div className="w-24 h-24 border-2 border-blue-200 rounded-lg overflow-hidden">
                            <img src={getImageUrl(thumbnail)} alt="Thumbnail" className="w-full h-full object-cover" />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={removeThumbnail}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div 
                          className="w-24 h-24 border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-6 w-6 text-blue-400 mb-1" />
                          <p className="text-xs text-blue-600">Upload</p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Gallery Images */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Gallery Images</Label>
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 gap-1">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="w-14 h-14 border border-gray-200 rounded overflow-hidden">
                              <img src={getImageUrl(image)} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-0 right-0 h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-2 w-2" />
                            </Button>
                          </div>
                        ))}
                        <div 
                          className="w-14 h-14 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-blue-500"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.multiple = true;
                            input.onchange = (e) => handleGalleryUpload(e as any);
                            input.click();
                          }}
                        >
                          <Plus className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-white rounded-lg border p-4">
                <Label className="text-base font-semibold mb-3 block">Basic Information</Label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Product Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      placeholder="Enter brand name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description</Label>
                    <Textarea
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                      rows={2}
                      placeholder="Brief product description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Full Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                      required
                      placeholder="Detailed product description"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing and Inventory */}
              <div className="bg-gray-50 rounded-lg p-4 border">
                <Label className="text-base font-semibold mb-3 block">Pricing & Inventory</Label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Price *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      required
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock" className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Stock *
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                      required
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Category *
                    </Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Settings & Tags */}
              <div className="bg-white rounded-lg border p-4">
                <Label className="text-base font-semibold mb-3 block">Settings & Tags</Label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="isFeatured">Featured Product</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isOnSale"
                        checked={formData.isOnSale}
                        onChange={(e) => setFormData(prev => ({ ...prev, isOnSale: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="isOnSale">On Sale</Label>
                    </div>
                    {formData.isOnSale && (
                      <div className="space-y-2">
                        <Label htmlFor="discountPercentage">Discount %</Label>
                        <Input
                          id="discountPercentage"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.discountPercentage}
                          onChange={(e) => setFormData(prev => ({ ...prev, discountPercentage: e.target.value }))}
                          placeholder="0"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="electronics, wireless, bluetooth"
                    />
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-gray-50 rounded-lg p-4 border">
                <Label className="text-base font-semibold mb-3 block">Specifications</Label>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                    <Input
                      placeholder="Key (e.g., Weight)"
                      value={specKey}
                      onChange={(e) => setSpecKey(e.target.value)}
                    />
                    <Input
                      placeholder="Value (e.g., 250g)"
                      value={specValue}
                      onChange={(e) => setSpecValue(e.target.value)}
                    />
                    <Button type="button" onClick={addSpecification} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(formData.specifications).map(([key, value]: [string, string]) => (
                      <Badge key={key} variant="secondary" className="flex items-center gap-1">
                        {key}: {value}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSpecification(key)}
                          className="h-4 w-4 p-0 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {existingProduct ? 'Updating...' : 'Adding...'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      {existingProduct ? 'Update Product' : 'Add Product'}
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
