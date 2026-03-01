const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/mkshop')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear and recreate categories with proper names
    await Category.deleteMany({});
    
    const categories = [
      { name: 'Electronics', description: 'Electronic devices and gadgets', image: '/images/categories/electronics.jpg' },
      { name: 'Fashion', description: 'Clothing and accessories', image: '/images/categories/fashion.jpg' },
      { name: 'Home & Living', description: 'Home furniture and decor', image: '/images/categories/home.jpg' },
      { name: 'Sports', description: 'Sports equipment and gear', image: '/images/categories/sports.jpg' },
      { name: 'Health & Beauty', description: 'Health and beauty products', image: '/images/categories/health.jpg' },
      { name: 'Books', description: 'Books and educational materials', image: '/images/categories/books.jpg' }
    ];
    
    const createdCategories = await Category.create(categories);
    console.log('Created categories:', createdCategories.map(c => ({ _id: c._id, name: c.name })));
    
    // Update products to use correct category IDs
    const electronicsCat = createdCategories.find(c => c.name === 'Electronics');
    const fashionCat = createdCategories.find(c => c.name === 'Fashion');
    const homeCat = createdCategories.find(c => c.name === 'Home & Living');
    const sportsCat = createdCategories.find(c => c.name === 'Sports');
    const healthCat = createdCategories.find(c => c.name === 'Health & Beauty');
    const booksCat = createdCategories.find(c => c.name === 'Books');
    
    // Update products based on their names to match categories
    await Product.updateMany(
      { name: { $regex: 'Headphones|Watch|Camera|Keyboard|Mouse|Computer', $options: 'i' } },
      { category: electronicsCat._id }
    );
    
    await Product.updateMany(
      { name: { $regex: 'Jacket|Leather', $options: 'i' } },
      { category: fashionCat._id }
    );
    
    await Product.updateMany(
      { name: { $regex: 'Skincare|Beauty', $options: 'i' } },
      { category: healthCat._id }
    );
    
    await Product.updateMany(
      { name: { $regex: 'Chair|Home', $options: 'i' } },
      { category: homeCat._id }
    );
    
    await Product.updateMany(
      { name: { $regex: 'Yoga|Sports', $options: 'i' } },
      { category: sportsCat._id }
    );
    
    await Product.updateMany(
      { name: { $regex: 'Book|Novel', $options: 'i' } },
      { category: booksCat._id }
    );
    
    console.log('Updated products with correct category IDs');
    
    // Count products per category
    const categoryCounts = await Promise.all(
      createdCategories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id });
        return { name: cat.name, count };
      })
    );
    
    console.log('Product counts per category:', categoryCounts);
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Connection error:', err);
  });
