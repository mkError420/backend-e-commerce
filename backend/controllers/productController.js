const Product = require("../models/Product");
const Category = require("../models/Category");
const asyncHandler = require("../middleware/asyncHandler");

const getProducts = asyncHandler(async (req, res) => {
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

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .populate("category", "name")
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category", "name");

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, images, stock, featured } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    category,
    images,
    stock,
    featured,
  });

  const createdProduct = await Product.findById(product._id).populate("category", "name");
  
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, images, stock, featured } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.category = category || product.category;
  product.images = images || product.images;
  product.stock = stock || product.stock;
  product.featured = featured !== undefined ? featured : product.featured;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.remove();
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