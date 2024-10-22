import mongoose from "mongoose";

const productsDetailsSchema = new mongoose.Schema({
    items: {
        type: Array,
        required: true
    },
    shippingCharge: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
})

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
        lowercase: true,
        trim: true,
        enum: ["pending", "on the way", "delivered", "cancelled"],
        default: "pending"
    },
    productsDetails: {
        type: productsDetailsSchema,
        required: true,
    },
    total: {
        type: Number,
    }
}, {timestamps: true});

export const Order = mongoose.model("Order", orderSchema);