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
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Category", categorySchema);