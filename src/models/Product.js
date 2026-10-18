import mongoose from "mongoose";

// Converts "Sheesham Wood Sofa" → "sheesham-wood-sofa"
const generateSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String], // ImageKit URLs
      default: [],
    },
    material: {
      type: String,
      trim: true,
    },
    colors: {
      type: [String],
      default: [],
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        default: "cm",
      },
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    warranty: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-generate a unique slug from the product name before saving
productSchema.pre("save", async function () {
  if (!this.isModified("name")) return;

  let baseSlug = generateSlug(this.name);
  let slug = baseSlug;
  let counter = 1;

  while (await mongoose.models.Product.findOne({ slug, _id: { $ne: this._id } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = slug;
});

// Indexes for search/filter/listing performance
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;