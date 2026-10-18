import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string({ required_error: "Name is required" }).trim().min(2),
  description: z.string({ required_error: "Description is required" }).trim().min(10),
  price: z.coerce.number({ required_error: "Price is required" }).positive(),
  discountPrice: z.coerce.number().positive().optional().nullable(),
  category: z.string({ required_error: "Category is required" }).trim(),
  material: z.string().trim().optional(),
  colors: z.array(z.string()).optional(),
  dimensions: z
    .object({
      length: z.coerce.number().optional(),
      width: z.coerce.number().optional(),
      height: z.coerce.number().optional(),
      unit: z.string().optional(),
    })
    .optional(),
  stock: z.coerce.number({ required_error: "Stock is required" }).int().min(0),
  warranty: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();