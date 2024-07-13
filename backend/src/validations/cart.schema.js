import { z } from "zod";

const sizeEnum = z.enum(["XS", "S", "M", "L",  "XL", "XXL", "XXXL", "6", "7", "8", "9", "10", "11", "12"])

const addToCartSchema = z.object({
    size: z.string({required_error: "Size is required"})
      .transform((val) => val.toUpperCase())
      .refine((val) => sizeEnum.safeParse(val).success, {
        message: 'Invalid size',
      }),
    
    quantity: z.preprocess(
      (val) => val? parseInt(val, 10) : 1, 
      z
      .number()
      .min(1, "Minimum quantity is 1")
      .max(10, {message: "Maximum quantity is 10"})
    )
});


const updatecartItemSchematSchema = z.object({
    size: z.string({required_error: "Size is required"})
      .transform((val) => val.toUpperCase())
      .refine((val) => sizeEnum.safeParse(val).success, {
        message: 'Invalid size',
      })
      .optional(),
    
    quantity: z.preprocess(
      (val) => val? parseInt(val, 10) : 1, 
      z
      .number()
      .min(1, "Minimum quantity is 1")
      .max(10, {message: "Maximum quantity is 10"})
    ).optional(),
});

export {
    addToCartSchema,
    updatecartItemSchematSchema
}