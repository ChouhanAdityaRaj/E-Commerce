import { z } from "zod";

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

export { addNewProductSchema, updateProductDetailsSchema, updateStockSchema };
