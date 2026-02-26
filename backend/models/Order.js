const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'Bangladesh'
    }
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'bkash', 'nagad', 'rocket', 'card'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    paidAt: Date,
    method: String
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCost: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    maxlength: 500
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  trackingNumber: String,
  estimatedDelivery: Date,
  deliveredAt: Date
}, {
  timestamps: true
});

// Pre-save middleware for order number generation
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${String(count + 1).padStart(8, '0')}`;
  }
  next();
});

// Pre-save middleware for status history
orderSchema.pre('save', function(next) {
  if (this.isModified('orderStatus')) {
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date()
    });
  }
  next();
});

// Static method for user orders
orderSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Virtual for order total calculation
orderSchema.virtual('calculatedTotal').get(function() {
  return this.subtotal + this.shippingCost + this.tax - this.discount;
});

module.exports = mongoose.model('Order', orderSchema);
