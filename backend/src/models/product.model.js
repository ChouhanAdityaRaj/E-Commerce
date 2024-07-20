import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import {MAX_DISCOUNT} from "../constants.js";


const productOtherImageSchema = new mongoose.Schema({
  image: {
    type: String
  }
})

const stocksSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    enum: ["XS", "S", "M", "L",  "XL", "XXl", "XXXL", "6", "7", "8", "9", "10", "11", "12"],
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Minimum quantity must be 1"],
  },
});

const productSchema = new mongoose.Schema({
    productName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    productImage: {
      type: String,
      required: true,
    },
    otherProductImages: [productOtherImageSchema],
    description: {
      type: String,
      required: true,
      index: true
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },
    stock: [stocksSchema],
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: [MAX_DISCOUNT, `Can't add more then ${MAX_DISCOUNT}% discount`],
    },
}, { timestamps: true });


productSchema.methods.addDiscount = async function(discount){
  if(this.discount){
    return null
  }

  this.discount = discount;
  const discountedAmount = ( this.price / 100 ) * discount;
  this.price = this.price - discountedAmount;
  await this.save();
  return {
    currentPrice: this.price,
    discount: this.discount
  };
};

productSchema.methods.removeDiscount = async function(){
  
  if(!this.discount){
    return null
  }

  this.price = this.price / ( 1 - ( this.discount / 100 ));
  this.discount = 0;
  await this.save();
  return {
    currentPrice: this.price,
    discount: this.discount
  };
};

export const Product = mongoose.model("Product", productSchema);
