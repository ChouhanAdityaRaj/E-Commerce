import { z } from "zod";

const stockSchema = z.object({
  size: z.string({ required_error: "Size is required" }).trim(),

  quantity: z.preprocess(
    (val) => parseInt(val, 10), 
    z.number({ invalid_type_error: "Quantity is required and must be number must be number"}).positive({message: "quantity must be posative"})
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

  stock: z.array(stockSchema, {message: "Stock is required"}),
});

export { addNewProductSchema };
