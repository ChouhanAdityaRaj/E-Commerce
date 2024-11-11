import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Banner } from "../models/banner.model.js";
import mongoose from "mongoose";

const getAllBanners = asyncHandler(async (req, res) => {

    const banners = await Banner.aggregate([
        {
            $match: {
                isActive: true
            }
        },
        {
            $project: {
                title: 1,
                image: 1,
                isActive: 1,
                createdAt: 1
            }
        }
    ])

    if (!banners) {
        throw new ApiError(500, "Problem while fetching banners");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            banners,
            "Banners fetched successfully"
        ))
})

const getBannerDetails = asyncHandler(async (req, res) => {
    const { bannerid } = req.params;
    const { page, limit, sortBy, sortType} = req.query;

    if (page === 0) {
        throw new ApiError(400, "Page number must be posative");
    }

    const productSubPipeline = [
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
                        else: { $divide: ["$sumOfReviewStar", "$totalReview"] },
                    },
                },
                createdAt: 1,
                discount: 1
            }
        }
    ]

    if (sortBy === "price") {
        productSubPipeline.push({
            $sort: {
                price: +sortType,
            },
        });
    }

    if (sortBy === "rating") {
        productSubPipeline.push({
            $sort: {
                rating: +sortType,
            },
        });
    }

    if (sortBy === "createdAt") {
        productSubPipeline.push({
            $sort: {
                createdAt: +sortType,
            },
        });
    }

    if(page && limit){
        productSubPipeline.push(
            {
                $limit: +page * +limit,
            },
            {
                $skip: +page * +limit - +limit,
            }
        );
    }

    const banner = await Banner.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(`${bannerid}`),
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "products",
                foreignField: "_id",
                as: "products",
                pipeline: productSubPipeline
            }
        }
    ])

    if(!banner[0]){
        throw new ApiError(404, "Banner not exist");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            banner[0],
            "Banner details fetched successfully."
        ))
})

export {
    getAllBanners,
    getBannerDetails
}