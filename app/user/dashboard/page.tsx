"use client";

import { useState, useEffect } from "react";
import UserLayout from "../layout";
import { useAuth } from "@/contexts/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0,
    savedItems: 0,
    wishlistItems: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch real data from APIs
      const ordersResponse = await fetch('http://localhost:5000/api/orders/user', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      const productsResponse = await fetch('http://localhost:5000/api/products?featured=true&limit=4', {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      // Use real data or empty arrays if APIs don't exist yet
      const ordersData = ordersResponse.ok ? await ordersResponse.json() : [];
      const productsData = productsResponse.ok ? await productsResponse.json() : [];
      
      // Calculate stats from real data
      const stats = {
        totalOrders: ordersData.length,
        totalSpent: ordersData.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0),
        pendingOrders: ordersData.filter((order: any) => order.status === 'pending').length,
        completedOrders: ordersData.filter((order: any) => order.status === 'delivered').length,
        savedItems: 0, // TODO: Implement saved items API
        wishlistItems: 0, // TODO: Implement wishlist API
      };

      setStats(stats);
      setRecentOrders(ordersData.slice(0, 3));
      setRecommendedProducts(productsData.products || []);
      setOrderHistory(ordersData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (productId: string) => {
    // Add to cart functionality
    console.log("Added to cart:", productId);
  };

  const addToWishlist = (productId: string) => {
    // Add to wishlist functionality
    console.log("Added to wishlist:", productId);
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user?.name}! 👋</h1>
              <p className="text-green-100 mt-2">Here's what's happening with your account</p>
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm">Member since</p>
              <p className="text-xl font-semibold">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Today"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                <p className="text-green-600 text-sm mt-1">+2 this month</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-2xl">🛒</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">${stats.totalSpent}</p>
                <p className="text-green-600 text-sm mt-1">+12% vs last month</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</p>
                <p className="text-orange-600 text-sm mt-1">Processing</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Wishlist</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.wishlistItems}</p>
                <p className="text-purple-600 text-sm mt-1">Saved items</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <span className="text-2xl">❤️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white shadow rounded-xl overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <div key={order._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order._id.slice(-8)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${order.totalPrice}</p>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "delivered" ? "bg-green-100 text-green-800" :
                        order.status === "processing" ? "bg-yellow-100 text-yellow-800" :
                        order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {order.items.slice(0, 3).map((item: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      View Details
                    </button>
                    {order.status === "delivered" && (
                      <button className="text-sm text-green-600 hover:text-green-800 font-medium">
                        Buy Again
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <a href="/user/orders" className="text-sm font-medium text-green-600 hover:text-green-900">
                View all orders →
              </a>
            </div>
          </div>

          {/* Recommended Products */}
          <div className="bg-white shadow rounded-xl overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {recommendedProducts.map((product) => (
                  <div key={product._id} className="group">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-3 group-hover:bg-gray-300 transition-colors"></div>
                    <h4 className="font-medium text-gray-900 text-sm truncate">{product.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">${product.price}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-400 text-xs">⭐</span>
                      <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                      <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button 
                        onClick={() => addToCart(product._id)}
                        className="flex-1 bg-green-600 text-white text-xs py-2 rounded hover:bg-green-700 transition-colors"
                      >
                        🛒
                      </button>
                      <button 
                        onClick={() => addToWishlist(product._id)}
                        className="flex-1 bg-gray-200 text-gray-700 text-xs py-2 rounded hover:bg-gray-300 transition-colors"
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <a href="/" className="text-sm font-medium text-green-600 hover:text-green-900">
                Browse more products →
              </a>
            </div>
          </div>
        </div>

        {/* Order History Chart */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order History</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {orderHistory.map((item: any, index: number) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-green-500 rounded-t-lg transition-all duration-300 hover:bg-green-600"
                  style={{ height: `${(item.spent / Math.max(...orderHistory.map((d: any) => d.spent))) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                <span className="text-xs font-medium">${item.spent}</span>
                <span className="text-xs text-gray-400">{item.orders} orders</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <a
              href="/"
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🛍️ Continue Shopping
            </a>
            <a
              href="/user/orders"
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              📦 Track Orders
            </a>
            <a
              href="/user/profile"
              className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              👤 Update Profile
            </a>
            <button className="flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              💬 Contact Support
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;