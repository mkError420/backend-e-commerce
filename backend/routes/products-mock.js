const express = require("express");
const router = express.Router();

// Mock products data
let mockProducts = [
  {
    _id: "1",
    name: "Wireless Bluetooth Headphones Premium",
    description: "Premium wireless headphones with noise cancellation and superior sound quality. Features include 30-hour battery life, comfortable over-ear design, and premium audio drivers.",
    shortDescription: "Premium wireless headphones with noise cancellation",
    price: 89.99,
    regularPrice: 149.99,
    category: "electronics",
    images: ["/images/products/product_1.png"],
    stock: 50,
    featured: true,
    rating: 4.5,
    numReviews: 128,
    createdAt: "2026-02-28T08:07:37.130Z"
  },
  {
    _id: "2",
    name: "Smart Watch Pro Series 5",
    description: "Advanced fitness tracking and health monitoring in a sleek design. Includes heart rate monitoring, GPS tracking, and smartphone integration.",
    shortDescription: "Advanced fitness tracking smart watch",
    price: 199.99,
    regularPrice: 299.99,
    category: "electronics",
    images: ["/images/products/product_2.png"],
    stock: 30,
    featured: true,
    rating: 4.8,
    numReviews: 89,
    createdAt: "2026-02-28T08:07:37.131Z"
  },
  {
    _id: "3",
    name: "Premium Leather Jacket Classic",
    description: "Genuine leather jacket with timeless style and exceptional craftsmanship. Perfect for any season with its versatile design.",
    shortDescription: "Genuine leather classic jacket",
    price: 149.99,
    regularPrice: 249.99,
    category: "fashion",
    images: ["/images/products/product_3.png"],
    stock: 20,
    featured: false,
    rating: 4.7,
    numReviews: 56,
    createdAt: "2026-02-28T08:07:37.131Z"
  },
  {
    _id: "4",
    name: "Organic Skincare Set Complete",
    description: "Complete organic skincare routine for radiant skin. Includes cleanser, toner, serum, and moisturizer with natural ingredients.",
    shortDescription: "Complete organic skincare set",
    price: 59.99,
    regularPrice: 119.99,
    category: "beauty",
    images: ["/images/products/product_4.png"],
    stock: 40,
    featured: true,
    rating: 4.9,
    numReviews: 278,
    createdAt: "2026-02-28T08:07:37.131Z"
  },
  {
    _id: "5",
    name: "Yoga Mat Premium Non-Slip",
    description: "Extra thick yoga mat with superior grip and cushioning. Perfect for all types of yoga and exercise routines.",
    shortDescription: "Extra thick non-slip yoga mat",
    price: 49.99,
    regularPrice: 79.99,
    category: "sports",
    images: ["/images/products/product_5.png"],
    stock: 60,
    featured: false,
    rating: 4.5,
    numReviews: 89,
    createdAt: "2026-02-28T08:07:37.131Z"
  },
  {
    _id: "6",
    name: "Smart Home Security Camera",
    description: "HD security camera with night vision and mobile app control. Keep your home safe with 24/7 monitoring capabilities.",
    shortDescription: "HD security camera with night vision",
    price: 159.99,
    regularPrice: 249.99,
    category: "electronics",
    images: ["/images/products/product_6.png"],
    stock: 25,
    featured: true,
    rating: 4.6,
    numReviews: 156,
    createdAt: "2026-02-28T08:07:37.131Z"
  }
];

// Mock categories for product management
const mockCategories = [
  { _id: "electronics", name: "Electronics" },
  { _id: "fashion", name: "Fashion" },
  { _id: "beauty", name: "Beauty" },
  { _id: "sports", name: "Sports" },
  { _id: "home", name: "Home & Living" },
  { _id: "books", name: "Books" }
];

// Get all products with filtering and pagination
router.get("/", (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  const category = req.query.category;

  let filteredProducts = mockProducts;

  // Filter by keyword
  if (req.query.keyword) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(req.query.keyword.toLowerCase()) ||
      product.description.toLowerCase().includes(req.query.keyword.toLowerCase())
    );
  }

  // Filter by category
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }

  // Filter by featured status
  if (req.query.featured === 'true') {
    filteredProducts = filteredProducts.filter(product => product.featured);
  }

  const count = filteredProducts.length;
  const products = filteredProducts.slice(
    pageSize * (page - 1),
    pageSize * page
  );

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// Get featured products
router.get("/featured", (req, res) => {
  const featuredProducts = mockProducts.filter(product => product.featured);
  res.json(featuredProducts);
});

// Get product by ID
router.get("/:id", (req, res) => {
  const product = mockProducts.find(p => p._id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// Get products by category
router.get("/category/:categoryId", (req, res) => {
  const products = mockProducts.filter(product => product.category === req.params.categoryId);
  res.json(products);
});

// Create new product
router.post("/", (req, res) => {
  const { 
    name, 
    description, 
    shortDescription, 
    price, 
    regularPrice, 
    category, 
    images, 
    stock, 
    featured 
  } = req.body;

  // Validation
  if (!name || !description || !price || !category) {
    return res.status(400).json({ message: "Name, description, price, and category are required" });
  }

  const newProduct = {
    _id: Date.now().toString(),
    name,
    description,
    shortDescription: shortDescription || description.substring(0, 100) + "...",
    price: parseFloat(price),
    regularPrice: regularPrice ? parseFloat(regularPrice) : null,
    category,
    images: images && images.length > 0 ? images : ["/images/products/default.png"],
    stock: parseInt(stock) || 0,
    featured: featured || false,
    rating: 0,
    numReviews: 0,
    createdAt: new Date().toISOString()
  };

  mockProducts.push(newProduct);
  res.status(201).json(newProduct);
});

// Update product
router.put("/:id", (req, res) => {
  const { 
    name, 
    description, 
    shortDescription, 
    price, 
    regularPrice, 
    category, 
    images, 
    stock, 
    featured 
  } = req.body;

  const productIndex = mockProducts.findIndex(p => p._id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const updatedProduct = {
    ...mockProducts[productIndex],
    name: name || mockProducts[productIndex].name,
    description: description || mockProducts[productIndex].description,
    shortDescription: shortDescription || mockProducts[productIndex].shortDescription,
    price: price ? parseFloat(price) : mockProducts[productIndex].price,
    regularPrice: regularPrice !== undefined ? parseFloat(regularPrice) : mockProducts[productIndex].regularPrice,
    category: category || mockProducts[productIndex].category,
    images: images && images.length > 0 ? images : mockProducts[productIndex].images,
    stock: stock !== undefined ? parseInt(stock) : mockProducts[productIndex].stock,
    featured: featured !== undefined ? featured : mockProducts[productIndex].featured
  };

  mockProducts[productIndex] = updatedProduct;
  res.json(updatedProduct);
});

// Delete product
router.delete("/:id", (req, res) => {
  const productIndex = mockProducts.findIndex(p => p._id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  mockProducts.splice(productIndex, 1);
  res.json({ message: "Product removed" });
});

// Get categories for product management
router.get("/categories/list", (req, res) => {
  res.json(mockCategories);
});

module.exports = router;
