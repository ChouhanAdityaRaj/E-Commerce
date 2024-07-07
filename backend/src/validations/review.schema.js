import { z } from "zod";

const createReviewSchema = z.object({
    content: z
        .string({required_error: "Content is required"})
        .trim()
        .max(200, { message: "Description must not be more than 200 characters." }),

    rating: z.preprocess(
        (val) => parseInt(val, 10), 
        z
            .number({invalid_type_error: "Rating is required must be in number"})
            .max(5, {message: "Rating must be 1, 2, 3, 4, 5"})
            .positive({message: "Rating must be 1, 2, 3, 4, 5"})
      ),

});

const updateReviewSchema = z.object({
    content: z
        .string({required_error: "Content is required"})
        .trim()
        .max(200, { message: "Description must not be more than 200 characters." })
        .optional(),

    rating: z.preprocess(
        (val) => parseInt(val, 10), 
        z
            .number({invalid_type_error: "Rating is required must be in number"})
            .max(5, {message: "Rating must be 1, 2, 3, 4, 5"})
            .positive({message: "Rating must be 1, 2, 3, 4, 5"})
      ).optional(),

});

export {
    createReviewSchema,
    updateReviewSchema
}