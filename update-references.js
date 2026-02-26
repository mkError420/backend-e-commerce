// Script to update references after importing data
// Run this in MongoDB Compass Shell after importing all files

// Update product category references
db.categories.find().forEach(function(category) {
  db.products.updateMany(
    { category: category.name },
    { $set: { category: category._id } }
  );
});

// Update blog author references
db.users.find().forEach(function(user) {
  db.blogs.updateMany(
    { author: user.name },
    { $set: { author: user._id } }
  );
});

// Update blog category references
db.categories.find().forEach(function(category) {
  db.blogs.updateMany(
    { categories: category.name },
    { $push: { categories: category._id }, $pull: { categories: category.name } }
  );
});

// Update order user references
db.users.find().forEach(function(user) {
  db.orders.updateMany(
    { user: user.name },
    { $set: { user: user._id } }
  );
});

// Update order product references
db.products.find().forEach(function(product) {
  db.orders.updateMany(
    { "orderItems.product": product.name },
    { $set: { "orderItems.$[elem].product": product._id } },
    { arrayFilters: [{ "elem.product": product.name }] }
  );
});

print("Database references updated successfully!");
