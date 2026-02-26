const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');
const path = require('path');

async function backupProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mkshop');
    console.log('Connected to MongoDB');

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products to backup`);

    // Create backup directory if it doesn't exist
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Create backup file with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupFile = path.join(backupDir, `products-backup-${timestamp}.json`);
    
    // Save products to backup file
    const backupData = {
      timestamp: new Date().toISOString(),
      totalProducts: products.length,
      products: products
    };
    
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    console.log(`✅ Backup created: ${backupFile}`);
    console.log(`📦 Backed up ${products.length} products`);
    
  } catch (error) {
    console.error('❌ Error backing up products:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the function
backupProducts();
