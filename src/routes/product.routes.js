import { Router } from "express";

import {
  createProduct,
  getAllProducts,
  getProductBySlug,
  getProductById,
  updateProduct,
  deactivateProduct,
  hardDeleteProduct,
  uploadProductImages,
} from "../controllers/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { createProductSchema, updateProductSchema } from "../validators/product.validator.js";

const router = Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);

// Admin-only routes
router.post("/", protect, isAdmin, validate(createProductSchema), createProduct);
router.post(
  "/:id/images",
  protect,
  isAdmin,
  upload.array("images", 5), // max 5 images per request
  uploadProductImages
);
router.get("/admin/:id", protect, isAdmin, getProductById);
router.patch("/:id", protect, isAdmin, validate(updateProductSchema), updateProduct);
router.delete("/:id", protect, isAdmin, deactivateProduct);  // soft delete
router.delete("/:id/permanent", protect, isAdmin, hardDeleteProduct); // hard delete

export default router;