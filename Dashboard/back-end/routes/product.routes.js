import express from "express";

import verifyJWT from "../middleware/verifyJWT.js";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product/product.controller.js";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/product/productCategory.controller.js";

const router = express.Router();

router.use(verifyJWT);

// ***
router.get("/", getProducts);
router.post("/", createProduct);
router.put("/", updateProduct);
router.delete("/", deleteProduct);

// *** Product Category
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories", updateCategory);
router.delete("/categories", deleteCategory);

// *** Product Discount
// router.get("/discount", );
// router.post("/discount", );
// router.put("/discount", );
// router.delete("/discount", );

export default router;
