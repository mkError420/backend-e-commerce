const Category = require("../models/Category");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

const getCategories = asyncHandler(async (req, res) => {
  try {
    // Get all categories and build hierarchical structure
    const allCategories = await Category.find({}).lean();
    
    // Build parent-child relationships
    const categoryMap = new Map();
    const rootCategories = [];
    
    // Create map of all categories
    allCategories.forEach(category => {
      categoryMap.set(category._id.toString(), {
        ...category,
        subcategories: []
      });
    });
    
    // Build hierarchy
    allCategories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category._id.toString());
      if (category.parent) {
        const parent = categoryMap.get(category.parent.toString());
        if (parent) {
          parent.subcategories.push(categoryWithChildren);
        }
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });
    
    // Add product counts recursively
    const addProductCounts = async (categories) => {
      return await Promise.all(
        categories.map(async (category) => {
          // Count products for this category
          const productCount = await Product.countDocuments({ category: category._id });
          
          // Process subcategories recursively
          const subcategoriesWithCounts = category.subcategories.length > 0 
            ? await addProductCounts(category.subcategories)
            : [];
          
          // Count products from all subcategories
          const subcategoryProductCount = subcategoriesWithCounts.reduce(
            (total, sub) => total + (sub.productCount || 0), 0
          );
          
          return {
            ...category,
            productCount: productCount + subcategoryProductCount,
            subcategories: subcategoriesWithCounts
          };
        })
      );
    };
    
    const categoriesWithCounts = await addProductCounts(rootCategories);
    
    res.json(categoriesWithCounts);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image, subcategories } = req.body;

  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error("Category already exists");
  }

  // Create the main category (always as root category)
  const category = await Category.create({
    name,
    description,
    image,
    parent: null, // Always create as root category
  });

  // Create subcategories if provided
  if (subcategories && Array.isArray(subcategories) && subcategories.length > 0) {
    const createdSubcategories = await Promise.all(
      subcategories.map(async (subcat) => {
        const subcategoryDoc = await Category.create({
          name: subcat.name,
          description: subcat.description,
          image: subcat.image || '',
          parent: category._id, // Set parent to the main category
        });
        return subcategoryDoc._id;
      })
    );
    
    // Update main category with subcategory references
    await Category.findByIdAndUpdate(category._id, {
      subcategories: createdSubcategories
    });
  }

  // Return the populated category with subcategories
  const populatedCategory = await Category.findById(category._id)
    .populate('subcategories');

  res.status(201).json(populatedCategory);
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, image, subcategories } = req.body;

  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // Update basic fields
  category.name = name || category.name;
  category.description = description || category.description;
  category.image = image || category.image;

  // Handle subcategories update
  if (subcategories && Array.isArray(subcategories)) {
    // First, remove all existing subcategories for this category
    await Category.deleteMany({ parent: category._id });
    
    // Clear the subcategories array
    category.subcategories = [];
    
    if (subcategories.length > 0) {
      // Create new subcategories
      const createdSubcategories = await Promise.all(
        subcategories.map(async (subcat) => {
          const subcategoryDoc = await Category.create({
            name: subcat.name,
            description: subcat.description,
            image: subcat.image || '',
            parent: category._id,
          });
          return subcategoryDoc._id;
        })
      );
      
      // Update main category with new subcategory references
      category.subcategories = createdSubcategories;
    }
  }

  const updatedCategory = await category.save();
  
  // Return the populated category with subcategories
  const populatedCategory = await Category.findById(updatedCategory._id)
    .populate('subcategories');
    
  res.json(populatedCategory);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // Check if category has products
  const productsCount = await Product.countDocuments({ category: req.params.id });
  if (productsCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete category. It contains ${productsCount} products. Please delete or reassign the products first.`);
  }

  // Check if category has subcategories
  const subcategoriesCount = await Category.countDocuments({ parent: req.params.id });
  if (subcategoriesCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete category. It contains ${subcategoriesCount} subcategories. Please delete or reassign the subcategories first.`);
  }

  // If this is a subcategory, remove it from parent's subcategories array
  if (category.parent) {
    await Category.findByIdAndUpdate(category.parent, {
      $pull: { subcategories: req.params.id }
    });
  }

  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category removed" });
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};