import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        enum: [1,2,3,4,5]
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
}, {timestamps: true});

export const Review = mongoose.model("Review", reviewSchema);