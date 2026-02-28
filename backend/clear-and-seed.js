const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./models/Category");
const Product = require("./models/Product");
const User = require("./models/User");

dotenv.config();

const clearAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mk-ecommerce');
    console.log("MongoDB Connected");
    
    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log("Database cleared");
    
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
      slug: "electronics",
      description: "Electronic devices and gadgets",
      image: "/images/categories/electronics.jpg"
    });
    
    const fashion = await Category.create({
      name: "Fashion",
      slug: "fashion",
      description: "Clothing and accessories",
      image: "/images/categories/fashion.jpg"
    });
    
    const home = await Category.create({
      name: "Home & Living",
      slug: "home-living",
      description: "Home furniture and decor",
      image: "/images/categories/home.jpg"
    });
    
    // Create products
    const products = [
      {
        name: "Wireless Bluetooth Headphones",
        sku: "WBH-001",
        description: "Premium wireless headphones with noise cancellation and superior sound quality.",
        price: 89.99,
        category: electronics._id,
        images: ["/images/products/product_1.png"],
        stock: 50,
        featured: true,
        rating: 4.5,
        numReviews: 128
      },
      {
        name: "Smart Watch Pro",
        sku: "SWP-002",
        description: "Advanced fitness tracking and health monitoring in a sleek design.",
        price: 199.99,
        category: electronics._id,
        images: ["/images/products/product_2.png"],
        stock: 30,
        featured: true,
        rating: 4.8,
        numReviews: 89
      },
      {
        name: "Premium Leather Jacket",
        sku: "PLJ-003",
        description: "Genuine leather jacket with modern design and exceptional craftsmanship.",
        price: 149.99,
        category: fashion._id,
        images: ["/images/products/product_3.png"],
        stock: 25,
        featured: false,
        rating: 4.7,
        numReviews: 56
      },
      {
        name: "Organic Skincare Set",
        sku: "OSS-004",
        description: "Complete organic skincare routine for radiant skin.",
        price: 79.99,
        category: fashion._id,
        images: ["/images/products/product_4.png"],
        stock: 40,
        featured: true,
        rating: 4.9,
        numReviews: 203
      },
      {
        name: "Gaming Mechanical Keyboard",
        sku: "GMK-005",
        description: "RGB mechanical keyboard for gaming enthusiasts.",
        price: 129.99,
        category: electronics._id,
        images: ["/images/products/product_5.png"],
        stock: 35,
        featured: false,
        rating: 4.6,
        numReviews: 167
      },
      {
        name: "Ergonomic Office Chair",
        sku: "EOC-006",
        description: "Ergonomic chair for long working hours.",
        price: 299.99,
        category: home._id,
        images: ["/images/products/product_7.png"],
        stock: 20,
        featured: true,
        rating: 4.4,
        numReviews: 145
      },
      {
        name: "Professional Camera Lens",
        sku: "PCL-007",
        description: "Professional grade camera lens for photographers.",
        price: 599.99,
        category: electronics._id,
        images: ["/images/products/product_6.png"],
        stock: 15,
        featured: false,
        rating: 4.8,
        numReviews: 94
      },
      {
        name: "Bestseller Novel Collection",
        sku: "BNC-008",
        description: "Collection of bestselling novels.",
        price: 39.99,
        category: fashion._id,
        images: ["/images/products/product_8.png"],
        stock: 60,
        featured: false,
        rating: 4.7,
        numReviews: 278
      },
      {
        name: "Wireless Mouse",
        sku: "WM-009",
        description: "Ergonomic wireless mouse with precision tracking.",
        price: 29.99,
        category: electronics._id,
        images: ["/images/products/product_9.png"],
        stock: 45,
        featured: false,
        rating: 4.3,
        numReviews: 89
      },
      {
        name: "Yoga Mat Premium",
        sku: "YMP-010",
        description: "Non-slip yoga mat for all workout types.",
        price: 49.99,
        category: home._id,
        images: ["/images/products/product_10.png"],
        stock: 55,
        featured: true,
        rating: 4.6,
        numReviews: 156
      }
    ];
    
    await Product.insertMany(products);
    console.log(`${products.length} products created successfully!`);
    
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

clearAndSeed();
