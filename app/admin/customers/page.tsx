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
  Edit, 
  Trash2, 
  Users,
  Mail,
  Phone,
  Calendar,
  Shield,
  X
} from 'lucide-react';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  addresses: Array<{
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }>;
  createdAt: string;
  lastLogin?: string;
  totalOrders?: number;
  totalSpent?: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
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
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'USA',
                isDefault: true
              }
            ],
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
                street: '456 Oak Ave',
                city: 'Los Angeles',
                state: 'CA',
                zipCode: '90001',
                country: 'USA',
                isDefault: true
              }
            ],
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
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || customer.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && customer.isActive) ||
      (statusFilter === 'inactive' && !customer.isActive);
    
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
        title="Customer Management" 
        description="View and manage customer accounts" 
      />
      
      <div className="max-w-7xl mx-auto p-6">
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
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
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                <p className="text-gray-600">
                  {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Customer accounts will appear here when users register'
                  }
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
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {customer.firstName} {customer.lastName}
                              </p>
                              <p className="text-sm text-gray-600">ID: {customer._id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              {customer.email}
                            </div>
                            {customer.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3 text-gray-400" />
                                {customer.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={customer.role === 'admin' ? 'default' : 'secondary'}>
                            {customer.role}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="space-y-2">
                            <Badge variant={customer.isActive ? 'default' : 'secondary'}>
                              {customer.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <div className="flex items-center gap-2 text-xs">
                              {customer.emailVerified && (
                                <Badge variant="outline" className="text-green-600">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-center">
                            <div className="font-medium">{customer.totalOrders || 0}</div>
                            <div className="text-sm text-gray-600">orders</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-center">
                            <div className="font-medium">৳{(customer.totalSpent || 0).toLocaleString()}</div>
                            <div className="text-sm text-gray-600">lifetime</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              {new Date(customer.createdAt).toLocaleDateString()}
                            </div>
                            {customer.lastLogin && (
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <span>Last login:</span>
                                {new Date(customer.lastLogin).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedCustomer(customer)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCustomerStatus(customer._id, !customer.isActive)}
                              className={customer.isActive ? 'text-red-600' : 'text-green-600'}
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

        {/* Customer Details Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Customer Details</CardTitle>
                  <CardDescription>
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="font-medium">{selectedCustomer.email}</p>
                      </div>
                      {selectedCustomer.phone && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Phone</label>
                          <p className="font-medium">{selectedCustomer.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Account Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Role</label>
                        <Badge variant={selectedCustomer.role === 'admin' ? 'default' : 'secondary'}>
                          {selectedCustomer.role}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <Badge variant={selectedCustomer.isActive ? 'default' : 'secondary'}>
                          {selectedCustomer.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email Verified</label>
                        <Badge variant={selectedCustomer.emailVerified ? 'default' : 'secondary'}>
                          {selectedCustomer.emailVerified ? 'Verified' : 'Not Verified'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4">Shipping Addresses</h3>
                    <div className="space-y-3">
                      {selectedCustomer.addresses.map((address, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{address.street}</p>
                              <p>{address.city}, {address.state} {address.zipCode}</p>
                              <p>{address.country}</p>
                            </div>
                            {address.isDefault && (
                              <Badge variant="default">Default</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedCustomer.totalOrders || 0}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">৳{(selectedCustomer.totalSpent || 0).toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600">Customer Since</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
