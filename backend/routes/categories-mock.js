const express = require("express");
const router = express.Router();

// Mock categories data
let mockCategories = [
  {
    _id: "cat1",
    name: "Electronics",
    description: "Electronic devices and gadgets",
    image: "/images/categories/electronics.jpg"
  },
  {
    _id: "cat2", 
    name: "Fashion",
    description: "Clothing and accessories",
    image: "/images/categories/fashion.jpg"
  },
  {
    _id: "cat3",
    name: "Home & Living", 
    description: "Home furniture and decor",
    image: "/images/categories/home.jpg"
  },
  {
    _id: "cat4",
    name: "Sports",
    description: "Sports equipment and gear", 
    image: "/images/categories/sports.jpg"
  }
];

// Get all categories
router.get("/", (req, res) => {
  res.json(mockCategories);
});

// Get category by ID
router.get("/:id", (req, res) => {
  const category = mockCategories.find(cat => cat._id === req.params.id);
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ message: "Category not found" });
  }
});

// Create new category
router.post("/", (req, res) => {
  const { name, description, image } = req.body;

  // Validation
  if (!name || !description) {
    return res.status(400).json({ message: "Name and description are required" });
  }

  const newCategory = {
    _id: Date.now().toString(),
    name,
    description,
    image: image || "/images/categories/default.jpg"
  };

  mockCategories.push(newCategory);
  res.status(201).json(newCategory);
});

// Update category
router.put("/:id", (req, res) => {
  const { name, description, image } = req.body;
  const categoryIndex = mockCategories.findIndex(cat => cat._id === req.params.id);
  
  if (categoryIndex === -1) {
    return res.status(404).json({ message: "Category not found" });
  }

  const updatedCategory = {
    ...mockCategories[categoryIndex],
    name: name || mockCategories[categoryIndex].name,
    description: description || mockCategories[categoryIndex].description,
    image: image || mockCategories[categoryIndex].image
  };

  mockCategories[categoryIndex] = updatedCategory;
  res.json(updatedCategory);
});

// Delete category
router.delete("/:id", (req, res) => {
  const categoryIndex = mockCategories.findIndex(cat => cat._id === req.params.id);
  
  if (categoryIndex === -1) {
    return res.status(404).json({ message: "Category not found" });
  }

  mockCategories.splice(categoryIndex, 1);
  res.json({ message: "Category removed" });
});

module.exports = router;
