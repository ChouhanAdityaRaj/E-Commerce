import mongoose from "mongoose";

const reviewImageSchema = new mongoose.Schema({
    image: {
      type: String
    }
  })

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index:true
    },
    images: [reviewImageSchema],
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
        ref: "Product",
        index: true
    }
}, {timestamps: true});

export const Review = mongoose.model("Review", reviewSchema);