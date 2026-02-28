const express = require("express");
const router = express.Router();

// Mock orders data
let mockOrders = [
  {
    _id: "order1",
    user: {
      _id: "user123",
      name: "John Doe",
      email: "john@example.com"
    },
    orderItems: [
      {
        _id: "item1",
        name: "Wireless Bluetooth Headphones Premium",
        quantity: 1,
        price: 89.99,
        image: "/images/products/product_1.png"
      },
      {
        _id: "item2", 
        name: "Smart Watch Pro Series 5",
        quantity: 2,
        price: 199.99,
        image: "/images/products/product_2.png"
      }
    ],
    shippingAddress: {
      address: "123 Main St",
      city: "New York",
      postalCode: "10001",
      country: "USA"
    },
    paymentMethod: "PayPal",
    paymentResult: {
      id: "pay_123",
      status: "completed",
      update_time: "2026-02-28T10:00:00Z",
      email_address: "john@example.com"
    },
    totalPrice: 489.97,
    status: "Processing",
    isPaid: true,
    paidAt: "2026-02-28T10:00:00Z",
    isDelivered: false,
    deliveredAt: null,
    createdAt: "2026-02-28T09:30:00Z"
  },
  {
    _id: "order2",
    user: {
      _id: "user456",
      name: "Jane Smith",
      email: "jane@example.com"
    },
    orderItems: [
      {
        _id: "item3",
        name: "Premium Leather Jacket Classic",
        quantity: 1,
        price: 149.99,
        image: "/images/products/product_3.png"
      }
    ],
    shippingAddress: {
      address: "456 Oak Ave",
      city: "Los Angeles",
      postalCode: "90001",
      country: "USA"
    },
    paymentMethod: "Credit Card",
    paymentResult: {
      id: "pay_456",
      status: "completed",
      update_time: "2026-02-27T15:30:00Z",
      email_address: "jane@example.com"
    },
    totalPrice: 149.99,
    status: "Shipped",
    isPaid: true,
    paidAt: "2026-02-27T15:30:00Z",
    isDelivered: false,
    deliveredAt: null,
    createdAt: "2026-02-27T14:45:00Z"
  },
  {
    _id: "order3",
    user: {
      _id: "user789",
      name: "Bob Johnson",
      email: "bob@example.com"
    },
    orderItems: [
      {
        _id: "item4",
        name: "Organic Skincare Set Complete",
        quantity: 1,
        price: 59.99,
        image: "/images/products/product_4.png"
      },
      {
        _id: "item5",
        name: "Yoga Mat Premium Non-Slip",
        quantity: 1,
        price: 49.99,
        image: "/images/products/product_5.png"
      }
    ],
    shippingAddress: {
      address: "789 Pine Rd",
      city: "Chicago",
      postalCode: "60007",
      country: "USA"
    },
    paymentMethod: "Cash on Delivery",
    paymentResult: null,
    totalPrice: 109.98,
    status: "Pending",
    isPaid: false,
    paidAt: null,
    isDelivered: false,
    deliveredAt: null,
    createdAt: "2026-02-26T11:20:00Z"
  },
  {
    _id: "order4",
    user: {
      _id: "user321",
      name: "Alice Brown",
      email: "alice@example.com"
    },
    orderItems: [
      {
        _id: "item6",
        name: "Smart Home Security Camera",
        quantity: 1,
        price: 159.99,
        image: "/images/products/product_6.png"
      }
    ],
    shippingAddress: {
      address: "321 Elm St",
      city: "Houston",
      postalCode: "77001",
      country: "USA"
    },
    paymentMethod: "PayPal",
    paymentResult: {
      id: "pay_789",
      status: "completed",
      update_time: "2026-02-25T09:15:00Z",
      email_address: "alice@example.com"
    },
    totalPrice: 159.99,
    status: "Delivered",
    isPaid: true,
    paidAt: "2026-02-25T09:15:00Z",
    isDelivered: true,
    deliveredAt: "2026-02-27T16:45:00Z",
    createdAt: "2026-02-25T08:30:00Z"
  }
];

// Get all orders
router.get("/", (req, res) => {
  const { status, search } = req.query;
  
  let filteredOrders = mockOrders;
  
  // Filter by status
  if (status && status !== 'all') {
    filteredOrders = filteredOrders.filter(order => 
      order.status.toLowerCase() === status.toLowerCase()
    );
  }
  
  // Search by user name, email, or order ID
  if (search) {
    filteredOrders = filteredOrders.filter(order =>
      order.user.name.toLowerCase().includes(search.toLowerCase()) ||
      order.user.email.toLowerCase().includes(search.toLowerCase()) ||
      order._id.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json(filteredOrders);
});

// Get order by ID
router.get("/:id", (req, res) => {
  const order = mockOrders.find(order => order._id === req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

// Update order status
router.put("/:id/status", (req, res) => {
  const { status } = req.body;
  
  const orderIndex = mockOrders.findIndex(order => order._id === req.params.id);
  if (orderIndex === -1) {
    return res.status(404).json({ message: "Order not found" });
  }
  
  mockOrders[orderIndex].status = status;
  
  // Auto-update delivered status when status is "Delivered"
  if (status === "Delivered") {
    mockOrders[orderIndex].isDelivered = true;
    mockOrders[orderIndex].deliveredAt = new Date().toISOString();
  }
  
  res.json(mockOrders[orderIndex]);
});

// Update order to paid
router.put("/:id/pay", (req, res) => {
  const { id, status, update_time, email_address } = req.body;
  
  const orderIndex = mockOrders.findIndex(order => order._id === req.params.id);
  if (orderIndex === -1) {
    return res.status(404).json({ message: "Order not found" });
  }
  
  mockOrders[orderIndex].isPaid = true;
  mockOrders[orderIndex].paidAt = new Date().toISOString();
  mockOrders[orderIndex].paymentResult = {
    id: id || `pay_${Date.now()}`,
    status: status || "completed",
    update_time: update_time || new Date().toISOString(),
    email_address: email_address || mockOrders[orderIndex].user.email
  };
  
  res.json(mockOrders[orderIndex]);
});

// Update order to delivered
router.put("/:id/deliver", (req, res) => {
  const orderIndex = mockOrders.findIndex(order => order._id === req.params.id);
  if (orderIndex === -1) {
    return res.status(404).json({ message: "Order not found" });
  }
  
  mockOrders[orderIndex].isDelivered = true;
  mockOrders[orderIndex].deliveredAt = new Date().toISOString();
  mockOrders[orderIndex].status = "Delivered";
  
  res.json(mockOrders[orderIndex]);
});

// Delete order
router.delete("/:id", (req, res) => {
  const orderIndex = mockOrders.findIndex(order => order._id === req.params.id);
  if (orderIndex === -1) {
    return res.status(404).json({ message: "Order not found" });
  }
  
  mockOrders.splice(orderIndex, 1);
  res.json({ message: "Order removed" });
});

module.exports = router;
