import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ["Pending", "On The Way", "Delivered", "Cancelled"],
        default: "Pending"
    },
    productsDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
    },
    total: {
        type: Number,
    }
}, {timestamps: true});

export const Order = mongoose.model("Order", orderSchema);