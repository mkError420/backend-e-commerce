const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./models/Category");
const Product = require("./models/Product");
const User = require("./models/User");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    
    // Create admin user
    await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin"
    });
    
    // Create regular user
    await User.create({
      name: "John Doe",
      email: "user@example.com",
      password: "123456",
      role: "user"
    });
    
    // Create categories
    const electronics = await Category.create({
      name: "Electronics",
      description: "Electronic devices and gadgets",
      image: "/images/categories/electronics.jpg"
    });
    
    const clothing = await Category.create({
      name: "Clothing",
      description: "Fashion and apparel",
      image: "/images/categories/clothing.jpg"
    });
    
    const books = await Category.create({
      name: "Books",
      description: "Books and educational materials",
      image: "/images/categories/books.jpg"
    });
    
    // Create products
    await Product.create({
      name: "Laptop Pro",
      description: "High-performance laptop for professionals",
      price: 999.99,
      category: electronics._id,
      images: ["/images/products/laptop.jpg"],
      stock: 50,
      featured: true,
      rating: 4.5,
      numReviews: 12
    });
    
    await Product.create({
      name: "Smartphone X",
      description: "Latest smartphone with advanced features",
      price: 699.99,
      category: electronics._id,
      images: ["/images/products/phone.jpg"],
      stock: 100,
      featured: true,
      rating: 4.7,
      numReviews: 25
    });
    
    await Product.create({
      name: "T-Shirt Premium",
      description: "Comfortable cotton t-shirt",
      price: 29.99,
      category: clothing._id,
      images: ["/images/products/tshirt.jpg"],
      stock: 200,
      featured: false,
      rating: 4.2,
      numReviews: 8
    });
    
    await Product.create({
      name: "JavaScript Guide",
      description: "Complete guide to JavaScript programming",
      price: 39.99,
      category: books._id,
      images: ["/images/products/jsbook.jpg"],
      stock: 30,
      featured: true,
      rating: 4.8,
      numReviews: 15
    });
    
    await Product.create({
      name: "Wireless Headphones",
      description: "Premium noise-cancelling headphones",
      price: 199.99,
      category: electronics._id,
      images: ["/images/products/headphones.jpg"],
      stock: 75,
      featured: true,
      rating: 4.6,
      numReviews: 20
    });
    
    await Product.create({
      name: "Jeans Classic",
      description: "Classic fit denim jeans",
      price: 59.99,
      category: clothing._id,
      images: ["/images/products/jeans.jpg"],
      stock: 150,
      featured: false,
      rating: 4.3,
      numReviews: 18
    });
    
    console.log("Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();