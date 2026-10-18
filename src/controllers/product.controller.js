import asyncHandler from "../utils/asyncHandler.js";
import {
  createProductService,
  getAllProductsService,
  getProductBySlugService,
  getProductByIdService,
  updateProductService,
  deactivateProductService,
  hardDeleteProductService,
} from "../services/product.service.js";
import { uploadImageService } from "../services/image.service.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
/**
 * Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
  const product = await createProductService(req.body);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

/**
 * Upload one or more images and attach them to a product
 * @route   POST /api/products/:id/images
 * @access  Private/Admin
 */
export const uploadProductImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one image file is required");
  }

  const uploadedUrls = await Promise.all(
    req.files.map((file) => uploadImageService(file))
  );

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $push: { images: { $each: uploadedUrls } } },
    { returnDocument: "after" }
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Images uploaded successfully",
    data: product,
  });
});
/**
 * Get all products (supports pagination, category filter, sort, search)
 * @route   GET /api/products
 * @access  Public
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  const { page, limit, category, sort, search } = req.query;

  const result = await getAllProductsService({
    page,
    limit,
    category,
    sort,
    search,
  });

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: result,
  });
});
/**
 * Get a single active product by its slug (used on product detail page)
 * @route   GET /api/products/:slug
 * @access  Public
 */
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await getProductBySlugService(req.params.slug);

  res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    data: product,
  });
});
/**
 * Update a product (partial update — only provided fields are changed)
 * @route   PATCH /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await updateProductService(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});
/**
 * Soft delete a product (sets isActive to false, keeps it in DB
 * so past orders referencing this product remain intact)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deactivateProduct = asyncHandler(async (req, res) => {
  await deactivateProductService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product deactivated successfully",
  });
});
/**
 * Get a single product by its ID, regardless of isActive status
 * (used by admin panel, e.g. Edit Product page)
 * @route   GET /api/products/admin/:id
 * @access  Private/Admin
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await getProductByIdService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    data: product,
  });
});
/**
 * Permanently delete a product from the database.
 * WARNING: Use only for products that have never been ordered —
 * deleting a product referenced in past orders can break order history.
 * @route   DELETE /api/products/:id/permanent
 * @access  Private/Admin
 */
export const hardDeleteProduct = asyncHandler(async (req, res) => {
  await hardDeleteProductService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product permanently deleted",
  });
});
