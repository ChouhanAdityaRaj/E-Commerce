import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";
import { Address } from "../models/address.model.js";
import { Order } from "../models/order.model.js";
import mongoose from "mongoose";

const createOrder = asyncHandler(async (req, res) => {
    const { cartid, addressid } = req.params;

    const cart = await Cart.findById(cartid);

    if (!cart) {
        throw new ApiError(404, "Cart not exist");
    }

    const address = await Address.findById(addressid);

    if (!address) {
        throw new ApiError(404, "Address not exist");
    }

    if (req.user?._id.toString() !== cart.user.toString()) {
        throw new ApiError(401, "Invalid User");
    }

    if (req.user?._id.toString() !== address.user.toString()) {
        throw new ApiError(401, "Invalid User");
    }

    if (!cart.items.length) {
        throw new ApiError(400, "Cart is empty");
    }

    const cartItems = [];

    for(const item of cart.items){
        
        const product = await Product.findById(item.product).select("-otherProductImages -category -stock -discount -updatedAt -__v");
        
        if(!product){
            throw new ApiError(500, "Problem while fetching product or Product not exist anymore");
        }

        cartItems.push({
            product,
            size: item.size,
            quantity: item.quantity
        })
    }

    const order = await Order.create({
        user: req.user._id,
        address: address._id,
        productsDetails: {
            items: cartItems,
            shippingCharge: cart?.shippingCharge,
            totalAmount: cart?.totalAmount,
        },
        total: cart.totalAmount,
    });

    if (!order) {
        throw new ApiError(500, "Problem while placing order");
    }

    cart.items = [];
    await cart.save();

    return res
        .status(200)
        .json(new ApiResponse(200, { order }, "Order plasced successfully"));
});

const getUserOrdersOverview = asyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(`${req.user._id}`),
            },
        },
    ]);

    if (!orders) {
        throw new ApiError(500, "Problem while fetching Orders");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "Orders Overview fetched successfully"));
});

const cancelOrder = asyncHandler(async (req, res) => {
    const { orderid } = req.params;

    const order = await Order.findById(orderid);

    if (!order) {
        throw new ApiError(404, "Order not exist.");
    }

    if (req.user?._id.toString() !== order.user.toString()) {
        throw new ApiError(401, "Invalid User.");
    }

    const currentDateTime = new Date();

    if (currentDateTime - order.createdAt > 24 * 60 * 60 * 1000) {
        throw new ApiError(
            409,
            "You can't cancel the order because the time limit has expired."
        );
    }

    const deletedOrder = await Order.findByIdAndDelete(orderid);

    if (!deletedOrder) {
        throw new ApiError(500, "Problem while canceling Order.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Order Canceled Successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
    const { orderid } = req.params;

    const order = await Order.findById(orderid);

    if (!order) {
        throw new ApiError(404, "Order not exist.");
    }

    if (req.user?._id.toString() !== order.user.toString()) {
        throw new ApiError(401, "Invalid User.");
    }
    
    const orderDetails  = await Order.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(`${orderid}`),
            },
        },
        {
            $lookup: {
                from: "addresses",
                localField: "address",
                foreignField: "_id",
                as: "address",
                pipeline: [
                    {
                        $project: {
                            mobileNumber: 1,
                            pinCode: 1,
                            state: 1,
                            city: 1,
                            address: 1
                        }
                    }
                ]
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
                        $project:{
                            fullName: 1,
                            email: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                address: { $first: "$address"},
                user: { $first: "$user"}
            },
        },
        {
            $project: {
                user: 1,
                address: 1,
                orderStatus: 1,
                productsDetails: 1,
                total: 1,
                createdAt: 1
            }
        }
    ]);
    

    if (!orderDetails) {
        throw new ApiError(500, "Problem while fetching order");
    }
    

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            orderDetails[0],
            "Order Details fetched successfully"
        ))
});

export { createOrder, getUserOrdersOverview, cancelOrder, getOrderById };
