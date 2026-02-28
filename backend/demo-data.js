// Demo data for testing without MongoDB
// This file provides mock data for testing the frontend

const demoProducts = [
  {
    _id: "1",
    name: "Laptop Pro",
    description: "High-performance laptop for professionals",
    price: 999.99,
    category: { _id: "cat1", name: "Electronics" },
    images: ["/images/products/laptop.jpg"],
    stock: 50,
    featured: true,
    rating: 4.5,
    numReviews: 12
  },
  {
    _id: "2",
    name: "Smartphone X",
    description: "Latest smartphone with advanced features",
    price: 699.99,
    category: { _id: "cat1", name: "Electronics" },
    images: ["/images/products/phone.jpg"],
    stock: 100,
    featured: true,
    rating: 4.7,
    numReviews: 25
  },
  {
    _id: "3",
    name: "T-Shirt Premium",
    description: "Comfortable cotton t-shirt",
    price: 29.99,
    category: { _id: "cat2", name: "Clothing" },
    images: ["/images/products/tshirt.jpg"],
    stock: 200,
    featured: false,
    rating: 4.2,
    numReviews: 8
  },
  {
    _id: "4",
    name: "JavaScript Guide",
    description: "Complete guide to JavaScript programming",
    price: 39.99,
    category: { _id: "cat3", name: "Books" },
    images: ["/images/products/jsbook.jpg"],
    stock: 30,
    featured: true,
    rating: 4.8,
    numReviews: 15
  }
];

const demoCategories = [
  { _id: "cat1", name: "Electronics", description: "Electronic devices and gadgets" },
  { _id: "cat2", name: "Clothing", description: "Fashion and apparel" },
  { _id: "cat3", name: "Books", description: "Books and educational materials" }
];

const demoUsers = [
  { _id: "user1", name: "Admin User", email: "admin@example.com", role: "admin" },
  { _id: "user2", name: "John Doe", email: "user@example.com", role: "user" }
];

const demoOrders = [
  {
    _id: "order1",
    user: { name: "John Doe" },
    totalPrice: 1039.98,
    status: "pending",
    createdAt: new Date().toISOString()
  },
  {
    _id: "order2", 
    user: { name: "Jane Smith" },
    totalPrice: 699.99,
    status: "processing",
    createdAt: new Date().toISOString()
  }
];

console.log("Demo data available for testing:");
console.log("- Products:", demoProducts.length);
console.log("- Categories:", demoCategories.length);
console.log("- Users:", demoUsers.length);
console.log("- Orders:", demoOrders.length);

module.exports = {
  demoProducts,
  demoCategories,
  demoUsers,
  demoOrders
};