const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');
const path = require('path');

async function restoreProducts() {
  try {
    // List available backup files
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      console.log('❌ No backup directory found');
      return;
    }

    const backupFiles = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('products-backup-') && file.endsWith('.json'))
      .sort((a, b) => b.localeCompare(a)); // Sort by date (newest first)

    if (backupFiles.length === 0) {
      console.log('❌ No backup files found');
      return;
    }

    console.log('📋 Available backup files:');
    backupFiles.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });

    // Use the most recent backup
    const latestBackup = backupFiles[0];
    const backupPath = path.join(backupDir, latestBackup);
    
    console.log(`\n🔄 Restoring from: ${latestBackup}`);
    
    // Read backup file
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mkshop');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Restore products
    const restoredProducts = await Product.insertMany(backupData.products);
    console.log(`✅ Restored ${restoredProducts.length} products`);
    
    console.log(`📅 Backup from: ${backupData.timestamp}`);
    console.log('🎉 Products restored successfully!');
    
  } catch (error) {
    console.error('❌ Error restoring products:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the function
restoreProducts();
