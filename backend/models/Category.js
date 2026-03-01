const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter category name"],
    trim: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
    trim: true
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: "",
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate slug from name before saving
categorySchema.pre("save", async function(next) {
  if (this.isModified("name") && !this.slug) {
    let baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim();
    
    let slug = baseSlug;
    let counter = 1;
    
    // Check if slug already exists and append number if needed
    while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);