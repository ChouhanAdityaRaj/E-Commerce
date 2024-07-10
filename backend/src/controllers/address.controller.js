import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import { Address } from "../models/address.model.js";

const addAddress = asyncHandler(async (req, res) => {
    const {mobileNumber, pinCode, state, city, address}  = req.body;

    const createdAddress = await Address.create({
        user: req.user?._id,
        mobileNumber,
        pinCode,
        state,
        city,
        address,
    })

    if(!createdAddress){
        throw new ApiError(400, "Problem while adding address");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            createdAddress,
            "Address added successfully"
        ))
});

export {
    addAddress
}