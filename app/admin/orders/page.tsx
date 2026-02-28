"use client";

import { useState, useEffect } from "react";
import OrderList from "@/components/admin/OrderList";
import OrderDetailModal from "@/components/admin/OrderDetailModal";

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: Array<{
    _id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  } | null;
  totalPrice: number;
  status: string;
  isPaid: boolean;
  paidAt: string | null;
  isDelivered: boolean;
  deliveredAt: string | null;
  createdAt: string;
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    search: ""
  });

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();
      
      if (filters.status !== "all") {
        queryParams.append("status", filters.status);
      }
      if (filters.search) {
        queryParams.append("search", filters.search);
      }

      const response = await fetch(
        `http://localhost:5000/api/orders?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (error) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(order => 
          order._id === orderId ? updatedOrder : order
        ));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(updatedOrder);
        }
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update order status");
      }
    } catch (error) {
      setError("Network error");
    }
  };

  const handleMarkAsPaid = async (orderId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/pay`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: `pay_${Date.now()}`,
            status: "completed",
            update_time: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(order => 
          order._id === orderId ? updatedOrder : order
        ));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(updatedOrder);
        }
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to mark order as paid");
      }
    } catch (error) {
      setError("Network error");
    }
  };

  const handleMarkAsDelivered = async (orderId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/deliver`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(order => 
          order._id === orderId ? updatedOrder : order
        ));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(updatedOrder);
        }
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to mark order as delivered");
      }
    } catch (error) {
      setError("Network error");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setOrders(orders.filter(order => order._id !== orderId));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(null);
          setIsModalOpen(false);
        }
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to delete order");
      }
    } catch (error) {
      setError("Network error");
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <div className="text-sm text-gray-500">
          Total Orders: {orders.length}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Filter
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Orders
            </label>
            <input
              type="text"
              placeholder="Search by name, email, or order ID..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md">
        <OrderList
          orders={orders}
          onViewOrder={handleViewOrder}
          onUpdateStatus={handleUpdateOrderStatus}
          onMarkAsPaid={handleMarkAsPaid}
          onMarkAsDelivered={handleMarkAsDelivered}
          onDeleteOrder={handleDeleteOrder}
          getStatusColor={getStatusColor}
        />
      </div>

      {/* Order Detail Modal */}
      {isModalOpen && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={handleCloseModal}
          onUpdateStatus={handleUpdateOrderStatus}
          onMarkAsPaid={handleMarkAsPaid}
          onMarkAsDelivered={handleMarkAsDelivered}
          getStatusColor={getStatusColor}
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;
