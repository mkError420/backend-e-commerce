"use client";

import React, { useState } from "react";

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

interface OrderListProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
  onMarkAsPaid: (orderId: string) => void;
  onMarkAsDelivered: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
  getStatusColor: (status: string) => string;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  onViewOrder,
  onUpdateStatus,
  onMarkAsPaid,
  onMarkAsDelivered,
  onDeleteOrder,
  getStatusColor,
}) => {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div>
      {/* Orders Table */}
      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">No orders found</div>
            <p className="text-gray-500 text-sm">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order._id.slice(-8)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.orderItems.length} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(order.totalPrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {order.isPaid ? "Paid" : "Unpaid"}
                        </span>
                        {order.isDelivered && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Delivered
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onViewOrder(order)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="View order details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => toggleOrderExpansion(order._id)}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          title="Quick actions"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Row with Quick Actions */}
                  {expandedOrders.has(order._id) && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-3">
                          {/* Order Items Preview */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items:</h4>
                            <div className="space-y-1">
                              {order.orderItems.slice(0, 2).map((item) => (
                                <div key={item._id} className="flex items-center space-x-3 text-sm">
                                  <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden">
                                    {item.image && (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-gray-500 ml-2">
                                      x{item.quantity} ({formatPrice(item.price)})
                                    </span>
                                  </div>
                                </div>
                              ))}
                              {order.orderItems.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{order.orderItems.length - 2} more items
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex flex-wrap gap-2">
                            {/* Status Update */}
                            <select
                              value={order.status}
                              onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                              className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>

                            {/* Payment Actions */}
                            {!order.isPaid && (
                              <button
                                onClick={() => onMarkAsPaid(order._id)}
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                              >
                                Mark as Paid
                              </button>
                            )}

                            {/* Delivery Actions */}
                            {order.isPaid && !order.isDelivered && (
                              <button
                                onClick={() => onMarkAsDelivered(order._id)}
                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              >
                                Mark as Delivered
                              </button>
                            )}

                            {/* Delete Action */}
                            <button
                              onClick={() => onDeleteOrder(order._id)}
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                              Delete Order
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Showing {orders.length} orders
        </div>
      </div>
    </div>
  );
};

export default OrderList;
