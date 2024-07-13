import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

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

export {
    addToCart,
    updateCartItem,
    removeCartItem
}