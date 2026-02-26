'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AdminHeader from '@/components/Admin/AdminHeader';
import AddProductModal from '@/components/Admin/AddProductModal';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Settings,
  MoreHorizontal,
  Clock,
  CheckCircle,
  Truck,
  XCircle
} from 'lucide-react';


interface Product {
  _id: string;
  name: string;
  description?: string;
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
  weight?: number;
  dimensions?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  total: number;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'manager' | 'staff' | 'user';
  isActive: boolean;
  registeredAt: string;
  createdAt: string;
  lastLogin?: string;
  emailVerified?: boolean;
  addresses?: Array<{
    _id: string;
    type: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }>;
  totalOrders?: number;
  totalSpent?: number;
}

interface Category {
  _id: string;
  name: string;
  parent?: { _id: string; name: string };
  slug: string;
  level?: number;
  isActive?: boolean;
}

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  featured: boolean;
  likes: number;
  comments: number;
  status: 'draft' | 'published' | 'archived';
}

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: any[];
  topProducts: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [productsList, setProductsList] = useState<any[]>([]); // for overview display
  
  // Products tab state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  
  // Orders tab state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersSearchTerm, setOrdersSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Customers tab state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customersSearchTerm, setCustomersSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('all');
  
  // Categories tab state
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesSearchTerm, setCategoriesSearchTerm] = useState('');
  
  // Blog tab state
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogSearchTerm, setBlogSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<any | null>(null);
  const [viewingBlogPost, setViewingBlogPost] = useState<any | null>(null);
  const [showViewBlogModal, setShowViewBlogModal] = useState(false);
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);
  const [blogImagePreview, setBlogImagePreview] = useState<string>('');
  

  useEffect(() => {
    // Only fetch dashboard data if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      fetchDashboardData();
    } else {
      console.log('No authentication token found, skipping dashboard data fetch');
      // Set loading to false to show the dashboard
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'products' && products.length === 0) {
      fetchProducts();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'orders' && orders.length === 0) {
      fetchOrders();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'customers' && customers.length === 0) {
      fetchCustomers();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'categories' && categories.length === 0) {
      fetchCategories();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'blog' && blogPosts.length === 0) {
      fetchBlogPosts();
    }
  }, [activeTab]);

  // Helper function to resolve image URLs
  const resolveImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return '';
    
    // If it's already a full URL, return as-is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a relative path starting with /uploads, convert to full URL
    if (imagePath.startsWith('/uploads')) {
      return `http://localhost:5000${imagePath}`;
    }
    
    // Otherwise, assume it's a relative path and prepend uploads
    return `http://localhost:5000/uploads${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
  };

  // Helper function to check authentication
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      // Don't show alert here for automatic data fetching, only for user actions
      return null;
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Helper function for user actions that require authentication
  const checkAuthForAction = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication required. Please log in again.');
      return false;
    }
    return true;
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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const headers = getAuthHeaders();
      if (!headers) {
        console.error('Authentication required for dashboard data');
        setLoading(false);
        return;
      }
      
      // Fetch real data from APIs
      const [productsResponse, ordersResponse, usersResponse] = await Promise.all([
        fetch('/api/products?limit=5&page=1', { headers }),
        fetch('/api/orders?limit=5&page=1', { headers }),
        fetch('/api/users?limit=5&page=1', { headers })
      ]);

      const productsData = await productsResponse.json();
      const ordersData = await ordersResponse.json();
      const usersData = await usersResponse.json();

      // Check if any of the requests failed authentication
      if (!productsData.success && productsData.message?.includes('Access denied')) {
        console.error('Authentication failed for products data');
        setLoading(false);
        return;
      }
      if (!ordersData.success && ordersData.message?.includes('Access denied')) {
        console.error('Authentication failed for orders data');
        setLoading(false);
        return;
      }
      if (!usersData.success && usersData.message?.includes('Access denied')) {
        console.error('Authentication failed for users data');
        setLoading(false);
        return;
      }

      // Calculate real statistics
      const totalRevenue = ordersData.orders?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0;
      const totalOrders = ordersData.total || 0;
      const totalUsers = usersData.total || 0;
      const totalProducts = productsData.total || 0;
      
      // Get recent orders (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentOrders = ordersData.orders?.filter((order: any) => 
        new Date(order.createdAt) > sevenDaysAgo
      ).slice(0, 5) || [];

      // Get top products by sales (mock data for now)
      const topProducts = productsData.products?.slice(0, 5).map((product: any) => ({
        id: product._id,
        name: product.name,
        sales: Math.floor(Math.random() * 100) + 20,
        revenue: product.price * (Math.floor(Math.random() * 50) + 10)
      })) || [];

      const stats: DashboardStats = {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        recentOrders,
        topProducts
      };
      
      setStats(stats);
      // keep a small product list for overview
      setProductsList(productsData.products || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Fallback to mock data (but use actual product count)
      const headers = getAuthHeaders();
      const productsResponse = headers ? await fetch('/api/products', { headers }) : null;
      const productsData = productsResponse ? await productsResponse.json() : { success: false, products: [] };
      const actualProductCount = productsData.success ? productsData.products?.length || 0 : 12;
      
      const mockStats: DashboardStats = {
        totalRevenue: 125000,
        totalOrders: 450,
        totalUsers: 1200,
        totalProducts: actualProductCount,
        recentOrders: [
          { id: 'ORD-00000001', customer: 'John Doe', total: 2500, status: 'delivered', date: '2024-01-15' },
          { id: 'ORD-00000002', customer: 'Jane Smith', total: 1800, status: 'processing', date: '2024-01-15' },
          { id: 'ORD-00000003', customer: 'Bob Johnson', total: 3200, status: 'shipped', date: '2024-01-14' },
        ],
        topProducts: [
          { id: '1', name: 'Wireless Headphones', sales: 45, revenue: 22500 },
          { id: '2', name: 'Smart Watch', sales: 32, revenue: 19200 },
          { id: '3', name: 'Laptop Stand', sales: 28, revenue: 8400 },
        ]
      };
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const headers = getAuthHeaders();
      if (!headers) {
        console.error('Authentication required for fetching products');
        setProductsLoading(false);
        return;
      }
      
      const response = await fetch('/api/products', { headers });
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products || []);
      } else {
        console.error('Failed to fetch products:', data.message);
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
      setProductsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const headers = getAuthHeaders();
      if (!headers) {
        console.error('Authentication required for fetching orders');
        setOrdersLoading(false);
        return;
      }
      
      const res = await fetch('/api/orders?limit=50&page=1', { headers });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch orders:', data.message);
      }
      // fall back to mocks if none returned
      if (!data.orders || data.orders.length === 0) {
        const mockOrders: Order[] = [
          {
            _id: '1',
            orderNumber: 'ORD-00000001',
            user: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com'
            },
            total: 2500,
            orderStatus: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'bkash',
            createdAt: '2024-01-15',
            items: [
              { name: 'Wireless Headphones', quantity: 1, price: 2500 }
            ]
          },
          {
            _id: '2',
            orderNumber: 'ORD-00000002',
            user: {
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane@example.com'
            },
            total: 1800,
            orderStatus: 'processing',
            paymentStatus: 'paid',
            paymentMethod: 'cash_on_delivery',
            createdAt: '2024-01-15',
            items: [
              { name: 'Smart Watch', quantity: 1, price: 1800 }
            ]
          },
          {
            _id: '3',
            orderNumber: 'ORD-00000003',
            user: {
              firstName: 'Bob',
              lastName: 'Johnson',
              email: 'bob@example.com'
            },
            total: 3200,
            orderStatus: 'shipped',
            paymentStatus: 'paid',
            paymentMethod: 'card',
            createdAt: '2024-01-14',
            items: [
              { name: 'Laptop Stand', quantity: 2, price: 1600 }
            ]
          }
        ];
        setOrders(mockOrders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      setCustomersLoading(true);
      const headers = getAuthHeaders();
      if (!headers) {
        console.error('Authentication required for fetching customers');
        setCustomersLoading(false);
        return;
      }
      
      const response = await fetch('/api/users', { headers });
      const data = await response.json();
      
      if (data.success) {
        setCustomers(data.users || []);
      } else {
        console.error('Failed to fetch customers:', data.message);
        // Mock data for now
        const mockCustomers: Customer[] = [
          {
            _id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '+880123456789',
            role: 'user',
            isActive: true,
            emailVerified: true,
            addresses: [
              {
                _id: 'addr1',
                type: 'home',
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'USA',
                isDefault: true
              }
            ],
            registeredAt: '2024-01-15',
            createdAt: '2024-01-15',
            lastLogin: '2024-01-20',
            totalOrders: 15,
            totalSpent: 25000
          },
          {
            _id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            phone: '+880123456788',
            role: 'user',
            isActive: true,
            emailVerified: true,
            addresses: [
              {
                _id: 'addr2',
                type: 'home',
                street: '456 Oak Ave',
                city: 'Los Angeles',
                state: 'CA',
                zipCode: '90001',
                country: 'USA',
                isDefault: true
              }
            ],
            registeredAt: '2024-01-10',
            createdAt: '2024-01-10',
            lastLogin: '2024-01-19',
            totalOrders: 8,
            totalSpent: 12000
          },
          {
            _id: '3',
            firstName: 'Bob',
            lastName: 'Johnson',
            email: 'bob@example.com',
            phone: '+880123456787',
            role: 'user',
            isActive: false,
            emailVerified: false,
            addresses: [],
            registeredAt: '2024-01-05',
            createdAt: '2024-01-05',
            totalOrders: 3,
            totalSpent: 4500
          }
        ];
        setCustomers(mockCustomers);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setCustomersLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const headers = getAuthHeaders();
      if (!headers) {
        console.error('Authentication required for fetching categories');
        setCategoriesLoading(false);
        return;
      }
      
      const res = await fetch('/api/categories/flat', { headers });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || data);
      } else {
        console.error('Failed to fetch categories', data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      setBlogLoading(true);
      const headers = getAuthHeaders();
      if (!headers) {
        console.error('Authentication required for fetching blog posts');
        setBlogLoading(false);
        return;
      }
      
      const res = await fetch('/api/blog', { headers });
      const data = await res.json();
      if (data.success) {
        setBlogPosts(data.posts || []);
      } else {
        console.error('Failed to fetch blog posts', data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBlogLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const categoryName = typeof product.category === 'string' ? product.category : product.category?.name || '';
    return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           categoryName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
    setShowViewModal(true);
  };

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

  // Orders helper functions
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(ordersSearchTerm.toLowerCase()) ||
      order.user.firstName.toLowerCase().includes(ordersSearchTerm.toLowerCase()) ||
      order.user.lastName.toLowerCase().includes(ordersSearchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(ordersSearchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, orderStatus: newStatus as any } : order
        ));
      } else {
        console.error('Update failed', data);
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  // Customers helper functions
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.firstName.toLowerCase().includes(customersSearchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(customersSearchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(customersSearchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || customer.role === roleFilter;
    const matchesStatus = customerStatusFilter === 'all' || 
      (customerStatusFilter === 'active' && customer.isActive) ||
      (customerStatusFilter === 'inactive' && !customer.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const toggleCustomerStatus = async (customerId: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${customerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      });

      const data = await response.json();
      if (data.success) {
        setCustomers(customers.map(customer => 
          customer._id === customerId ? { ...customer, isActive } : customer
        ));
        alert(`Customer ${isActive ? 'activated' : 'deactivated'} successfully`);
      } else {
        alert(`Failed to update customer: ${data.message}`);
      }
    } catch (error) {
      console.error('Failed to update customer status:', error);
      alert('Failed to update customer status');
    }
  };

  const deleteCustomer = async (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/users/${customerId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (data.success) {
          setCustomers(customers.filter(customer => customer._id !== customerId));
          alert('Customer deleted successfully');
        } else {
          alert(`Failed to delete customer: ${data.message}`);
        }
      } catch (error) {
        console.error('Failed to delete customer:', error);
        alert('Failed to delete customer');
      }
    }
  };

  // Categories helper functions
  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(categoriesSearchTerm.toLowerCase()));

  const handleAddCategory = async () => {
    const name = prompt('Enter category name');
    if (!name) return;
    const parentId = prompt('Enter parent category ID (leave blank for none)');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, parent: parentId || undefined })
      });
      const data = await res.json();
      if (data.success) {
        fetchCategories();
      } else {
        alert('Failed to add category: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error adding category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchCategories();
      } else {
        alert('Failed to delete category');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting');
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType, trend: TrendIcon, color = "default" }: any) => {
    const colorClasses: Record<string, string> = {
      default: "from-gray-50 to-white border-gray-200",
      green: "from-green-50 to-emerald-50 border-green-200",
      blue: "from-blue-50 to-indigo-50 border-blue-200", 
      purple: "from-purple-50 to-pink-50 border-purple-200",
      orange: "from-orange-50 to-amber-50 border-orange-200"
    };
    
    const iconColors: Record<string, string> = {
      default: "text-gray-600",
      green: "text-green-600",
      blue: "text-blue-600",
      purple: "text-purple-600", 
      orange: "text-orange-600"
    };

    return (
      <Card className={`relative overflow-hidden border-2 bg-gradient-to-br ${colorClasses[color]} hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group`}>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold text-gray-700">{title}</CardTitle>
            {change && (
              <div className="flex items-center gap-1">
                {TrendIcon && <TrendIcon className={`h-3 w-3 ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`} />}
                <p className={`text-xs font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {changeType === 'positive' ? '+' : '-'}{change} from last month
                </p>
              </div>
            )}
          </div>
          <div className={`p-2 rounded-lg bg-white/60 backdrop-blur-sm border ${iconColors[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {value}
          </div>
        </CardContent>
      </Card>
    );
  };

  const handleAddBlogPost = () => {
    setEditingBlogPost(null);
    setBlogImageFile(null);
    setBlogImagePreview('');
    setShowBlogModal(true);
  };

  const handleEditBlogPost = (post: any) => {
    setEditingBlogPost(post);
    setBlogImageFile(null);
    setBlogImagePreview(post.image || '');
    setShowBlogModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewBlogPost = (post: any) => {
    setViewingBlogPost(post);
    setShowViewBlogModal(true);
  };

  const handleDeleteBlogPost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setBlogPosts(blogPosts.filter(post => post._id !== postId));
        alert('Blog post deleted successfully!');
      } else {
        alert('Failed to delete blog post: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Error deleting blog post');
    }
  };

  const handleSaveBlogPost = async (blogData: any) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Add all blog data to FormData, properly handling objects
      Object.keys(blogData).forEach(key => {
        if (key !== 'image') {
          if (typeof blogData[key] === 'object') {
            formData.append(key, JSON.stringify(blogData[key]));
          } else {
            formData.append(key, blogData[key]);
          }
        }
      });
      
      // Add image file if exists
      if (blogImageFile) {
        formData.append('image', blogImageFile);
      } else if (editingBlogPost?.image) {
        formData.append('existingImage', editingBlogPost.image);
      }
      
      const url = editingBlogPost ? `/api/blog/${editingBlogPost._id}` : '/api/blog';
      const method = editingBlogPost ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        if (editingBlogPost) {
          setBlogPosts(blogPosts.map(post => 
            post._id === editingBlogPost._id ? data.post : post
          ));
          alert('Blog post updated successfully!');
        } else {
          setBlogPosts([data.post, ...blogPosts]);
          alert('Blog post created successfully!');
        }
        setShowBlogModal(false);
        setEditingBlogPost(null);
        setBlogImageFile(null);
        setBlogImagePreview('');
      } else {
        alert('Failed to save blog post: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Error saving blog post');
    }
  };

  const editBlogPost = (post: BlogPost) => {
    // TODO: Implement edit blog post functionality
    console.log('Edit blog post:', post);
  };

  const deleteBlogPost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/blog/${postId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        if (data.success) {
          setBlogPosts(blogPosts.filter(p => p._id !== postId));
          alert('Blog post deleted successfully');
        } else {
          alert(`Failed to delete blog post: ${data.message}`);
        }
      } catch (error) {
        console.error('Failed to delete blog post:', error);
        alert('Failed to delete blog post');
      }
    }
  };

  const filteredBlogPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
                         post.category.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(blogSearchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <div 
        className="absolute inset-0 opacity-40" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="relative z-10">
        <AdminHeader 
          title="Admin Dashboard" 
          description="Manage your e-commerce empire" 
        />
      
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-3">
              <Button 
                onClick={() => setIsAddOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm border-2 p-1 rounded-xl shadow-lg">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="customers" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              Customers
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger 
              value="blog" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              Blog
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="dashboard-card-animate">
                <StatCard
                  title="Total Revenue"
                  value={`৳${stats.totalRevenue.toLocaleString()}`}
                  icon={DollarSign}
                  change="12.5%"
                  changeType="positive"
                  trend={TrendingUp}
                  color="green"
                />
              </div>
              <div className="dashboard-card-animate">
                <StatCard
                  title="Total Orders"
                  value={stats.totalOrders}
                  icon={ShoppingCart}
                  change="8.2%"
                  changeType="positive"
                  trend={TrendingUp}
                  color="blue"
                />
              </div>
              <div className="dashboard-card-animate">
                <StatCard
                  title="Total Customers"
                  value={stats.totalUsers}
                  icon={Users}
                  change="15.3%"
                  changeType="positive"
                  trend={TrendingUp}
                  color="purple"
                />
              </div>
              <div className="dashboard-card-animate">
                <StatCard
                  title="Total Products"
                  value={stats.totalProducts}
                  icon={Package}
                  change="5.1%"
                  changeType="positive"
                  trend={TrendingUp}
                  color="orange"
                />
              </div>
            </div>
            {/* preview a few products added recently */}
            {productsList.length > 0 && (
              <div className="dashboard-card-animate">
                <Card className="border-2 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg floating-icon">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-800">Recently Added Products</CardTitle>
                        <CardDescription className="text-gray-600">Top 5 latest additions</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {productsList.map((p, index) => (
                        <div 
                          key={p._id} 
                          className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {index + 1}
                            </div>
                            <span className="font-medium text-gray-800">{p.name}</span>
                          </div>
                          <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                            ৳{p.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="dashboard-card-animate">
                <Card className="border-2 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg floating-icon">
                        <ShoppingCart className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-800">Recent Orders</CardTitle>
                        <CardDescription className="text-gray-600">Latest customer orders</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {stats.recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300">
                          <div>
                            <p className="font-semibold text-gray-800">{order.id}</p>
                            <p className="text-sm text-gray-600">{order.customer}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">৳{order.total}</p>
                            <Badge 
                              variant={order.status === 'delivered' ? 'default' : 'secondary'}
                              className={`${order.status === 'delivered' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Products */}
              <div className="dashboard-card-animate">
                <Card className="border-2 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg floating-icon">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-800">Top Products</CardTitle>
                        <CardDescription className="text-gray-600">Best selling products</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {stats.topProducts.map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all duration-300">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                              index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500' :
                              index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                              index === 2 ? 'bg-gradient-to-br from-orange-400 to-amber-500' :
                              'bg-gradient-to-br from-blue-400 to-indigo-500'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.sales} sold</p>
                            </div>
                          </div>
                          <p className="font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full text-sm">
                            ৳{product.revenue.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
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
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first product'}
                    </p>
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
                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                  {product.thumbnail ? (
                                    <img 
                                      src={getImageUrl(product.thumbnail)} 
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Package className="h-6 w-6 text-gray-400" />
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
                                <Button variant="ghost" size="sm" onClick={() => handleViewProduct(product)}>
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
            
            <AddProductModal
              isOpen={showAddModal}
              onClose={() => { setShowAddModal(false); setEditingProduct(null); }}
              onProductAdded={() => {
                fetchProducts();
                fetchDashboardData(); // Also refresh overview stats
              }}
              existingProduct={editingProduct || undefined}
            />
            
            {/* Product View Modal */}
            <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Product Details</DialogTitle>
                  <DialogDescription>
                    View complete information about this product
                  </DialogDescription>
                </DialogHeader>
                
                {viewingProduct && (
                  <div className="space-y-6">
                    {/* Product Image */}
                    <div className="flex justify-center">
                      <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        {viewingProduct.thumbnail ? (
                          <img 
                            src={getImageUrl(viewingProduct.thumbnail)} 
                            alt={viewingProduct.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{viewingProduct.name}</h3>
                        <p className="text-gray-600">ID: {viewingProduct._id}</p>
                        <p className="text-sm text-gray-500">SKU: {viewingProduct.sku || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">৳{viewingProduct.price.toLocaleString()}</p>
                        {viewingProduct.isOnSale && (
                          <Badge variant="default" className="bg-green-600">
                            {viewingProduct.discountPercentage}% OFF
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Description */}
                    {viewingProduct.description && (
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-gray-600">{viewingProduct.description}</p>
                      </div>
                    )}
                    
                    {/* Product Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium">
                          {typeof viewingProduct.category === 'string' ? viewingProduct.category : viewingProduct.category?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Stock</p>
                        <p className={`font-medium ${viewingProduct.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                          {viewingProduct.stock} units
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <Badge variant={viewingProduct.isActive ? 'default' : 'secondary'}>
                          {viewingProduct.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Featured</p>
                        <Badge variant={viewingProduct.isFeatured ? 'default' : 'outline'}>
                          {viewingProduct.isFeatured ? 'Featured' : 'Regular'}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Additional Details */}
                    {viewingProduct.weight && (
                      <div>
                        <h4 className="font-semibold mb-2">Additional Details</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          {viewingProduct.weight && (
                            <div>
                              <p className="text-gray-500">Weight</p>
                              <p className="font-medium">{viewingProduct.weight} kg</p>
                            </div>
                          )}
                          {viewingProduct.dimensions && (
                            <div>
                              <p className="text-gray-500">Dimensions</p>
                              <p className="font-medium">{viewingProduct.dimensions}</p>
                            </div>
                          )}
                          {viewingProduct.brand && (
                            <div>
                              <p className="text-gray-500">Brand</p>
                              <p className="font-medium">{viewingProduct.brand}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Tags */}
                    {viewingProduct.tags && viewingProduct.tags.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {viewingProduct.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Timestamps */}
                    <div className="text-sm text-gray-500 border-t pt-4">
                      <p>Created: {new Date(viewingProduct.createdAt).toLocaleDateString()}</p>
                      {viewingProduct.updatedAt && (
                        <p>Last Updated: {new Date(viewingProduct.updatedAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowViewModal(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    setShowViewModal(false);
                    setEditingProduct(viewingProduct);
                    setShowAddModal(true);
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Product
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Order List</CardTitle>
                    <CardDescription>
                      {filteredOrders.length} orders found
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search orders..."
                        value={ordersSearchTerm}
                        onChange={(e) => setOrdersSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border rounded-md bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-600">
                      {ordersSearchTerm ? 'Try adjusting your search terms' : 'No orders match your criteria'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Order</th>
                          <th className="text-left p-4">Customer</th>
                          <th className="text-left p-4">Total</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Payment</th>
                          <th className="text-left p-4">Date</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order._id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{order.orderNumber}</p>
                                <p className="text-sm text-gray-600">ID: {order._id}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{order.user.firstName} {order.user.lastName}</p>
                                <p className="text-sm text-gray-600">{order.user.email}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="font-medium">৳{order.total.toLocaleString()}</p>
                            </td>
                            <td className="p-4">
                              <Badge className={getStatusColor(order.orderStatus)}>
                                {getStatusIcon(order.orderStatus)}
                                <span className="ml-1">{order.orderStatus}</span>
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                                {order.paymentStatus}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <select
                                  value={order.orderStatus}
                                  onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                  className="text-xs px-2 py-1 border rounded"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
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
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Customer List</CardTitle>
                    <CardDescription>
                      {filteredCustomers.length} customers found
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search customers..."
                        value={customersSearchTerm}
                        onChange={(e) => setCustomersSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="all">All Roles</option>
                      <option value="user">Users</option>
                      <option value="admin">Admins</option>
                    </select>
                    <select
                      value={customerStatusFilter}
                      onChange={(e) => setCustomerStatusFilter(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {customersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : filteredCustomers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                    <p className="text-gray-600">
                      {customersSearchTerm ? 'Try adjusting your search terms' : 'No customers match your criteria'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Customer</th>
                          <th className="text-left p-4">Contact</th>
                          <th className="text-left p-4">Role</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Orders</th>
                          <th className="text-left p-4">Spent</th>
                          <th className="text-left p-4">Joined</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomers.map((customer) => (
                          <tr key={customer._id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                                <p className="text-sm text-gray-600">ID: {customer._id}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="text-sm">{customer.email}</p>
                                {customer.phone && <p className="text-sm text-gray-600">{customer.phone}</p>}
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant={customer.role === 'admin' ? 'default' : 'outline'}>
                                {customer.role}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Badge variant={customer.isActive ? 'default' : 'secondary'}>
                                  {customer.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                {customer.emailVerified && (
                                  <Badge variant="outline" className="text-xs">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="font-medium">{customer.totalOrders || 0}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-medium">৳{(customer.totalSpent || 0).toLocaleString()}</p>
                            </td>
                            <td className="p-4">
                              <p className="text-sm">{new Date(customer.createdAt).toLocaleDateString()}</p>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => toggleCustomerStatus(customer._id, !customer.isActive)}
                                >
                                  {customer.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteCustomer(customer._id)}
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
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>
                      {filteredCategories.length} categories found
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search categories..."
                      value={categoriesSearchTerm}
                      onChange={(e) => setCategoriesSearchTerm(e.target.value)}
                      className="w-64"
                    />
                    <Button onClick={handleAddCategory}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : filteredCategories.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                    <p className="text-gray-600">
                      {categoriesSearchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first category'}
                    </p>
                    {!categoriesSearchTerm && (
                      <Button onClick={handleAddCategory}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Name</th>
                          <th className="text-left p-4">Slug</th>
                          <th className="text-left p-4">Parent</th>
                          <th className="text-left p-4">Level</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCategories.map((category) => (
                          <tr key={category._id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <p className="font-medium">{category.name}</p>
                              <p className="text-sm text-gray-600">ID: {category._id}</p>
                            </td>
                            <td className="p-4">
                              <p className="text-sm font-mono">{category.slug}</p>
                            </td>
                            <td className="p-4">
                              <p className="text-sm">{category.parent?.name || '-'}</p>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline">
                                Level {category.level || 0}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge variant={category.isActive !== false ? 'default' : 'secondary'}>
                                {category.isActive !== false ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteCategory(category._id)}
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
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Blog Posts</CardTitle>
                    <CardDescription>Manage your blog content and articles</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search blog posts..."
                        value={blogSearchTerm}
                        onChange={(e) => setBlogSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="all">All Categories</option>
                      <option value="technology">Technology</option>
                      <option value="business">Business</option>
                      <option value="lifestyle">Lifestyle</option>
                      <option value="tutorial">Tutorial</option>
                    </select>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="all">All Status</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                    <Button 
                      onClick={handleAddBlogPost}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Post
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {blogLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading blog posts...</p>
                  </div>
                ) : filteredBlogPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No blog posts found</h3>
                    <p className="text-gray-600 mb-6">
                      {blogSearchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' 
                        ? 'Try adjusting your search or filter criteria' 
                        : 'Get started by creating your first blog post'}
                    </p>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Blog Post
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Title</th>
                          <th className="text-left p-4">Category</th>
                          <th className="text-left p-4">Author</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Published</th>
                          <th className="text-left p-4">Stats</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBlogPosts.map((post) => (
                          <tr key={post._id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {post.image && (
                                  <img 
                                    src={resolveImageUrl(post.image)} 
                                    alt={post.title}
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                )}
                                <div>
                                  <div className="font-medium text-gray-900">{post.title}</div>
                                  <div className="text-sm text-gray-600 line-clamp-1">{post.excerpt}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline">{post.category}</Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                {post.author.avatar && (
                                  <img 
                                    src={resolveImageUrl(post.author.avatar)} 
                                    alt={post.author.name}
                                    className="w-6 h-6 rounded-full"
                                  />
                                )}
                                <span className="text-sm">{post.author.name}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge 
                                variant={
                                  post.status === 'published' ? 'default' :
                                  post.status === 'draft' ? 'secondary' : 'outline'
                                }
                              >
                                {post.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="text-sm">
                                <div>{new Date(post.publishedAt).toLocaleDateString()}</div>
                                <div className="text-gray-600">{post.readTime} read</div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-sm">
                                <div className="flex items-center gap-1">
                                  <span className="text-red-500">❤️</span>
                                  <span>{post.likes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-blue-500">💬</span>
                                  <span>{post.comments}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditBlogPost(post)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewBlogPost(post)}
                                >
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteBlogPost(post._id)}
                                >
                                  Delete
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
          </TabsContent>
        </Tabs>
      </div>
      <AddProductModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onProductAdded={() => fetchDashboardData()}
      />

      {/* Blog Post Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingBlogPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowBlogModal(false);
                  setEditingBlogPost(null);
                }}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    defaultValue={editingBlogPost?.title || ''}
                    placeholder="Enter blog post title"
                    id="blog-title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    defaultValue={editingBlogPost?.category || 'technology'}
                    className="w-full px-3 py-2 border rounded-md"
                    id="blog-category"
                  >
                    <option value="technology">Technology</option>
                    <option value="business">Business</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="tutorial">Tutorial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <textarea
                  defaultValue={editingBlogPost?.excerpt || ''}
                  placeholder="Enter blog post excerpt"
                  className="w-full px-3 py-2 border rounded-md h-20"
                  id="blog-excerpt"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  defaultValue={editingBlogPost?.content || ''}
                  placeholder="Enter blog post content"
                  className="w-full px-3 py-2 border rounded-md h-64"
                  id="blog-content"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Featured Image</label>
                  <div className="space-y-2">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {blogImagePreview ? (
                        <div className="space-y-2">
                          <img 
                            src={blogImagePreview} 
                            alt="Preview" 
                            className="w-full h-32 object-cover rounded"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setBlogImageFile(null);
                              setBlogImagePreview('');
                            }}
                          >
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-gray-400 text-4xl">📷</div>
                          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="blog-image-upload"
                          />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById('blog-image-upload')?.click()}
                          >
                            Choose Image
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    defaultValue={editingBlogPost?.status || 'draft'}
                    className="w-full px-3 py-2 border rounded-md"
                    id="blog-status"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <Input
                  defaultValue={editingBlogPost?.tags?.join(', ') || ''}
                  placeholder="Enter tags separated by commas"
                  id="blog-tags"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowBlogModal(false);
                    setEditingBlogPost(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    const blogData = {
                      title: (document.getElementById('blog-title') as HTMLInputElement).value,
                      excerpt: (document.getElementById('blog-excerpt') as HTMLTextAreaElement).value,
                      content: (document.getElementById('blog-content') as HTMLTextAreaElement).value,
                      category: (document.getElementById('blog-category') as HTMLSelectElement).value,
                      status: (document.getElementById('blog-status') as HTMLSelectElement).value,
                      tags: (document.getElementById('blog-tags') as HTMLInputElement).value.split(',').map(tag => tag.trim()),
                      author: {
                        name: 'Admin User',
                        avatar: '/images/admin-avatar.png',
                        bio: 'Blog administrator'
                      },
                      publishedAt: editingBlogPost?.publishedAt || new Date().toISOString(),
                      readTime: '5 min read',
                      featured: editingBlogPost?.featured || false,
                      likes: editingBlogPost?.likes || 0,
                      comments: editingBlogPost?.comments || 0
                    };
                    handleSaveBlogPost(blogData);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {editingBlogPost ? 'Update Post' : 'Create Post'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Blog Post Modal */}
      {showViewBlogModal && viewingBlogPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{viewingBlogPost.title}</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowViewBlogModal(false);
                  setViewingBlogPost(null);
                }}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-6">
              {viewingBlogPost.image && (
                <img 
                  src={resolveImageUrl(viewingBlogPost.image)} 
                  alt={viewingBlogPost.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  {viewingBlogPost.author.avatar && (
                    <img 
                      src={resolveImageUrl(viewingBlogPost.author.avatar)} 
                      alt={viewingBlogPost.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span>{viewingBlogPost.author.name}</span>
                </div>
                <span>•</span>
                <span>{new Date(viewingBlogPost.publishedAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{viewingBlogPost.readTime}</span>
                <span>•</span>
                <Badge variant={viewingBlogPost.status === 'published' ? 'default' : 'secondary'}>
                  {viewingBlogPost.status}
                </Badge>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {viewingBlogPost.excerpt}
                </p>
                <div className="mt-4">
                  {viewingBlogPost.content}
                </div>
              </div>

              <div className="flex items-center gap-6 pt-6 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">❤️</span>
                  <span className="font-medium">{viewingBlogPost.likes} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">💬</span>
                  <span className="font-medium">{viewingBlogPost.comments} comments</span>
                </div>
                <div className="flex gap-2">
                  {viewingBlogPost.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowViewBlogModal(false);
                    handleEditBlogPost(viewingBlogPost);
                  }}
                >
                  Edit Post
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowViewBlogModal(false);
                    setViewingBlogPost(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
