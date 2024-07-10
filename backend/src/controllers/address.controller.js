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

const updateAddress = asyncHandler(async (req, res) => {
    const { addressid } = req.params;

    const {mobileNumber, pinCode, state, city, address}  = req.body;

    if(!(mobileNumber || pinCode || state || city || address)){
        throw new ApiError(400, "Atleast one firld is required");
    }

    const oldAddress = await Address.findById(addressid);

    if(!oldAddress){
        throw new ApiError(404, "Address not exist");
    }

    if(oldAddress?.user.toString() !== req.user?._id.toString()){
        throw new ApiError(401, "Only creator can update");
    }

    const updateObject = {};

    for (const key of Object.keys(req.body)) {
        updateObject[key] = req.body[key];
    }


    const updatedAddress = await Address.findByIdAndUpdate(
        addressid,
        updateObject,
        {new: true}
    ) 

    if(!updateAddress){
        throw new ApiError(500, "Problem while updating address");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            updatedAddress,
            "Address updated successfully"
        ));
});

export {
    addAddress,
    updateAddress
}