const mongoose = require('mongoose');
const Product = require('./models/Product');
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mkshop');
    const p = new Product({
      name: 'Test',
      description: 'd',
      price: 1,
      category: '699e72220c91790e1a137f42',
      stock: 1,
      thumbnail: '/t',
      images: [{ url: '/u', public_id: 'p' }]
    });
    console.log('before validate sku', p.sku);
    await p.validate();
    console.log('after validate sku', p.sku);
  } catch (err) {
    console.error('validation error', err);
  } finally {
    await mongoose.disconnect();
  }
})();