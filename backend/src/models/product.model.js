import mongoose from "mongoose";

const quantitySchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const productSchema = new mongoose.Schema({
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    otherImage: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      index: true
    },
    quantity: [quantitySchema],
    discount: {
      type: Number,
      default: 0,
    },
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
