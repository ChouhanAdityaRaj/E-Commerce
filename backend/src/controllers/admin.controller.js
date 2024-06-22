import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const getAllUser = asyncHandler(async (req, res) => {
    const {page=1, limit=10, sortBy, sortType=1} = req.query;

    const pipeline = [];

    if(!(sortBy === "fullName" || sortBy === "createdAt")){
        throw new ApiError(400, "You can only sort by fullName or createdAt");
    }

    if(sortBy === "fullName"){
        pipeline.push(
            {
                $sort: {
                    fullName: +sortType
                }  
            },
        )
    }
    if(sortBy === "createdAt"){
        pipeline.push(
            {
                $sort: {
                    createdAt: +sortType
                }  
            },
        )
    }
    

    pipeline.push(
        {
            $limit: +page * +limit
        },
        {
            $skip: +page * +limit - +limit

        },
        {
            $project: {
                fullName: 1,
                email: 1,
                isAdmin: 1,
                createdAt: 1
            }
        }
    )

    const allUserInfo = await User.aggregate(pipeline);
    
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            allUserInfo,
            "All user fetched successfully"
    ));
});

export {
    getAllUser,
}