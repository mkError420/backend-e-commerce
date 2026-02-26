const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

// Generic user products that can be customized
const userProducts = [
  {
    name: 'User Product 1 - Custom Item',
    price: 99.99,
    originalPrice: 149.99,
    rating: 4.2,
    reviews: 25,
    badge: 'User',
    category: 'Electronics',
    description: 'This is a user-added product. You can edit this product to update with your actual product details.',
    stock: 100,
    brand: 'UserBrand',
    tags: ['user', 'custom', 'editable'],
    isFeatured: false,
    isOnSale: true,
    discountPercentage: 33,
    isActive: true,
    specifications: {
      'Type': 'User Customizable',
      'Editable': 'Yes',
      'Status': 'Ready for editing'
    }
  },
  {
    name: 'User Product 2 - Another Item',
    price: 79.99,
    originalPrice: 119.99,
    rating: 4.5,
    reviews: 18,
    badge: 'User',
    category: 'Fashion',
    description: 'Another user product placeholder. Edit this with your actual product information.',
    stock: 50,
    brand: 'UserBrand',
    tags: ['user', 'custom', 'placeholder'],
    isFeatured: false,
    isOnSale: true,
    discountPercentage: 33,
    isActive: true,
    specifications: {
      'Type': 'User Customizable',
      'Editable': 'Yes',
      'Status': 'Ready for editing'
    }
  },
  {
    name: 'User Product 3 - Third Item',
    price: 129.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviews: 32,
    badge: 'User',
    category: 'Home & Living',
    description: 'Third user product placeholder. Customize this with your product details.',
    stock: 75,
    brand: 'UserBrand',
    tags: ['user', 'custom', 'home'],
    isFeatured: true,
    isOnSale: true,
    discountPercentage: 35,
    isActive: true,
    specifications: {
      'Type': 'User Customizable',
      'Editable': 'Yes',
      'Status': 'Ready for editing'
    }
  },
  {
    name: 'User Product 4 - Fourth Item',
    price: 59.99,
    originalPrice: 89.99,
    rating: 4.3,
    reviews: 12,
    badge: 'User',
    category: 'Sports',
    description: 'Fourth user product placeholder. Edit this product with your actual information.',
    stock: 60,
    brand: 'UserBrand',
    tags: ['user', 'custom', 'sports'],
    isFeatured: false,
    isOnSale: true,
    discountPercentage: 33,
    isActive: true,
    specifications: {
      'Type': 'User Customizable',
      'Editable': 'Yes',
      'Status': 'Ready for editing'
    }
  },
  {
    name: 'User Product 5 - Fifth Item',
    price: 199.99,
    originalPrice: 299.99,
    rating: 4.6,
    reviews: 28,
    badge: 'User',
    category: 'Beauty',
    description: 'Fifth user product placeholder. Customize this with your beauty product details.',
    stock: 40,
    brand: 'UserBrand',
    tags: ['user', 'custom', 'beauty'],
    isFeatured: false,
    isOnSale: true,
    discountPercentage: 33,
    isActive: true,
    specifications: {
      'Type': 'User Customizable',
      'Editable': 'Yes',
      'Status': 'Ready for editing'
    }
  }
];

async function addUserProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mkshop');
    console.log('Connected to MongoDB');

    // Get existing categories
    const categories = await Category.find({});
    console.log(`Found ${categories.length} existing categories`);

    // Create category map for easy lookup
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Create products with category references and images
    const productsToCreate = userProducts.map((product, index) => {
      const { reviews, rating, ...productData } = product;
      const categoryId = categoryMap[product.category];
      
      if (!categoryId) {
        console.error(`Category not found for product: ${product.category}`);
        return null;
      }
      
      return {
        ...productData,
        category: categoryId,
        thumbnail: `/images/products/user_product_${index + 1}.png`,
        images: [{
          url: `/images/products/user_product_${index + 1}.png`,
          public_id: `products/user_product_${index + 1}`
        }],
        sku: `USR-${String(index + 1).padStart(6, '0')}`,
        ratings: {
          average: rating,
          count: reviews
        }
      };
    }).filter(product => product !== null);

    // Insert products
    const createdProducts = await Product.insertMany(productsToCreate);
    console.log(`✅ Added ${createdProducts.length} user placeholder products`);

    // Display created products
    console.log('\n📋 Added User Products:');
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ৳${product.price}`);
    });

    console.log('\n🎉 User products added successfully!');
    console.log('\n📝 NOTE: These are placeholder products. You can edit them in the admin dashboard to add your actual product details.');
    
  } catch (error) {
    console.error('❌ Error adding user products:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the function
addUserProducts();
