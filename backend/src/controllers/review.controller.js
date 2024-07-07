import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

const createReview = asyncHandler(async (req, res) => {
    const { productid } = req.params;
    const { content, rating } = req.body;

    const product = await Product.findById(productid);

    if(!product){
        throw new ApiError(404, "Product not exist");
    }

    const isReviewExist = await Review.findOne({
        $and: [
            {user: req.user?._id},
            {product: product?._id}
        ]
    });

    if(isReviewExist){
        throw new ApiError(409, "Review already exist");
    }

    const review = await Review.create({
        user: req.user?._id,
        content,
        rating,
        product: productid,
    })

    if(!review){
        throw new ApiError(500, "Problem while creating review");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            review,
            "Review Created successfully"
        ));
});


const updateReview = asyncHandler(async (req, res) => {
    const { reviewid } = req.params;
    const { content, rating } = req.body;

    if(!(content || rating)){
        throw new ApiError(400, "Atlest one field is required")
    }

    const review = await Review.findById(reviewid);

    if(!review){
        throw new ApiError(404, "Review not exist");
    }

    if(req.user?._id.toString() !== review.user.toString()){
        throw new ApiError(401, "Only publisher can update");
    }

    if(content){
        review.content = content;
    }

    if(rating){
        review.rating = rating;
    }

    await review.save();
 
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            review,
            "Review updated successfully"
        ));

});

export {
    createReview,
    updateReview
}