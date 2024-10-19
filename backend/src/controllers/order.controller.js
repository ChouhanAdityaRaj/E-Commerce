import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Cart } from "../models/cart.model.js";
import { Address } from "../models/address.model.js";
import { Order } from "../models/order.model.js";

const createOrder = asyncHandler(async (req, res) => {
    const { cartid, addressid } = req.params;

    const cart = await Cart.findById(cartid);

    if(!cart){
        throw new ApiError(404, "Cart not exist");
    }


    const address = await Address.findById(addressid);

    if(!address){
        throw new ApiError(404, "Address not exist");
    }

    if(req.user?._id.toString() !== cart.user.toString()){
        throw new ApiError(401, "Invalid User")
    }
    

    if(req.user?._id.toString() !== address.user.toString()){
        throw new ApiError(401, "Invalid User")
    }

    if(!cart.items.length){
        throw new ApiError(400, "Cart is empty");
    }

    const order = await Order.create({
        user: req.user._id,
        address: address._id,
        productsDetails: cart?._id,
        total: cart.totalAmount
    })

    if(!order) {
        throw new ApiError(500, "Problem while placing order");
    }


    cart.items = [];
    await cart.save()

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {order},
            "Order plasced successfully"
        ));

})


export {
    createOrder
}