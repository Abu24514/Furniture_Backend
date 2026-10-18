import ApiError from "../utils/ApiError.js";
import Product from "../models/Product.js";

export const createProductService = async (data) => {
  const product = await Product.create(data);
  return product;
};

export const getAllProductsService = async ({ page = 1, limit = 12, category, sort, search }) => {
  const filter = { isActive: true };

  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: "i" };

  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortOption).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductBySlugService = async (slug) => {
  const product = await Product.findOne({ slug, isActive: true });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

export const getProductByIdService = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

export const updateProductService = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

export const deactivateProductService = async (id) => {
  const product = await Product.findByIdAndUpdate(id, { isActive: false }, {
    returnDocument: "after",
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};
export const hardDeleteProductService = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};