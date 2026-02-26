const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

// Demo products from frontend - only the ones missing from admin dashboard
const additionalDemoProducts = [
  {
    name: 'Yoga Mat Premium Non-Slip',
    price: 49.99,
    originalPrice: 79.99,
    rating: 4.5,
    reviews: 89,
    badge: 'Sports',
    category: 'Sports',
    description: 'Extra thick yoga mat with superior grip and cushioning.',
    stock: 80,
    brand: 'FitGear',
    tags: ['yoga', 'mat', 'fitness', 'exercise'],
    isFeatured: false,
    isOnSale: true,
    discountPercentage: 38,
    isActive: true,
    specifications: {
      'Material': 'TPE',
      'Thickness': '6mm',
      'Size': '183cm x 61cm',
      'Texture': 'Non-slip surface'
    }
  },
  {
    name: 'Smart Home Security Camera',
    price: 159.99,
    originalPrice: 249.99,
    rating: 4.6,
    reviews: 156,
    badge: 'Smart',
    category: 'Electronics',
    description: 'HD security camera with night vision and mobile app control.',
    stock: 40,
    brand: 'SecureCam',
    tags: ['security', 'camera', 'smart', 'home'],
    isFeatured: true,
    isOnSale: true,
    discountPercentage: 36,
    isActive: true,
    specifications: {
      'Resolution': '1080p HD',
      'Night Vision': 'Yes',
      'Storage': 'Cloud & SD Card',
      'Connectivity': 'WiFi 2.4GHz'
    }
  },
  {
    name: 'Kids Educational Building Blocks',
    price: 34.99,
    originalPrice: 54.99,
    rating: 4.8,
    reviews: 234,
    badge: 'Toys',
    category: 'Toys',
    description: 'Creative building blocks that enhance problem-solving skills.',
    stock: 150,
    brand: 'EduBlocks',
    tags: ['educational', 'building', 'blocks', 'kids'],
    isFeatured: false,
    isOnSale: true,
    discountPercentage: 36,
    isActive: true,
    specifications: {
      'Pieces': '200+',
      'Age Range': '5-12 years',
      'Material': 'Non-toxic plastic',
      'Safety': 'CPSIA certified'
    }
  },
  {
    name: 'Stainless Steel Water Bottle',
    price: 24.99,
    originalPrice: 39.99,
    rating: 4.3,
    reviews: 67,
    badge: 'Eco',
    category: 'Sports',
    description: 'Insulated water bottle that keeps drinks cold for 24 hours.',
    stock: 200,
    brand: 'EcoBottle',
    tags: ['water', 'bottle', 'insulated', 'eco-friendly'],
    isFeatured: false,
    isOnSale: true,
    discountPercentage: 38,
    isActive: true,
    specifications: {
      'Capacity': '750ml',
      'Material': '304 Stainless Steel',
      'Insulation': 'Double wall vacuum',
      'Lid Type': 'Leak-proof screw cap'
    }
  },
  {
    name: 'Classic Literature Collection',
    price: 59.99,
    originalPrice: 99.99,
    rating: 4.7,
    reviews: 278,
    badge: 'Books',
    category: 'Books',
    description: 'Collection of award-winning novels from various genres.',
    stock: 200,
    brand: 'BookWorld',
    tags: ['books', 'novels', 'literature', 'classic'],
    isFeatured: false,
    isOnSale: true,
    discountPercentage: 40,
    isActive: true,
    specifications: {
      'Books': '5 novels',
      'Language': 'English',
      'Pages': '2000 total',
      'Format': 'Paperback'
    }
  },
  {
    name: 'Gaming Mechanical Keyboard',
    price: 129.99,
    originalPrice: 189.99,
    rating: 4.6,
    reviews: 167,
    badge: 'Gaming',
    category: 'Electronics',
    description: 'RGB mechanical keyboard for gaming enthusiasts.',
    stock: 40,
    brand: 'GameGear',
    tags: ['gaming', 'mechanical', 'keyboard', 'rgb'],
    isFeatured: false,
    isOnSale: true,
    discountPercentage: 32,
    isActive: true,
    specifications: {
      'Switch Type': 'Cherry MX Red',
      'Backlight': 'RGB',
      'Layout': 'TKL (87 keys)',
      'Connection': 'USB-C'
    }
  },
  {
    name: 'Professional Camera Lens',
    price: 599.99,
    originalPrice: 899.99,
    rating: 4.8,
    reviews: 94,
    badge: 'Pro',
    category: 'Electronics',
    description: 'Professional grade camera lens for photographers.',
    stock: 15,
    brand: 'ProPhoto',
    tags: ['camera', 'lens', 'professional', 'photography'],
    isFeatured: false,
    isOnSale: true,
    discountPercentage: 33,
    isActive: true,
    specifications: {
      'Focal Length': '50mm',
      'Aperture': 'f/1.4',
      'Mount': 'Canon EF',
      'Weight': '290g'
    }
  },
  {
    name: 'Ergonomic Office Chair',
    price: 299.99,
    originalPrice: 449.99,
    rating: 4.4,
    reviews: 145,
    badge: 'Comfort',
    category: 'Home & Living',
    description: 'Ergonomic chair for long working hours.',
    stock: 25,
    brand: 'ComfortSeat',
    tags: ['office', 'chair', 'ergonomic', 'comfort'],
    isFeatured: false,
    isOnSale: true,
    discountPercentage: 33,
    isActive: true,
    specifications: {
      'Material': 'Mesh & Leather',
      'Adjustment': 'Height, Armrests, Lumbar',
      'Weight Capacity': '150kg',
      'Warranty': '3 years'
    }
  }
];

async function addDemoProducts() {
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
    console.log('Category map created');

    // Create products with category references and images
    const productsToCreate = additionalDemoProducts.map((product, index) => {
      const { reviews, rating, ...productData } = product;
      const categoryId = categoryMap[product.category];
      
      if (!categoryId) {
        console.error(`Category not found for product: ${product.category}`);
        return null;
      }
      
      return {
        ...productData,
        category: categoryId,
        thumbnail: `/images/products/product_${index + 12}.png`, // Start from 12 to avoid conflicts
        images: [{
          url: `/images/products/product_${index + 12}.png`,
          public_id: `products/product_${index + 12}`
        }],
        sku: `PRD-${String(index + 12).padStart(6, '0')}`,
        ratings: {
          average: rating,
          count: reviews
        }
      };
    }).filter(product => product !== null);

    // Insert products
    const createdProducts = await Product.insertMany(productsToCreate);
    console.log(`✅ Added ${createdProducts.length} additional demo products`);

    // Display created products
    console.log('\n📋 Added Products:');
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ৳${product.price}`);
    });

    console.log('\n🎉 Demo products added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding demo products:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the function
addDemoProducts();
