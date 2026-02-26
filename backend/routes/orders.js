const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
router.post('/', protect, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      notes
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product} not found or inactive`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.thumbnail
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate shipping cost (you can implement your own logic)
    const shippingCost = subtotal > 1000 ? 0 : 60; // Free shipping over 1000 BDT
    
    // Calculate tax (you can implement your own logic)
    const tax = subtotal * 0.15; // 15% tax
    
    const total = subtotal + shippingCost + tax;

    // Create order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      total,
      notes
    });

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      startDate,
      endDate,
      search
    } = req.query;

    // Build query
    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: error.message
    });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get current user's orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: error.message
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    let query = { _id: req.params.id };

    // If user is not admin, only show their own orders
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const order = await Order.findOne(query)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order',
      error: error.message
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = status;
    
    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }

    if (note) {
      order.statusHistory.push({
        status,
        note,
        timestamp: new Date()
      });
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

// @route   PUT /api/orders/:id/payment
// @desc    Update payment status (Admin only)
router.put('/:id/payment', protect, authorize('admin'), async (req, res) => {
  try {
    const { paymentStatus, transactionId, method } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: 'Payment status is required'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.paymentStatus = paymentStatus;
    
    if (paymentStatus === 'paid') {
      order.paymentDetails = {
        transactionId,
        method: method || order.paymentMethod,
        paidAt: new Date()
      };
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message
    });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Cancel order (User can cancel their own pending orders)
router.delete('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user can cancel this order
    if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Only allow cancellation of pending orders
    if (order.orderStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order. Order is already being processed.'
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
});

module.exports = router;
