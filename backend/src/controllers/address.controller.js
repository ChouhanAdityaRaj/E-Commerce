import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Address } from "../models/address.model.js";
import mongoose from "mongoose";

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

const getUserAddresses = asyncHandler(async (req, res) => { 

    const userAddresses = await Address.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(`${req.user._id}`)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            email: 1
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
        }
    ]);

    if(!userAddresses){
        throw new ApiError(500, "Problme while finding user addresses")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            userAddresses,
            "User addresses fetched successfully"
        ));
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

const deleteAddress = asyncHandler(async (req, res) => {
    const { addressid } = req.params;

    const address = await Address.findById(addressid);

    if(!address){
        throw new ApiError(404, "Address not exist");
    }

    if(address?.user.toString() !== req.user?._id.toString()){
        throw new ApiError(401, "Only creator can delete");
    } 

    const deletedAddress = await Address.findByIdAndDelete(addressid);

    if(!deleteAddress){
        throw new ApiError(500, "Problem while deleting address");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Address deleted successfully"
        ))
});

const getAddressByid = asyncHandler(async (req, res) => {
    const { addressid } = req.params;

    const address = await Address.findById(addressid);

    if(!address){
        throw new ApiError(404, "Address not exist");
    }

    if(address?.user.toString() !== req.user?._id.toString()){
        throw new ApiError(401, "Only creator can see");
    } 

    const addressInfo = await Address.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(`${addressid}`)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            email: 1
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
        }
    ]);

    if(!addAddress){
        throw new ApiError(500, "Problme while finding address")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            addressInfo[0],
            "Address fetched successfully"
        ));
});

export {
    addAddress,
    getUserAddresses,
    updateAddress,
    deleteAddress,
    getAddressByid
}