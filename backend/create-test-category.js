const mongoose = require("mongoose");
const Category = require("./models/Category");

// Connect to MongoDB (adjust connection string as needed)
mongoose.connect("mongodb://localhost:27017/ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createTestCategory = async () => {
  try {
    // Find existing Electronics category
    const electronics = await Category.findOne({ name: "Electronics" });
    
    if (!electronics) {
      console.log("Electronics category not found, creating it...");
      // Create main category if it doesn't exist
      const newElectronics = await Category.create({
        name: "Electronics",
        description: "Electronic devices and gadgets",
        image: "/images/categories/electronics.jpg"
      });
      
      // Create subcategories
      const phones = await Category.create({
        name: "Smartphones",
        description: "Mobile phones and accessories",
        image: "/images/categories/smartphones.jpg",
        parent: newElectronics._id
      });

      const laptops = await Category.create({
        name: "Laptops",
        description: "Laptop computers and accessories", 
        image: "/images/categories/laptops.jpg",
        parent: newElectronics._id
      });

      // Update parent category with subcategory references
      await Category.findByIdAndUpdate(newElectronics._id, {
        subcategories: [phones._id, laptops._id]
      });

      console.log("Test category with subcategories created successfully!");
    } else {
      console.log("Found existing Electronics category, adding subcategories...");
      
      // Create subcategories
      const phones = await Category.create({
        name: "Smartphones",
        description: "Mobile phones and accessories",
        image: "/images/categories/smartphones.jpg",
        parent: electronics._id
      });

      const laptops = await Category.create({
        name: "Laptops",
        description: "Laptop computers and accessories", 
        image: "/images/categories/laptops.jpg",
        parent: electronics._id
      });

      // Update parent category with subcategory references
      await Category.findByIdAndUpdate(electronics._id, {
        subcategories: [phones._id, laptops._id]
      });

      console.log("Subcategories added to existing Electronics category!");
    }

    // Verify the created structure
    const verifyCategory = await Category.findById(electronics._id).populate('subcategories');
    console.log("Main category:", verifyCategory.name);
    console.log("Subcategories:", verifyCategory.subcategories.map(sub => sub.name));

    mongoose.connection.close();
  } catch (error) {
    console.error("Error creating test category:", error);
    mongoose.connection.close();
  }
};

createTestCategory();
