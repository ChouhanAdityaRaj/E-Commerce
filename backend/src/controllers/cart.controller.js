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

export {
    addToCart
}