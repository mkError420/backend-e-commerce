const Product = require("../models/Product");
const Category = require("../models/Category");
const asyncHandler = require("../middleware/asyncHandler");

const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;
  
  // Build filter object
  let filter = {};
  
  // Add search keyword if present
  if (req.query.keyword) {
    filter.name = {
      $regex: req.query.keyword,
      $options: "i",
    };
  }
  
  // Add category filter if present
  if (req.query.category) {
    filter.category = req.query.category;
  }
  
  // Add subcategory filter if present
  if (req.query.subcategory) {
    filter.subcategory = req.query.subcategory;
  }
  
  // Add featured filter if present
  if (req.query.featured === 'true') {
    filter.featured = true;
  }

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate("category", "name")
    .populate("subcategory", "name")
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name")
    .populate("subcategory", "name");

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const createProduct = asyncHandler(async (req, res) => {
  console.log('=== BACKEND PRODUCT CREATION DEBUG ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  const { name, description, shortDescription, price, regularPrice, category, subcategory, images, stock, featured } = req.body;
  
  console.log('Extracted fields:');
  console.log('  name:', name);
  console.log('  description:', description);
  console.log('  shortDescription:', shortDescription);
  console.log('  price:', price);
  console.log('  regularPrice:', regularPrice);
  console.log('  category:', category);
  console.log('  subcategory:', subcategory);
  console.log('  images:', images);
  console.log('  stock:', stock);
  console.log('  featured:', featured);

  try {
    // Validate required fields
    if (!name || !description || !shortDescription || !price || !category || !images || !stock) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        missing: {
          name: !name,
          description: !description,
          shortDescription: !shortDescription,
          price: !price,
          category: !category,
          images: !images,
          stock: !stock
        }
      });
    }

    // Validate data types
    if (isNaN(parseFloat(price)) || isNaN(parseFloat(regularPrice))) {
      return res.status(400).json({ 
        message: 'Price fields must be valid numbers',
        received: { price, regularPrice }
      });
    }

    // Validate images array
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ 
        message: 'Images must be a non-empty array',
        received: images
      });
    }

    const product = await Product.create({
      name,
      description,
      shortDescription,
      price: parseFloat(price),
      regularPrice: parseFloat(regularPrice),
      category,
      subcategory: subcategory && subcategory.trim() !== '' ? subcategory : null,
      images,
      stock: parseInt(stock),
      featured,
    });

    const createdProduct = await Product.findById(product._id)
      .populate("category", "name")
      .populate("subcategory", "name");
    
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ 
      message: error.message,
      details: error.errors || 'Unknown error occurred'
    });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  console.log('=== BACKEND PRODUCT UPDATE DEBUG ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  const { name, description, shortDescription, price, regularPrice, category, subcategory, images, stock, featured } = req.body;
  
  console.log('Extracted fields:');
  console.log('  name:', name);
  console.log('  description:', description);
  console.log('  shortDescription:', shortDescription);
  console.log('  price:', price);
  console.log('  regularPrice:', regularPrice);
  console.log('  category:', category);
  console.log('  subcategory:', subcategory);
  console.log('  images:', images);
  console.log('  stock:', stock);
  console.log('  featured:', featured);

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  try {
    // Validate required fields
    if (!name || !description || !shortDescription || !price || !category || !images || !stock) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        missing: {
          name: !name,
          description: !description,
          shortDescription: !shortDescription,
          price: !price,
          category: !category,
          images: !images,
          stock: !stock
        }
      });
    }

    // Validate data types
    if (isNaN(parseFloat(price)) || isNaN(parseFloat(regularPrice))) {
      return res.status(400).json({ 
        message: 'Price fields must be valid numbers',
        received: { price, regularPrice }
      });
    }

    // Validate images array
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ 
        message: 'Images must be a non-empty array',
        received: images
      });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.shortDescription = shortDescription || product.shortDescription;
    product.price = parseFloat(price) || product.price;
    product.regularPrice = parseFloat(regularPrice) !== undefined ? parseFloat(regularPrice) : product.regularPrice;
    product.category = category || product.category;
    product.subcategory = subcategory !== undefined ? subcategory : product.subcategory;
    product.images = images || product.images;
    product.stock = parseInt(stock) || product.stock;
    product.featured = featured !== undefined ? featured : product.featured;

    const updatedProduct = await product.save();
    const populatedProduct = await Product.findById(updatedProduct._id).populate("category", "name").populate("subcategory", "name");
    res.json(populatedProduct);
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ 
      message: error.message,
      details: error.errors || 'Unknown error occurred'
    });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product removed" });
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true })
    .populate("category", "name")
    .limit(8);

  res.json(products);
});

const getProductsByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({ category: req.params.categoryId })
    .populate("category", "name")
    .limit(20);

  res.json(products);
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory,
};