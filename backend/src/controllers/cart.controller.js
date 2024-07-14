import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

function isEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

const addToCart = asyncHandler(async (req, res) => {
    const { productid } = req.params;
    const { size, quantity } = req.body;

    const product = await Product.findById(productid);

    if(!product){
        throw new ApiError(404, "Product not exist");
    }

    const newItem = {
        product: productid,
        size,
        quantity
    }

    let cart = await Cart.findOne({user: req.user._id});

    if(cart){
        const isItemExist = cart.items.some(({product, size}) => isEqual({product, size}, {product: newItem.product, size: newItem.size}));

        if(isItemExist){
            throw new ApiError(409, "Item is already in your cart");
        }

        cart.items.push(newItem);

        await cart.save();
    }

    if(!cart){
        cart = await Cart.create({
            user: req.user._id,
            items: [newItem]
        })
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            cart,
            "Product successfully added to cart"
        ))
});

const updateCartItem = asyncHandler(async (req, res) => {
    const { cartid, itemid } = req.params;
    const { size, quantity } = req.body;

    if(!(size || quantity)){
        throw new ApiError(400, "At least one field is required")
    }


    const cart = await Cart.findById(cartid);

    if(!cart){
        throw new ApiError(404, "Cart not exist");
    }

    if(cart.user.toString() !== req.user._id.toString()){
        throw new ApiError(401, "Only creator can update");
    }


    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemid);
  
    if(itemIndex === -1){
        throw new ApiError(404, "Item not exist");
    }


    const isItemExist = cart.items.find((item) => isEqual({product: item.product, size: item.size}, {product: cart.items[itemIndex].product, size}));

    if(isItemExist){
        throw new ApiError(409, "Item is already in your cart");
    }
    
    

    for (const key of Object.keys(req.body)){
        cart.items[itemIndex][key] = req.body[key]
    }

    await cart.save();

    
    return res 
        .status(200)
        .json(new ApiResponse(
            200,
            cart,
            "Cart item updated successfully"
        ));
})

const removeCartItem = asyncHandler(async (req, res) => {
    const { cartid, itemid } = req.params;

    const cart = await Cart.findById(cartid);

    if(!cart){
        throw new ApiError(404, "Cart not exist");
    }

    if(cart.user.toString() !== req.user._id.toString()){
        throw new ApiError(401, "Only creator can update");
    }


    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemid);
  
    if(itemIndex === -1){
        throw new ApiError(404, "Item not exist");
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            cart,
            "Cart item removed successfully"
        ))
});

const getCartInfo = asyncHandler(async (req, res) => {
    const { cartid } = req.params;

    const cart = await Cart.findById(cartid);

    if(!cart){
        throw new ApiError(404, "Cart not exist");
    }

    if(cart.user.toString() !== req.user._id.toString()){
        throw new ApiError(401, "Only creator can update");
    }

    const cartInfo = await Cart.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(`${cartid}`)
            }
        },
        { 
            $unwind: "$items" 
        }, 
        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "items.product",
                pipeline: [
                    {
                        $project: {
                            productName: 1,
                            productImage: 1,
                            price: 1
                        }
                    }
                ]
            }
        },
        {   
            $unwind: "$items.product" 
        },
        { 
            $group: {
                _id: "$_id",
                user: { $first: "$user" },
                items: { 
                  $push: { 
                      product: "$items.product", 
                      size: "$items.size", 
                      quantity: "$items.quantity",
                      _id: "$items._id"
                    }
                },
                totalAmount:  {$first: "$totalAmount"},
            }
        }
    ]); 

    if(!cartInfo){
        throw new ApiError(500, "Problem while fetching cart information")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200, 
            cartInfo[0],
            "Cart information fetched successfully"
        ))
})


export {
    addToCart,
    updateCartItem,
    removeCartItem,
    getCartInfo
}