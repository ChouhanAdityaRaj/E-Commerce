import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Address } from "../models/address.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const createOrder = asyncHandler(async (req, res) => {
    const { cartId, addressId } = req.body;

    if (!cartId) {
        throw new ApiError("Cart id is required");
    }

    if (!addressId) {
        throw new ApiError("Address id is required");
    }

    const address = await Address.findById(addressId);

    if (!address) {
        throw new ApiError(404, "Address not exist");
    }

    if (req.user?._id.toString() !== address.user.toString()) {
        throw new ApiError(401, "Invalid User");
    }

    const cart = await Cart.findById(cartId);
    

    if (!cart) {
        throw new ApiError(404, "Cart not exist.");
    }

    if (cart.user.toString() !== req.user._id.toString()) {
        throw new ApiError(401, "Invalid user");
    }

    if (!cart.items.length) {
        throw new ApiError(400, "Cart is empty");
    }

    const options = {
        amount: Math.round(cart.totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    }
    
    console.log(options);
    
    const order = await instance.orders.create(options);




    if (!order) {
        throw new ApiError(500, "Problem while creating order");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            order,
            "Order created successfully"
        ))
});


const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, addressId, cartId } = req.body;


    if (!cartId) {
        throw new ApiError("Cart id is required");
    }

    if (!addressId) {
        throw new ApiError("Address id is required");
    }


    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

    if (generatedSignature !== razorpay_signature) {
        throw new ApiError(400, "Payment verification failed.")
    }

    // Creating Order
    const cart = await Cart.findById(cartId);

    const address = await Address.findById(addressId);

    const cartItems = [];

    for (const item of cart.items) {

        const product = await Product.findById(item.product).select("-otherProductImages -category -stock -discount -updatedAt -__v");

        if (!product) {
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
        .json(new ApiResponse(
            200,
            {},
            "Order Places Successfully"
        ))
});

export {
    createOrder,
    verifyPayment
}