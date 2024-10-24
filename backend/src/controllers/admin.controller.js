import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";
import { Review } from "../models/review.model.js";
import { Category } from "../models/category.model.js";
import { Banner } from "../models/banner.model.js";
import { Order } from "../models/order.model.js";
import mongoose from "mongoose";

const verifyIsAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not exist");
  }

  if (!user.isAdmin) {
    throw new ApiError(403, "Access Denied");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { isAdmin: true }, "Access Granted"));
});

// Admin User Controllers
const getAllUser = asyncHandler(async (req, res) => {
  const { page, limit, sortBy = "fullName", sortType = 1, search } = req.query;

  const pipeline = [];

  if (!(sortBy === "fullName" || sortBy === "createdAt")) {
    throw new ApiError(400, "You can only sort by fullName or createdAt");
  }

  if (search) {
    pipeline.push({
      $match: {
        fullName: new RegExp(`${search.split(" ").join("|")}`, "gi"),
      },
    });
  }

  if (sortBy === "fullName") {
    pipeline.push({
      $sort: {
        fullName: +sortType,
      },
    });
  }
  if (sortBy === "createdAt") {
    pipeline.push({
      $sort: {
        createdAt: +sortType,
      },
    });
  }

  if (limit && page) {
    pipeline.push(
      {
        $limit: +page * +limit,
      },
      {
        $skip: +page * +limit - +limit,
      }
    );
  }

  pipeline.push({
    $project: {
      fullName: 1,
      email: 1,
      createdAt: 1,
    },
  });

  const allUserInfo = await User.aggregate(pipeline);

  return res
    .status(200)
    .json(new ApiResponse(200, allUserInfo, "All user fetched successfully"));
});

// Admin Product Controllers
const addNewProduct = asyncHandler(async (req, res) => {
  const { productName, description, price, stock, category } = req.body;

  const isCategoryExist = await Category.findById(category);

  if (!isCategoryExist) {
    throw new ApiError(400, "Category not exist");
  }

  // Handling Product Image
  const productImageLocalPath =
    req?.files?.productImage?.length > 0
      ? req.files?.productImage[0]?.path
      : undefined;

  if (!productImageLocalPath) {
    throw new ApiError(400, "Product image is required");
  }

  const productImage = await uploadOnCloudinary(productImageLocalPath);

  if (!productImage) {
    throw new ApiError(500, "Problem while uploading product image");
  }

  //Handling Product Other Images
  const otherProductImagesFile =
    req.files?.productOtherImages?.length > 0
      ? req.files?.productOtherImages
      : undefined;

  let otherProductImages = [];

  if (otherProductImagesFile) {
    for (const img of otherProductImagesFile) {
      const uplodedImage = await uploadOnCloudinary(img.path);

      if (!uploadOnCloudinary) {
        throw new ApiError(500, "Problem while upload product other image");
      }

      otherProductImages.push({ image: uplodedImage?.url });
    }
  }

  // Create product in DB
  const product = await Product.create({
    productName,
    productImage: productImage?.url,
    otherProductImages,
    description,
    price,
    stock,
    category,
  });

  if (!product) {
    throw new ApiError(500, "Problem while add new product");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product added successfully"));
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const { productid } = req.params;
  const { productName, description, price } = req.body;

  if (!(productName || description || price)) {
    throw new ApiError(400, "Atleast one field is required");
  }

  const updateObject = {};

  for (const key of Object.keys(req.body)) {
    updateObject[key] = req.body[key];
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productid,
    updateObject,
    { new: true }
  );

  if (!updatedProduct) {
    throw new ApiError(500, "Problem while updating product details");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

const updateProductImage = asyncHandler(async (req, res) => {
  const { productid } = req.params;

  const productImageLocalPath = req.file ? req.file.path : undefined;

  if (!productImageLocalPath) {
    throw new ApiError(400, "Product image is required");
  }

  const product = await Product.findById(productid);

  if (!product) {
    throw new ApiError(404, "Product not exist");
  }

  const newProductImage = await uploadOnCloudinary(productImageLocalPath);

  if (!newProductImage) {
    throw new ApiError(500, "Problem while uploading product image");
  }

  const deletePreviousImage = await deleteFromCloudinary(product.productImage);

  if (!deletePreviousImage) {
    throw new ApiError(500, "Problem while deleting old product image");
  }

  product.productImage = newProductImage.url;
  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product image updated successfully"));
});

const addOtherProductImages = asyncHandler(async (req, res) => {
  const { productid } = req.params;
  const productOtherImagesFile =
    req?.files?.productOtherImages?.length > 0
      ? req.files.productOtherImages
      : undefined;

  if (!productOtherImagesFile) {
    throw new ApiError("Image is required");
  }

  const product = await Product.findById(productid);

  if (!product) {
    throw new ApiError(404, "Product not exist");
  }

  if (product.otherProductImages.length + productOtherImagesFile.length > 5) {
    throw new ApiError(
      400,
      `Don't have more than 5 review images. You already have ${product.otherProductImages.length} And upload ${productOtherImagesFile.length}`
    );
  }

  for (const img of productOtherImagesFile) {
    const uplodedImage = await uploadOnCloudinary(img.path);

    if (!uplodedImage) {
      throw new ApiError(
        500,
        "Problem while uploading product other image on cloudinary"
      );
    }

    product.otherProductImages.push({ image: uplodedImage.url });
  }

  await product.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, product, "Product other images uploded successfully")
    );
});

const deleteOtherProductImage = asyncHandler(async (req, res) => {
  const { productid } = req.params;
  const { idList } = req.body;

  if (idList?.length <= 0) {
    throw new ApiError(400, "id list is required");
  }

  const product = await Product.findById(productid);

  if (!product) {
    throw new ApiError(404, "Product not exist");
  }

  if (product.otherProductImages.length === 0) {
    throw new ApiError(404, "There is no product images");
  }

  for (const id of idList) {
    const index = product.otherProductImages.findIndex(
      (el) => el._id.toString() === id
    );

    if (index === -1) {
      throw new ApiError(400, "Image not found");
    }

    const image = product.otherProductImages[index];

    const deletedImage = await deleteFromCloudinary(image?.image);

    if (!deletedImage) {
      throw new ApiError(500, "Problem while deleting image");
    }

    product.otherProductImages.splice(index, 1);
  }

  await product.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, product, "Product other images deleted successfully")
    );
});

const updateStock = asyncHandler(async (req, res) => {
  const { productid } = req.params;
  const { stocks } = req.body;

  const product = await Product.findById(productid);

  if (!product) {
    throw new ApiError(404, "Product not exist");
  }

  for (const stock of stocks) {
    const index = product.stock.findIndex((el) => el.size === stock.size);

    if (index === -1) {
      product.stock.push(stock);
      continue;
    }

    if (product.stock[index].quantity + stock.quantity < 0) {
      throw new ApiError(400, "You can't decrease quantity less then 0");
    }

    product.stock[index].quantity += stock.quantity;
  }

  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product.stock, "Stock updated successfully"));
});

const updateProductCategory = asyncHandler(async (req, res) => {
  const { productid, categoryid } = req.params;

  const category = await Category.findById(categoryid);

  if (!category) {
    throw new ApiError(404, "Category not exist");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productid,
    {
      category: category?._id,
    },
    { new: true }
  );

  if (!updatedProduct) {
    throw new ApiError(404, "Product not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProduct,
        "Product category updated successfully"
      )
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productid } = req.params;

  const product = await Product.findById(productid);

  if (!product) {
    throw new ApiError(404, "Product not exist");
  }

  const deletedProductImage = await deleteFromCloudinary(product?.productImage);

  if (!deletedProductImage) {
    throw new ApiError(500, "Problem while deleting product image");
  }

  if (product.otherProductImages?.length > 0) {
    product.otherProductImages.forEach(async (img) => {
      const deletedotherProductImage = await deleteFromCloudinary(img?.image);

      if (!deletedotherProductImage) {
        throw new ApiError(500, "Problem while deleting product other image");
      }
    });
  }

  const deletedReview = await Review.deleteMany({ product: product._id });

  if (!deletedReview) {
    throw new ApiError(500, "Problem while deleting review");
  }

  const deletedProduct = await Product.findByIdAndDelete(productid);

  if (!deletedProduct) {
    throw new ApiError(500, "Problem while deleting product");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted successfully"));
});

const addDiscount = asyncHandler(async (req, res) => {
  const { productid } = req.params;
  const { discount } = req.body;

  const product = await Product.findById(productid);

  if (!product) {
    throw new ApiError(404, "Product not exist");
  }

  const addedDiscount = await product.addDiscount(discount);

  if (!addedDiscount) {
    throw new ApiError(400, "Discount is already there");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, addedDiscount, "Disscount added successfully"));
});

const removeDiscount = asyncHandler(async (req, res) => {
  const { productid } = req.params;

  const product = await Product.findById(productid);

  if (!product) {
    throw new ApiError(404, "Product not exist");
  }

  const removedDiscount = await product.removeDiscount();

  if (!removedDiscount) {
    throw new ApiError(400, "Discount is already 0");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, removedDiscount, "Disscount removed successfully")
    );
});

// Admin Category Controllers

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const categoryImageLocalPath = req.file ? req.file.path : undefined;

  if (!categoryImageLocalPath) {
    throw new ApiError(400, "Category image is required");
  }

  const isCategoryExist = await Category.findOne({ name });

  if (isCategoryExist) {
    throw new ApiError(409, "Category already exist with this name");
  }

  const categoryImage = await uploadOnCloudinary(categoryImageLocalPath);

  if (!categoryImage) {
    throw new ApiError(500, "Problem while uploading category image");
  }

  const newCategory = await Category.create({
    name,
    description,
    image: categoryImage.url,
  });

  if (!newCategory) {
    throw new ApiError(500, "Problem while creating category");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newCategory, "Category created successfully"));
});

const updateCategor = asyncHandler(async (req, res) => {
  const { categoryid } = req.params;
  const { name, description } = req.body;

  if (!(name || description)) {
    throw new ApiError(400, "At lest one field is required");
  }

  const category = await Category.findById(categoryid);

  if (!category) {
    throw new ApiError(404, "Category not exist");
  }

  if (category.name === "uncategorized") {
    throw new ApiError(401, "You can't delete this category");
  }

  const updateObject = {};

  for (const key of Object.keys(req.body)) {
    updateObject[key] = req.body[key];
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryid,
    updateObject,
    { new: true }
  );

  if (!updatedCategory) {
    throw new ApiError(500, "Problem while updating category");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCategory, "Category updated successfully")
    );
});

const updateCategoryImage = asyncHandler(async (req, res) => {
  const { categoryid } = req.params;

  const categoryImageLocalPath = req.file ? req.file.path : undefined;

  const category = await Category.findById(categoryid);

  if (!category) {
    throw new ApiError(404, "Category not exist");
  }

  if (!categoryImageLocalPath) {
    throw new ApiError(400, "Image is required");
  }

  const deletedImage = await deleteFromCloudinary(category.image);

  if (!deletedImage) {
    throw new ApiError(500, "Problem while deleteing old category image");
  }

  const newCategoryImage = await uploadOnCloudinary(categoryImageLocalPath);

  if (!newCategoryImage) {
    throw new ApiError(500, "Problem while uploading new category image");
  }

  category.image = newCategoryImage.url;
  const updatedCategory = await category.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCategory, "Category Updated Successfully")
    );
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryid, newCategoryid = null } = req.params;

  const category = await Category.findById(categoryid);

  if (!category) {
    throw new ApiError(404, "Category not exist");
  }

  if (category.name === "uncategorized") {
    throw new ApiError(401, "You can't delete this category");
  }

  const newCategory = await Category.findById(newCategoryid);

  if (newCategory) {
    const updateProductCategory = await Product.updateMany(
      { category: categoryid },
      {
        category: newCategory?._id,
      },
      { new: true }
    );

    if (!updateProductCategory) {
      throw new ApiError(500, "Problem changing product category");
    }
  }

  if (!newCategory) {
    const defaultCategory = await Category.findOne({ name: "uncategorized" });

    const updateProductCategory = await Product.updateMany(
      { category: categoryid },
      {
        category: defaultCategory._id,
      },
      { new: true }
    );

    if (!updateProductCategory) {
      throw new ApiError(500, "Problem changing product category");
    }
  }

  const deletedCategory = await Category.findByIdAndDelete(categoryid);

  if (!deletedCategory) {
    throw new ApiError(500, "Problem while deleting category");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleated successfully"));
});

// Admin order Controllers

const getAllOrders = asyncHandler(async (req, res) => {
  const { page, limit, sortBy="createdAt", sortType = -1 } = req.query;

  const pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              fullName: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "addresses",
        localField: "address",
        foreignField: "_id",
        as: "address",
        pipeline: [
          {
            $project: {
              state: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        user: { $first: "$user" },
        address: { $first: "$address" },
      },
    },
  ];

  if (sortBy === "createdAt") {
    pipeline.push({
      $sort: {
        createdAt: +sortType,
      },
    });
  }

  if(limit && page){
    pipeline.push(
    {
      $limit: +page * +limit,
    },
    {
      $skip: +page * +limit - +limit,
    }
  );
}

  const orders = await Order.aggregate(pipeline);

  if (!orders) {
    throw new ApiError(500, "Problem while fetching orders");
  }

  if (!orders.length) {
    throw new ApiError(404, `There is no orders on this page`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
  const { orderid } = req.params;

  const order = await Order.findById(orderid);

  if (!order) {
    throw new ApiError(404, "Order not exist.");
  }

  const orderDetails = await Order.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(`${orderid}`),
      },
    },
    {
      $lookup: {
        from: "addresses",
        localField: "address",
        foreignField: "_id",
        as: "address",
        pipeline: [
          {
            $project: {
              mobileNumber: 1,
              pinCode: 1,
              state: 1,
              city: 1,
              address: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              fullName: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        address: { $first: "$address" },
        user: { $first: "$user" },
      },
    },
    {
      $project: {
        user: 1,
        address: 1,
        orderStatus: 1,
        productsDetails: 1,
        total: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!orderDetails) {
    throw new ApiError(500, "Problem while fetching order");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        orderDetails[0],
        "Order fetched successfully"
      )
    );
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderid } = req.params;
  const { status } = req.body;

  const updatedOrder = await Order.findByIdAndUpdate(
    orderid,
    {
      orderStatus: status
    },
    { new: true }
  );

  if (!updatedOrder) {
    throw new ApiError(404, "Order not exist.");
  }

  return res
    .status(200)
    .json(new ApiResponse(
      200,
      updatedOrder,
      "Order status updated successfully"
    ))
})

//Admin Banner Controller
const createBanner = asyncHandler(async (req, res) => {
  const {title, isActive, products} =  req.body;

  if(!title?.trim()){
    throw new ApiError(400, "Title is required")
  }

  if(!products?.length){
    throw new ApiError(400, "Product is required")
  }

  const bannerImageLocalPath = req.file ? req.file?.path : undefined;

  if (!bannerImageLocalPath) {
    throw new ApiError(400, "Banner image is required");
  }

  const bannerImage = await uploadOnCloudinary(bannerImageLocalPath);

  if (!bannerImage) {
    throw new ApiError(500, "Problem while uploading product image");
  }

  const banner = await Banner.create({
    title,
    isActive,
    image: bannerImage?.url,
    products
  })

  if(!banner){
    throw new ApiError(500, "Pronblem whiel creating banner");
  }

  return res
    .status(200)
    .json(new ApiResponse(
      200,
      banner,
      "Banner created successfully"
    ));
})

const deleteBanner = asyncHandler(async (req, res) => {
  const { bannerid } = req.params;

  const banner = await Banner.findById(bannerid);

  if(!banner){
    throw new ApiError(404, "Banner not exist");
  }

  const deletedImage = await deleteFromCloudinary(banner.image);

  if(!deletedImage){
    throw new ApiError(500, "Problem while deleting banner image");
  }

  const deletedBanner = await Banner.findByIdAndDelete(bannerid);

  if(!deletedBanner){
    throw new ApiError(500, "Problem while deleting banner.");
  }

  return res
    .status(200)
    .json(new ApiResponse(
      200,
      {},
      "Banner deleted successfully."
    ))
})

export {
  verifyIsAdmin,

  // User exports
  getAllUser,

  //Product exports
  addNewProduct,
  updateProductDetails,
  updateProductImage,
  addOtherProductImages,
  deleteOtherProductImage,
  updateStock,
  updateProductCategory,
  addDiscount,
  removeDiscount,
  deleteProduct,

  //Category exports
  createCategory,
  updateCategor,
  updateCategoryImage,
  deleteCategory,

  //Order exports
  getAllOrders,
  getOrderById,
  updateOrderStatus,

  //Banner exports
  createBanner,
  deleteBanner
};
