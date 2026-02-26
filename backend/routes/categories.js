const express = require('express');
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories (tree structure)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.getTree();
    
    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories',
      error: error.message
    });
  }
});

// @route   GET /api/categories/flat
// @desc    Get all categories in flat structure
router.get('/flat', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parent', 'name')
      .sort({ sortOrder: 1, name: 1 });

    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get flat categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories',
      error: error.message
    });
  }
});

// @route   GET /api/categories/:id
// @desc    Get single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'name slug');

    if (!category || !category.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get category',
      error: error.message
    });
  }
});

// @route   GET /api/categories/slug/:slug
// @desc    Get category by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    }).populate('parent', 'name slug');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Get category by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get category',
      error: error.message
    });
  }
});

// @route   POST /api/categories
// @desc    Create new category (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const category = new Category(req.body);
    
    // Set level based on parent
    if (category.parent) {
      const parent = await Category.findById(category.parent);
      if (parent) {
        category.level = parent.level + 1;
      }
    }
    
    await category.save();

    const populatedCategory = await Category.findById(category._id)
      .populate('parent', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: populatedCategory
    });
  } catch (error) {
    console.error('Create category error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update category (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Update level if parent changed
    if (updateData.parent) {
      const parent = await Category.findById(updateData.parent);
      if (parent) {
        updateData.level = parent.level + 1;
      }
    } else {
      updateData.level = 0;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('parent', 'name slug');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    // Check if category has children
    const childCategories = await Category.find({ parent: req.params.id });
    if (childCategories.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories. Please delete subcategories first.'
      });
    }

    // Check if category has products
    const Product = require('../models/Product');
    const productsCount = await Product.countDocuments({ category: req.params.id });
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with products. Please move or delete products first.'
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
});

// @route   PUT /api/categories/:id/reorder
// @desc    Reorder categories (Admin only)
router.put('/reorder', protect, authorize('admin'), async (req, res) => {
  try {
    const { categories } = req.body; // Array of { id, sortOrder }

    const updatePromises = categories.map(({ id, sortOrder }) =>
      Category.findByIdAndUpdate(id, { sortOrder }, { new: true })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Categories reordered successfully'
    });
  } catch (error) {
    console.error('Reorder categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder categories',
      error: error.message
    });
  }
});

module.exports = router;
