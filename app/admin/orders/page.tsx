'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AdminHeader from '@/components/Admin/AdminHeader';
import { 
  Search, 
  Filter, 
  Eye, 
  Truck,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  ShoppingCart
} from 'lucide-react';

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders?limit=50&page=1');
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
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
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
        title="Orders" 
        description="Manage customer orders and fulfillment" 
      />
      
      <div className="max-w-7xl mx-auto p-6">
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Orders will appear here when customers make purchases'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Order</th>
                      <th className="text-left p-4">Customer</th>
                      <th className="text-left p-4">Items</th>
                      <th className="text-left p-4">Total</th>
                      <th className="text-left p-4">Payment</th>
                      <th className="text-left p-4">Status</th>
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
                            <p className="font-medium">
                              {order.user.firstName} {order.user.lastName}
                            </p>
                            <p className="text-sm text-gray-600">{order.user.email}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{order.items.length} items</p>
                            <p className="text-sm text-gray-600">
                              {order.items[0]?.name}
                              {order.items.length > 1 && ` +${order.items.length - 1} more`}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-medium">৳{order.total.toLocaleString()}</p>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                              {order.paymentStatus}
                            </Badge>
                            <p className="text-xs text-gray-600">{order.paymentMethod}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(order.orderStatus)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(order.orderStatus)}
                              {order.orderStatus}
                            </div>
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
                            {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                              <select
                                value={order.orderStatus}
                                onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                className="text-sm border rounded px-2 py-1"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            )}
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
      </div>
    </div>
  );
}
