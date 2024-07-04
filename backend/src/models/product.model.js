import mongoose from "mongoose";

const productOtherImageSchema = new mongoose.Schema({
  image: {
    type: String
  }
})

const stocksSchema = new mongoose.Schema({
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
    productImage: {
      type: String,
      required: true,
    },
    otherProductImages: [productOtherImageSchema],
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      index: true
    },
    stock: [stocksSchema],
    discount: {
      type: Number,
      default: 0,
    },
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
