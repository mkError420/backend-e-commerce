const mongoose = require("mongoose");
const Category = require("./models/Category");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createMultipleCategories = async () => {
  try {
    console.log("Starting to create multiple categories with subcategories...");
    
    // Clear existing categories
    await Category.deleteMany({});
    console.log("Cleared existing categories");

    // Define categories with their subcategories
    const categoriesData = [
      {
        name: "Electronics",
        description: "Electronic devices, gadgets, and accessories",
        image: "/images/categories/electronics.jpg",
        subcategories: [
          { name: "Smartphones", description: "Mobile phones and accessories", image: "/images/categories/smartphones.jpg" },
          { name: "Laptops", description: "Laptop computers and accessories", image: "/images/categories/laptops.jpg" },
          { name: "Tablets", description: "Tablet computers and e-readers", image: "/images/categories/tablets.jpg" },
          { name: "Headphones", description: "Audio equipment and headphones", image: "/images/categories/headphones.jpg" },
          { name: "Cameras", description: "Digital cameras and photography equipment", image: "/images/categories/cameras.jpg" },
          { name: "Gaming", description: "Gaming consoles and accessories", image: "/images/categories/gaming.jpg" }
        ]
      },
      {
        name: "Clothing & Fashion",
        description: "Apparel, shoes, and fashion accessories",
        image: "/images/categories/clothing.jpg",
        subcategories: [
          { name: "Men's Clothing", description: "Shirts, pants, and men's apparel", image: "/images/categories/mens-clothing.jpg" },
          { name: "Women's Clothing", description: "Dresses, tops, and women's apparel", image: "/images/categories/womens-clothing.jpg" },
          { name: "Kids' Clothing", description: "Children's clothing and accessories", image: "/images/categories/kids-clothing.jpg" },
          { name: "Shoes", description: "Footwear for all ages", image: "/images/categories/shoes.jpg" },
          { name: "Bags & Accessories", description: "Handbags, wallets, and accessories", image: "/images/categories/bags.jpg" },
          { name: "Jewelry", description: "Fine jewelry and fashion accessories", image: "/images/categories/jewelry.jpg" }
        ]
      },
      {
        name: "Books & Media",
        description: "Books, movies, music, and educational materials",
        image: "/images/categories/books.jpg",
        subcategories: [
          { name: "Fiction Books", description: "Novels and fiction literature", image: "/images/categories/fiction-books.jpg" },
          { name: "Non-Fiction", description: "Educational and reference books", image: "/images/categories/non-fiction.jpg" },
          { name: "Textbooks", description: "Educational textbooks and study materials", image: "/images/categories/textbooks.jpg" },
          { name: "Movies & TV", description: "DVDs, Blu-rays, and digital media", image: "/images/categories/movies.jpg" },
          { name: "Music", description: "CDs, vinyl, and digital music", image: "/images/categories/music.jpg" },
          { name: "Magazines", description: "Periodicals and magazines", image: "/images/categories/magazines.jpg" }
        ]
      },
      {
        name: "Sports & Outdoors",
        description: "Sports equipment and outdoor gear",
        image: "/images/categories/sports.jpg",
        subcategories: [
          { name: "Fitness Equipment", description: "Exercise machines and fitness gear", image: "/images/categories/fitness.jpg" },
          { name: "Team Sports", description: "Equipment for team sports", image: "/images/categories/team-sports.jpg" },
          { name: "Outdoor Gear", description: "Camping, hiking, and outdoor equipment", image: "/images/categories/outdoor.jpg" },
          { name: "Cycling", description: "Bicycles and cycling accessories", image: "/images/categories/cycling.jpg" },
          { name: "Water Sports", description: "Swimming, diving, and water sports equipment", image: "/images/categories/water-sports.jpg" },
          { name: "Winter Sports", description: "Skiing, snowboarding, and winter sports gear", image: "/images/categories/winter-sports.jpg" }
        ]
      },
      {
        name: "Home & Garden",
        description: "Home improvement, furniture, and garden supplies",
        image: "/images/categories/home.jpg",
        subcategories: [
          { name: "Furniture", description: "Indoor and outdoor furniture", image: "/images/categories/furniture.jpg" },
          { name: "Kitchen & Dining", description: "Cookware, appliances, and dining items", image: "/images/categories/kitchen.jpg" },
          { name: "Bed & Bath", description: "Bedding, towels, and bathroom accessories", image: "/images/categories/bed-bath.jpg" },
          { name: "Home Decor", description: "Decorative items and home accessories", image: "/images/categories/home-decor.jpg" },
          { name: "Garden Tools", description: "Gardening equipment and supplies", image: "/images/categories/garden.jpg" },
          { name: "Lighting", description: "Indoor and outdoor lighting solutions", image: "/images/categories/lighting.jpg" }
        ]
      },
      {
        name: "Health & Beauty",
        description: "Personal care, cosmetics, and health products",
        image: "/images/categories/health.jpg",
        subcategories: [
          { name: "Skincare", description: "Facial care and skincare products", image: "/images/categories/skincare.jpg" },
          { name: "Makeup", description: "Cosmetics and beauty products", image: "/images/categories/makeup.jpg" },
          { name: "Hair Care", description: "Hair products and styling tools", image: "/images/categories/hair-care.jpg" },
          { name: "Personal Care", description: "Hygiene and personal care items", image: "/images/categories/personal-care.jpg" },
          { name: "Vitamins & Supplements", description: "Health supplements and vitamins", image: "/images/categories/vitamins.jpg" },
          { name: "Medical Supplies", description: "First aid and medical equipment", image: "/images/categories/medical.jpg" }
        ]
      },
      {
        name: "Toys & Games",
        description: "Toys, games, and children's entertainment",
        image: "/images/categories/toys.jpg",
        subcategories: [
          { name: "Educational Toys", description: "Learning and developmental toys", image: "/images/categories/educational-toys.jpg" },
          { name: "Board Games", description: "Tabletop games and puzzles", image: "/images/categories/board-games.jpg" },
          { name: "Video Games", description: "Video games and gaming accessories", image: "/images/categories/video-games.jpg" },
          { name: "Action Figures", description: "Collectible figures and toys", image: "/images/categories/action-figures.jpg" },
          { name: "Dolls & Plush", description: "Dolls, stuffed animals, and plush toys", image: "/images/categories/dolls.jpg" },
          { name: "Outdoor Toys", description: "Playground equipment and outdoor toys", image: "/images/categories/outdoor-toys.jpg" }
        ]
      },
      {
        name: "Food & Beverages",
        description: "Groceries, snacks, and beverages",
        image: "/images/categories/food.jpg",
        subcategories: [
          { name: "Snacks & Sweets", description: "Chips, candy, and snack foods", image: "/images/categories/snacks.jpg" },
          { name: "Beverages", description: "Soft drinks, juices, and beverages", image: "/images/categories/beverages.jpg" },
          { name: "Coffee & Tea", description: "Coffee beans, tea leaves, and accessories", image: "/images/categories/coffee-tea.jpg" },
          { name: "Baking & Cooking", description: "Ingredients and cooking supplies", image: "/images/categories/baking.jpg" },
          { name: "Organic Foods", description: "Natural and organic food products", image: "/images/categories/organic.jpg" },
          { name: "International Foods", description: "Imported and specialty foods", image: "/images/categories/international.jpg" }
        ]
      }
    ];

    // Create all categories with their subcategories
    const createdCategories = [];

    for (const categoryData of categoriesData) {
      console.log(`Creating category: ${categoryData.name}`);
      
      // Create main category
      const mainCategory = await Category.create({
        name: categoryData.name,
        description: categoryData.description,
        image: categoryData.image,
        parent: null,
      });

      // Create subcategories if provided
      if (categoryData.subcategories && categoryData.subcategories.length > 0) {
        const createdSubcategories = await Promise.all(
          categoryData.subcategories.map(async (subcat) => {
            const subcategoryDoc = await Category.create({
              name: subcat.name,
              description: subcat.description,
              image: subcat.image || '',
              parent: mainCategory._id,
            });
            return subcategoryDoc._id;
          })
        );
        
        // Update main category with subcategory references
        await Category.findByIdAndUpdate(mainCategory._id, {
          subcategories: createdSubcategories
        });

        console.log(`  Created ${createdSubcategories.length} subcategories for ${categoryData.name}`);
      }

      createdCategories.push(mainCategory);
    }

    console.log(`\n✅ Successfully created ${createdCategories.length} main categories!`);
    
    // Display summary
    console.log("\n📋 Category Summary:");
    for (const category of createdCategories) {
      const populatedCategory = await Category.findById(category._id).populate('subcategories');
      console.log(`  📁 ${populatedCategory.name} (${populatedCategory.subcategories.length} subcategories)`);
      populatedCategory.subcategories.forEach(sub => {
        console.log(`    └── ${sub.name}`);
      });
    }

    mongoose.connection.close();
    console.log("\n🎉 Database seeding completed successfully!");
    
  } catch (error) {
    console.error("Error creating categories:", error);
    mongoose.connection.close();
  }
};

createMultipleCategories();
