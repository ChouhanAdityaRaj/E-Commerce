import { z } from "zod";

const signupSchema = z.object({
  fullName: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must be at lest of 3 characters." })
    .max(45, { message: "Name must not be more than 45 characters." }),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address." }),

  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(8, { message: "Password must be at lest of 8 characters." })
    .refine((str) => !str.includes(" "), {message: "Password must not contain any whitespace"}),

});

const loginSchema = z.object({
  email: z
    .string({ required_error: "All fields are required" })
    .trim()
    .email({ message: "Invalid email address." }),

  password: z
    .string({ required_error: "All fields are required" })
    .trim()
    .min(8, { message: "Password must be at lest of 8 characters." })
    .refine((str) => !str.includes(" "), {message: "Password must not contain any whitespace"}),
});

const changeFullNameSchema = z.object({
  fullName: z
    .string({ required_error: "fullName is required" })
    .trim()
    .min(3, { message: "Name must be at lest of 3 characters." })
    .max(45, { message: "Name must not be more than 45 characters." }),
});

const changePasswordSchema = z.object({
  oldPassword: z
    .string({required_error: "All fields are required"})
    .trim()
    .min(8, { message: "Password must be at lest of 8 characters." })
    .refine((str) => !str.includes(" "), {message: "Password must not contain any whitespace"}),

  newPassword:  z
    .string({required_error: "All fields are required"})
    .trim()
    .min(8, { message: "Password must be at lest of 8 characters." })
    .refine((str) => !str.includes(" "), {message: "Password must not contain any whitespace"}),

  conformPassword:  z
    .string({required_error: "All fields are required"})
    .trim()
    .min(8, { message: "Password must be at lest of 8 characters." })
    .refine((str) => !str.includes(" "), {message: "Password must not contain any whitespace"}),
})

export { signupSchema, loginSchema, changeFullNameSchema, changePasswordSchema };
