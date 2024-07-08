import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";

const createReview = asyncHandler(async (req, res) => {
    const { productid } = req.params;
    const { content, rating } = req.body;

    const reviewImagesFiles = req.files?.reviewImages?.length > 0 ? req.files?.reviewImages : undefined;

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

    const reviewImages = [];

    if(reviewImagesFiles){
        for (const img of reviewImagesFiles) {
            const uplodedImage = await uploadOnCloudinary(img.path);

            if(!uploadOnCloudinary){
                throw new ApiError(500, "Problem while uploading review images");
            }

            reviewImages.push({image: uplodedImage?.url});
        }
    }



    const review = await Review.create({
        user: req.user?._id,
        images: reviewImages,
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

const deleteReviewImage = asyncHandler(async (req, res) => {
    const { reviewid } = req.params;
    const { idList } = req.body;

    if(idList?.length <= 0){
        throw new ApiError(400, "id list is required")
    }

    const review = await Review.findById(reviewid);

    if(!review){
        throw new ApiError(404, "Review not exist");
    }

    if(req.user?._id.toString() !== review.user.toString()){
        throw new ApiError(401, "Only publisher can delete image");
    }

    if(review.images.length === 0){
        throw new ApiError(404, "There is no review images")
    }

    for(const id of idList){
        const index = review.images?.findIndex(el =>el._id.toString() === id);

        if(index === -1){
            throw new ApiError(400, "Image not found")
        }

        const image = review.images[index];
        
        const deletedImage = await deleteFromCloudinary(image?.image);

        if(!deletedImage){
            throw new ApiError(500, "Problem while deleting image")
        }

        review.images.splice(index, 1);
    }

    await review.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            review,
            "Review images deleted successfully"
        ));
});

const addReviewImages = asyncHandler(async (req, res) => {
    const { reviewid } = req.params;
    const reviewImagesFiles = req.files?.reviewImages?.length > 0 ? req.files?.reviewImages : undefined;

    if(!reviewImagesFiles){
        throw new ApiError(400, "Image is required")
    }

    const review = await Review.findById(reviewid);

    if(!review){
        throw new ApiError(404, "Review not exist");
    }

    if(req.user?._id.toString() !== review.user.toString()){
        throw new ApiError(401, "Only publisher can add images");
    }

    if((review.images?.length + reviewImagesFiles.length) > 3){
        throw new ApiError(400, `Don't have more than 3 review images. You already have ${review.images?.length} And upload ${reviewImagesFiles.length}`)
    }

    for(const img of reviewImagesFiles){
        const uplodedImage = await uploadOnCloudinary(img.path);

        if(!uplodedImage){
            throw new ApiError(500, "Problem while uploading review image");
        }

        review.images.push({image: uplodedImage.url});
    };

    await review.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            review,
            "Review images uploded successfully"
        ));
});

const deleteReview = asyncHandler(async (req, res) => {
    const { reviewid } = req.params;

    const review = await Review.findById(reviewid);

    if(!review){
        throw new ApiError(404, "Review not exist");
    }

    if(req.user?._id.toString() !== review.user.toString()){
        throw new ApiError(401, "Only publisher can update");
    }

    if(review.images?.length > 0){
        review.images?.forEach(async (img) => {
            const deletedReviewImage = await deleteFromCloudinary(img?.image);

            if(!deletedReviewImage){
                throw new ApiError(500, "Problem while deleting product other image");
            }
        });
    }

    const deletedReview = await Review.findByIdAndDelete(reviewid);

    if(!deletedReview){
        throw new ApiError(500, "Problem while deleting review");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Review deleted successfully"
        ))
});

const getReviewById = asyncHandler(async (req, res) => {
    const { reviewid } = req.params;

    const review = await Review.aggregate([
        {
            $match:{
                _id: new  mongoose.Types.ObjectId(`${reviewid}`),
            }
        },
        {
            $lookup:{
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "product",
                pipeline: [
                    {
                        $project:{
                            productName: 1,
                            productImage: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                product: {
                    $first: "$product"
                }
            }
        }
    ]);

    if(!review){
        throw new ApiError(500, "Problem while fetching review")
    }

    if(review?.length <= 0){
        throw new ApiError(404, "Review not exist")
    }


    if(req.user?._id.toString() !== review[0].user.toString()){
        throw new ApiError(401, "Only publisher can see");
    }


    return res
        .status(200)
        .json(new ApiResponse(
            200,
            review[0],
            "Review fetched successfully"
        ))
});

const getProductReviews = asyncHandler(async (req, res) => {
    const { productid } = req.params;
    const { page=1, limit=10, sortBy, sortType=1 } = req.query;

    const product = await Product.findById(productid);

    if(!product){
        throw new ApiError(404, "Product not exist");
    }


    const pipeline = [
        {
            $match:{
                product: new  mongoose.Types.ObjectId(`${productid}`),
            }
        },
        {
            $lookup:{
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project:{
                            fullName: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                user: {
                    $first: "$user"
                }
            }
        },        
    ];

    if(sortBy === "createdAt"){
        pipeline.push(
            {
                $sort: {
                    createdAt: +sortType
                }
            }
        )
    }
    if(sortBy === "rating"){
        pipeline.push(
            {
                $sort: {
                    rating: +sortType
                }
            }
        )
    }

    pipeline.push(
        {
            $limit: +page * +limit
        },
        {
            $skip: +page * +limit - +limit

        }
    )

    const reviews = await Review.aggregate(pipeline);

    if(!reviews){
        throw new ApiError(500, "Problem while fetching product reviews")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            reviews,
            "Product reviews fetched successfully"
        ));
})

export {
    createReview,
    updateReview,
    deleteReviewImage,
    addReviewImages,
    deleteReview,
    getReviewById,
    getProductReviews
}