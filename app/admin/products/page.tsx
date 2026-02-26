'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AdminHeader from '@/components/Admin/AdminHeader';
import AddProductModal from '@/components/Admin/AddProductModal';
import Pagination from '@/components/Pagination';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  MoreHorizontal,
  Package
} from 'lucide-react';

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

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  brand?: string;
  isActive: boolean;
  isFeatured: boolean;
  isOnSale?: boolean;
  discountPercentage?: number;
  thumbnail: string;
  images?: Array<{ url: string; public_id: string }>;
  ratings?: {
    average: number;
    count: number;
  };
  sku: string;
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(8); // Set to 8 products per page

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products?page=${currentPage}&limit=${itemsPerPage}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products || []);
        // Calculate total pages based on response
        const totalProducts = data.total || data.products?.length || 0;
        const calculatedTotalPages = Math.ceil(totalProducts / itemsPerPage);
        setTotalPages(calculatedTotalPages);
      } else {
        console.error('Failed to fetch products:', data.message);
        // Mock data for now
        const mockProducts: Product[] = [
          {
            _id: '1',
            name: 'Wireless Headphones',
            price: 89.99,
            stock: 50,
            category: { _id: 'cat1', name: 'Electronics', slug: 'electronics' },
            isActive: true,
            isFeatured: true,
            thumbnail: '/images/products/product_1.png',
            sku: 'WH-001',
            createdAt: '2024-01-15'
          }
        ];
        setProducts(mockProducts);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Set mock data on error
      const mockProducts: Product[] = [
        {
          _id: '1',
          name: 'Wireless Headphones',
          price: 89.99,
          stock: 50,
          category: { _id: 'cat1', name: 'Electronics', slug: 'electronics' },
          isActive: true,
          isFeatured: true,
          thumbnail: '/images/products/product_1.png',
          sku: 'WH-001',
          createdAt: '2024-01-15'
        }
      ];
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const categoryName = typeof product.category === 'string' ? product.category : product.category?.name || '';
    return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           categoryName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        if (data.success) {
          setProducts(products.filter(p => p._id !== productId));
          alert('Product deleted successfully');
        } else {
          alert(`Failed to delete product: ${data.message}`);
        }
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleToggleStatus = async (productId: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      });
      
      const data = await response.json();
      if (data.success) {
        setProducts(products.map(p => 
          p._id === productId ? { ...p, isActive } : p
        ));
      } else {
        alert(`Failed to update product: ${data.message}`);
      }
    } catch (error) {
      console.error('Failed to update product status:', error);
      alert('Failed to update product status');
    }
  };

  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        title="Products" 
        description="Manage your product inventory" 
      />
      
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Product List</CardTitle>
                <CardDescription>
                  {filteredProducts.length} products found
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button onClick={() => { setEditingProduct(null); setShowAddModal(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
                <Button 
                  variant="outline" 
                  onClick={async () => {
                    console.log('Test add product');
                    const token = localStorage.getItem('token');
                    if (!token) {
                      alert('No token found');
                      return;
                    }
                    
                    const testData = {
                      name: 'Test Product ' + Date.now(),
                      description: 'Test description',
                      price: 99.99,
                      category: '699e72220c91790e1a137f42', // First category ID
                      stock: 10,
                      brand: 'Test Brand',
                      tags: 'test,demo',
                      thumbnail: '/images/products/placeholder.png',
                      images: [{
                        url: '/images/products/placeholder.png',
                        public_id: 'products/placeholder'
                      }]
                    };
                    
                    try {
                      const response = await fetch('/api/products', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(testData)
                      });
                      
                      const data = await response.json();
                      console.log('Test response:', data);
                      if (data.success) {
                        alert('Test product added successfully!');
                        fetchProducts();
                      } else {
                        alert(`Failed: ${data.message}`);
                      }
                    } catch (error) {
                      console.error('Test error:', error);
                      alert('Test failed');
                    }
                  }}
                >
                  Test Add
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first product'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Product</th>
                      <th className="text-left p-4">Category</th>
                      <th className="text-left p-4">Price</th>
                      <th className="text-left p-4">Stock</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Featured</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                              {product.thumbnail ? (
                                <img 
                                  src={getImageUrl(product.thumbnail)} 
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback to placeholder on error
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerHTML = `
                                      <div class="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                        <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                        </svg>
                                      </div>
                                    `;
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-600">ID: {product._id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">
                            {typeof product.category === 'string' ? product.category : product.category?.name}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <p className="font-medium">৳{product.price.toLocaleString()}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${
                              product.stock < 10 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {product.stock}
                            </span>
                            {product.stock < 10 && (
                              <Badge variant="destructive" className="text-xs">
                                Low Stock
                              </Badge>
                            )}
                            {product.isOnSale && (
                              <Badge variant="default" className="text-xs bg-green-600">
                                {product.discountPercentage}% OFF
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(product._id, !product.isActive)}
                          >
                            <Badge variant={product.isActive ? 'default' : 'secondary'}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </Button>
                        </td>
                        <td className="p-4">
                          <Badge variant={product.isFeatured ? 'default' : 'outline'}>
                            {product.isFeatured ? 'Featured' : 'Regular'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => {
                              setEditingProduct(product);
                              setShowAddModal(true);
                            }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(product._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Pagination Component */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={products.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
        
        <AddProductModal
          isOpen={showAddModal}
          onClose={() => { setShowAddModal(false); setEditingProduct(null); }}
          onProductAdded={fetchProducts}
          existingProduct={editingProduct || undefined}
        />
      </div>
    </div>
  );
}
