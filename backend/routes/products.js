const express = require('express');
const Product = require('../models/Product');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      sort = 'createdAt',
      order = 'desc',
      search,
      featured,
      onSale,
      rating
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (subcategory) {
      query.subcategory = { $regex: subcategory, $options: 'i' };
    }

    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (onSale === 'true') {
      query.isOnSale = true;
    }

    if (rating) {
      query['ratings.average'] = { $gte: parseFloat(rating) };
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get products',
      error: error.message
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('reviews.user', 'firstName lastName');

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get product',
      error: error.message
    });
  }
});

// @route   POST /api/products
// @desc    Create new product (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: populatedProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Add review to product
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required'
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.createdAt = new Date();
    } else {
      // Add new review
      product.reviews.push({
        user: req.user.id,
        rating,
        comment
      });
    }

    // Calculate average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.ratings.average = (totalRating / product.reviews.length).toFixed(1);
    product.ratings.count = product.reviews.length;

    await product.save();

    const updatedProduct = await Product.findById(req.params.id)
      .populate('reviews.user', 'firstName lastName');

    res.status(200).json({
      success: true,
      message: 'Review added successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message
    });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .limit(8)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get featured products',
      error: error.message
    });
  }
});

module.exports = router;
