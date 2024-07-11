import { z } from "zod";

const sizeEnum = z.enum(["XS", "S", "M", "L",  "XL", "XXl", "XXXL", "6", "7", "8", "9", "10", "11", "12"])

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

export {
    addToCartSchema
}