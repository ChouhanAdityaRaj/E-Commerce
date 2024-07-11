import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";


const itemsSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    },
    size: {
        type: String,
        required: true,
        enum: ["XS", "S", "M", "L",  "XL", "XXl", "XXXL", "6", "7", "8", "9", "10", "11", "12"],
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        trim: true,
        min: [1, "Minimum quantity must be 1"],
        max: [10, "Maximum quantity is 10"],
        default: 1
    },
    totalPrice: {
        type: Number,
    }
});


const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    items: [itemsSchema],
    totalAmount: {
        type: Number,
    }
}, {timestamps: true});


itemsSchema.pre("save", async function(next) {

    const product = await Product.findById(this.product);

    if(!product){
        throw new ApiError(404, "Product not exist")
    }

    this.totalPrice = product.price * this.quantity;

    next()
});

cartSchema.pre("save", function(next){
    this.totalAmount = this.items.reduce((acc, item) => acc+item.totalPrice, 0);
    next()
});

export const Cart = mongoose.model("Cart", cartSchema);