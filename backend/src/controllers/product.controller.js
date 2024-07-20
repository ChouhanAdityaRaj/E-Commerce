import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

const searchProducts = asyncHandler(async (req, res) => {
    const { page=1, limit=10, sortBy, sortType=1, search } = req.query;

    if(page === 0){
        throw new ApiError(400, "Page number must be posative")
    }

    if(!search){
        throw new ApiError(400, "Serach query is required")
    }

    const pipeline = [
        {
            $match: {
                $or: [
                    { productName: new RegExp(`${search.split(" ").join("|")}`, 'gi') },
                    { description: new RegExp(`${search.split(" ").join("|")}`, 'gi') }
                ]
            }
        },
        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "product",
                as: "reviews",
            }
        },
        {
            $addFields: {
                sumOfReviewStar:  {
                    $reduce: {
                        input: "$reviews",
                        initialValue: 0,
                        in: { $add: ["$$value", "$$this.rating"] }
                    }
                },
                totalReview: { $size: "$reviews" },
            }
        },
        {
            $project: {
                productName: 1,
                productImage: 1,
                price: 1,
                rating: {
                    $cond: {
                        if: { $eq: ["$totalReview", 0] },
                        then: null,
                        else: { $divide: ["$sumOfReviewStar", "$totalReview"] }
                      }
                },
                createdAt: 1
            }
        }
    ];

    if(sortBy === "price"){
        pipeline.push(
            {
                $sort: {
                    price: +sortType 
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

    if(sortBy === "date"){
        pipeline.push(
            {
                $sort: {
                    createdAt: +sortType 
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


    const products = await Product.aggregate(pipeline);

    if(!products){
        throw new ApiError(500, "Problem while fetching products")
    }

    if(!products.length){
        throw new ApiError(404, `There is no page ${+page}`);
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            products,
            "Product fetched successfully"
        ));
});

export {
    searchProducts
}