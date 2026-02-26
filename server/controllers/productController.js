const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, category, description, countInStock, images } = req.body;
  const product = new Product({
    name,
    price,
    category,
    description,
    countInStock,
    images,
    brand,
    sku,
    tags,
    weight,
    dimensions,
    color,
    size,
    material
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { 
    name, 
    price, 
    category, 
    description, 
    countInStock, 
    images,
    brand,
    sku,
    tags,
    weight,
    dimensions,
    color,
    size,
    material
  } = req.body;
  
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.description = description || product.description;
    product.countInStock = countInStock || product.countInStock;
    product.images = images || product.images;
    product.brand = brand || product.brand;
    product.sku = sku || product.sku;
    product.tags = tags || product.tags;
    product.weight = weight || product.weight;
    product.dimensions = dimensions || product.dimensions;
    product.color = color || product.color;
    product.size = size || product.size;
    product.material = material || product.material;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};