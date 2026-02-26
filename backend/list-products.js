const mongoose = require('mongoose');
const Product = require('./models/Product');

async function listProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mkshop');
    console.log('Connected to MongoDB');

    // Get all products (including inactive ones)
    const allProducts = await Product.find({});
    console.log(`\n📋 Total products in database: ${allProducts.length}`);
    
    // Get active products
    const activeProducts = await Product.find({ isActive: true });
    console.log(`✅ Active products: ${activeProducts.length}`);
    
    // Get inactive products
    const inactiveProducts = await Product.find({ isActive: false });
    console.log(`❌ Inactive products: ${inactiveProducts.length}`);
    
    if (allProducts.length > 0) {
      console.log('\n📦 Current Products:');
      allProducts.forEach((product, index) => {
        const status = product.isActive ? '✅' : '❌';
        console.log(`${index + 1}. ${status} ${product.name} - ৳${product.price} - ${product.isActive ? 'Active' : 'Inactive'}`);
      });
    }
    
    // Check for products without isActive field
    const productsWithoutIsActive = await Product.find({ isActive: { $exists: false } });
    if (productsWithoutIsActive.length > 0) {
      console.log(`\n⚠️  Products without isActive field: ${productsWithoutIsActive.length}`);
      productsWithoutIsActive.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - ৳${product.price}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error listing products:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the function
listProducts();
