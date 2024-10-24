import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    image: {
      type: String,
      required: true,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

export const Banner = mongoose.model("Banner", bannerSchema);