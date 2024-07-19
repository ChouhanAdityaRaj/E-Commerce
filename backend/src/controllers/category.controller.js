import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";


const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.aggregate([
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "category",
                as: "products",
                pipeline: [
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
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                products: "$products"
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                products: 1, 
            }
        }
    ]);

    if(!categories){
        throw new ApiError(500, "Problem while fetching categories");
    }


    return res
        .status(200)
        .json(new ApiResponse(
            200, 
            categories,
            "Categories fetched successfully"
        ));
});


const getCategoryById = asyncHandler(async (req, res) => {
    const { categoryid } = req.params;

    const category = await Category.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(`${categoryid}`)
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "category",
                as: "products",
                pipeline: [
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
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                products: "$products"
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                products: 1, 
            }
        }
    ]);

    if(!category?.length){
        throw new ApiError(404, "Category not exist");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            category[0],
            "Category fetched successfully"
        ))
});


export {
    getAllCategories,
    getCategoryById
}