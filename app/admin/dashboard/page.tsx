"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../layout";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    lowStockProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [dashboardProducts, setDashboardProducts] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange, currentPage]);

  const fetchDashboardData = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch real products with pagination
      const productsResponse = await fetch(`http://localhost:5001/api/products?pageNumber=${currentPage}&limit=${itemsPerPage}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      const productsData = await productsResponse.json();
      
      // Mock data for other dashboard items - in production, fetch from actual APIs
      const mockData = {
        stats: {
          totalProducts: 156,
          totalOrders: 1247,
          totalUsers: 892,
          totalRevenue: 45789.50,
          pendingOrders: 23,
          completedOrders: 1189,
          lowStockProducts: 8,
        },
        recentOrders: [
          {
            _id: "order001",
            user: { name: "John Doe" },
            totalPrice: 299.99,
            status: "pending",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            items: 3
          },
          {
            _id: "order002",
            user: { name: "Jane Smith" },
            totalPrice: 599.99,
            status: "processing",
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            items: 5
          },
          {
            _id: "order003",
            user: { name: "Bob Johnson" },
            totalPrice: 149.99,
            status: "shipped",
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            items: 2
          },
          {
            _id: "order004",
            user: { name: "Alice Brown" },
            totalPrice: 899.99,
            status: "delivered",
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            items: 4
          },
          {
            _id: "order005",
            user: { name: "Charlie Wilson" },
            totalPrice: 399.99,
            status: "processing",
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            items: 3
          },
        ],
        topProducts: [
          { _id: "prod001", name: "Laptop Pro", sales: 89, revenue: 88911 },
          { _id: "prod002", name: "Smartphone X", sales: 156, revenue: 109195 },
          { _id: "prod003", name: "Wireless Headphones", sales: 234, revenue: 46785 },
          { _id: "prod004", name: "T-Shirt Premium", sales: 412, revenue: 12348 },
          { _id: "prod005", name: "JavaScript Guide", sales: 78, revenue: 3119 },
        ],
        salesData: [
          { date: "Mon", sales: 2456 },
          { date: "Tue", sales: 3124 },
          { date: "Wed", sales: 2890 },
          { date: "Thu", sales: 3678 },
          { date: "Fri", sales: 4234 },
          { date: "Sat", sales: 3890 },
          { date: "Sun", sales: 3456 },
        ]
      };

      setStats(mockData.stats);
      setRecentOrders(mockData.recentOrders);
      setTopProducts(mockData.topProducts);
      setSalesData(mockData.salesData);
      
      // Set real products with pagination
      setDashboardProducts(productsData.products || []);
      setTotalPages(productsData.pages || 1);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5001/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <div className="flex space-x-2">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              📊 Export Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-blue-100 text-sm mt-1">+12.5% from last month</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <span className="text-3xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold mt-2">{stats.totalOrders.toLocaleString()}</p>
                <p className="text-green-100 text-sm mt-1">{stats.pendingOrders} pending</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <span className="text-3xl">🛒</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold mt-2">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-purple-100 text-sm mt-1">+8.2% growth</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <span className="text-3xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Products</p>
                <p className="text-3xl font-bold mt-2">{stats.totalProducts.toLocaleString()}</p>
                <p className="text-orange-100 text-sm mt-1">{stats.lowStockProducts} low stock</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <span className="text-3xl">📦</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {salesData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${(item.sales / Math.max(...salesData.map(d => d.sales))) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">{item.date}</span>
                  <span className="text-xs font-medium">${item.sales}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a href="/admin/products" className="block w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center font-medium">
                ➕ Add New Product
              </a>
              <a href="/admin/orders" className="block w-full px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-center font-medium">
                📦 View All Orders
              </a>
              <a href="/admin/users" className="block w-full px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-center font-medium">
                👥 Manage Users
              </a>
              <button className="w-full px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors font-medium">
                📊 Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Recent Orders and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white shadow rounded-xl overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div>
                          <div className="font-medium text-gray-900">#{order._id.slice(-8)}</div>
                          <div className="text-gray-500">{order.items} items</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.totalPrice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "delivered" ? "bg-green-100 text-green-800" :
                          order.status === "processing" ? "bg-yellow-100 text-yellow-800" :
                          order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select 
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                          value={order.status}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <a href="/admin/orders" className="text-sm font-medium text-blue-600 hover:text-blue-900">
                View all orders →
              </a>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white shadow rounded-xl overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Products</h3>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {dashboardProducts.map((product, index) => (
                  <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.jpg';
                          }}
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                          <p className="text-xs">No Image</p>
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h4>
                    <p className="text-lg font-bold text-blue-600">${product.price}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        Stock: {product.stock}
                      </span>
                      {product.featured && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {dashboardProducts.length} products
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 text-sm border rounded-md ${
                            currentPage === page
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <a href="/admin/products" className="text-sm font-medium text-blue-600 hover:text-blue-900">
                Manage all products →
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;