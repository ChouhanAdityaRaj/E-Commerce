import { z } from "zod";
import mongoose from "mongoose";

const stockSubSchema = z.object({
  size: z.preprocess(
    (val) => val.toUpperCase().trim(),
    z.enum(["XS", "S", "M", "L",  "XL", "XXl", "XXXL", "6", "7", "8", "9", "10", "11", "12"], {message: 'Invalid size type'}),
  ),

  quantity: z.preprocess(
    (val) => parseInt(val, 10), 
    z.number({ invalid_type_error: "Quantity is required and must be number must be number"}).positive({message: "quantity must be posative"})
  )
});

const updateStockSubSchema = z.object({
  size: z.preprocess(
    (val) => val.toUpperCase().trim(),
    z.enum(["XS", "S", "M", "L",  "XL", "XXl", "XXXL", "6", "7", "8", "9", "10", "11", "12"], {message: 'Invalid size type'}),
  ),

  quantity: z.preprocess(
    (val) => parseInt(val, 10), 
    z.number({ invalid_type_error: "Quantity is required and must be number must be number"})
  )
});

const addNewProductSchema = z.object({
  productName: z
    .string({ required_error: "Product name is required" })
    .trim()
    .min(3, { message: "Product name must be at lest of 8 characters." })
    .max(30, { message: "Product name must not be more than 30 characters." }),

  description: z
    .string({ required_error: "Description is required" })
    .trim()
    .max(150, { message: "Description must not be more than 150 characters." }),

  price:  z.preprocess(
    (val) => parseInt(val, 10), 
    z.number({invalid_type_error: "Price is required and must be number"}).positive({message: "Price must be posative number"})
  ),
  category: z.string({required_error:"Category is required"}).refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid ObjectId",
  }),
  stock: z.array(stockSubSchema, {message: "Stock is required"}).nonempty({message: "Stock is required"}),
});


const updateProductDetailsSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(3, { message: "Product name must be at lest of 3 characters." })
    .max(30, { message: "Product name must not be more than 30 characters." })
    .optional(),

  description: z
    .string()
    .trim()
    .max(150, { message: "Description must not be more than 150 characters." })
    .optional(),

  price:  z.preprocess(
    (val) => parseInt(val, 10), 
    z.number({invalid_type_error: "Price must be number"}).positive({message: "Price must be posative number"})
  ).optional(),
});

const updateStockSchema = z.object({
  stocks: z.array(updateStockSubSchema, {message: "Stock is required"}).nonempty({message: "Stock is required"}),
});


//Admin Category Schemes

const createCategorySchema = z.object({
  name: z
    .string({required_error: "Category name is required"})
    .trim()
    .toLowerCase()
    .max(30, {message: "Category name must not be more than 30 characters."}),

  description: z
    .string({required_error: "Category description is required"})
    .trim()
    .min(10, { message: "Category description must be at lest of 10 characters." })
    .max(150, { message: "Category description must not be more than 150 characters." })
})

export { addNewProductSchema, updateProductDetailsSchema, updateStockSchema, createCategorySchema };
