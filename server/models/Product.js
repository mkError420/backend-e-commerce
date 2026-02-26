const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [String],
  countInStock: { type: Number, default: 0 },
  brand: { type: String },
  sku: { type: String },
  tags: [String],
  weight: { type: String },
  dimensions: { type: String },
  color: { type: String },
  size: { type: String },
  material: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
