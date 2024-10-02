import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";


const getAllCategories = asyncHandler(async (req, res) => {

    const categories = await Category.find().select("-updatedAt -createdAt");

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
    const { page=1, limit=10, sortBy, sortType=1 } = req.query;

    if(page === 0){
        throw new ApiError(400, "Page number must be posative")
    }

    const productStageSubPipeline = [
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
                description: 1,
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


    if(sortBy === "price"){
        productStageSubPipeline.push(
            {
                $sort: {
                    price: +sortType 
                }
            }
        )
    }

    if(sortBy === "rating"){
        productStageSubPipeline.push(
            {
                $sort: {
                    rating: +sortType 
                }
            }
        )
    }

    if(sortBy === "date"){
        productStageSubPipeline.push(
            {
                $sort: {
                    createdAt: +sortType 
                }
            }
        )
    }

    productStageSubPipeline.push(
        {
            $limit: +page * +limit
        },
        {
            $skip: +page * +limit - +limit

        }
    )



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
                pipeline: productStageSubPipeline
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

    if(!category[0].products.length){
        throw new ApiError(404, `There is no products in this Category`);
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