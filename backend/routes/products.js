const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/auth");

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/featured").get(getFeaturedProducts);
router.route("/category/:categoryId").get(getProductsByCategory);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;