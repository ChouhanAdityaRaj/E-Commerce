import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary} from "../utils/uploadOnCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";
import fs from "fs";
import mongoose, { mongo } from "mongoose";

const getAllUser = asyncHandler(async (req, res) => {
    const {page=1, limit=10, sortBy, sortType=1} = req.query;

    const pipeline = [];

    if(!(sortBy === "fullName" || sortBy === "createdAt")){
        throw new ApiError(400, "You can only sort by fullName or createdAt");
    }

    if(sortBy === "fullName"){
        pipeline.push(
            {
                $sort: {
                    fullName: +sortType
                }  
            },
        )
    }
    if(sortBy === "createdAt"){
        pipeline.push(
            {
                $sort: {
                    createdAt: +sortType
                }  
            },
        )
    }
    

    pipeline.push(
        {
            $limit: +page * +limit
        },
        {
            $skip: +page * +limit - +limit

        },
        {
            $project: {
                fullName: 1,
                email: 1,
                isAdmin: 1,
                createdAt: 1
            }
        }
    )

    const allUserInfo = await User.aggregate(pipeline);
    
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            allUserInfo,
            "All user fetched successfully"
    ));
});


// Admin Product Controllers
const addNewProduct = asyncHandler(async (req, res) => {
    const {productName, description, price, stock} = req.body;


    // Handling Product Image 
    const productImageLocalPath = req?.files?.productImage?.length > 0 ? req.files?.productImage[0]?.path : undefined ;

    if(!productImageLocalPath){
        throw new ApiError(400, "Product image is required");
    }
    
    const productImage = await uploadOnCloudinary(productImageLocalPath);
    
    if(!productImage){
        throw new ApiError(500, "Problem while uploading product image");
    }
    
    
    //Handling Product Other Images    
    const otherProductImagesFile = req.files?.productOtherImages?.length > 0 ? req.files?.productOtherImages : undefined;

    let otherProductImages = [];

    if(otherProductImagesFile){
        for (const img of otherProductImagesFile) {
            const uplodedImage = await uploadOnCloudinary(img.path);

            if(!uploadOnCloudinary){
                throw new ApiError(500, "Problem while upload product other image");
            }

            otherProductImages.push({image: uplodedImage?.url});
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
    });


    if(!product){
        throw new ApiError(500, "Problem while add new product");
    }
    
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            product,
            "Product added successfully"
        ))
});

const updateProductDetails = asyncHandler(async (req, res) => {
    const { productid } = req.params;
    const { productName, description, price } = req.body;

    if(!(productName || description || price)){
        throw new ApiError(400, "Atleast one field is required")
    }

    const updates = {}; 

    for(const val of ["productName", "description", "price"]){
        if(req.body[val] !== undefined){
            updates[val] = req.body[val]; 
        }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productid,
        updates,
        {new: true}
    );

    if(!updatedProduct){
         throw new ApiError(500, "Problem while updating product details");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            updatedProduct,
            "Product updated successfully"
        ))

});

const updateProductImage = asyncHandler(async (req, res) => {
    const { productid } = req.params;

    const productImageLocalPath = req.file ? req.file.path : undefined;

    if(!productImageLocalPath){
        throw new ApiError(400, "Product image is required");
    }

    const product = await Product.findById(productid);

    if(!product){
        fs.unlinkSync(productImageLocalPath);
        throw new ApiError(404, "Product not exist");
    }

    
    const newProductImage = await uploadOnCloudinary(productImageLocalPath);
    
    if(!newProductImage){
        throw new ApiError(500, "Problem while uploading product image")
    }
    
    const deletePreviousImage = await deleteFromCloudinary(product.productImage);

    if(!deletePreviousImage){
        throw new ApiError(500, "Problem while deleting old product image");
    }


    product.productImage = newProductImage.url;
    await product.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            product,
            "Product image updated successfully"
        ));
});

const addOtherProductImages = asyncHandler(async (req, res) => {
    const { productid } = req.params;
    const productOtherImagesFile = req?.files?.productOtherImages?.length > 0 ? req.files.productOtherImages : undefined;

    if(!productOtherImagesFile){
        throw new ApiError("Image is required")
    }

    const product = await Product.findById(productid);

    if(!product){
        productOtherImagesFile.forEach((img) => {
            fs.unlinkSync(img.path);
        });
        throw new ApiError(404, "Product not exist");
    }

    if((product.otherProductImages.length + productOtherImagesFile.length) > 5){
        productOtherImagesFile.forEach((img) => {
            fs.unlinkSync(img.path);
        });
        throw new ApiError(400, "Don't have more than 5 product other images")
    }

    for(const img of productOtherImagesFile){
        const uplodedImage = await uploadOnCloudinary(img.path);

        if(!uplodedImage){
            throw new ApiError(500, "Problem while uploading product other image on cloudinary");
        }

        product.otherProductImages.push({image: uplodedImage.url});
    };

    await product.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            product,
            "Product other images uploded successfully"
        ));
}); 

const deleteOtherProductImage = asyncHandler(async (req, res) => {
    const {productid} = req.params;
    const { idList } = req.body;

    if(idList?.length <= 0){
        throw new ApiError(400, "id list is required")
    }

    const product = await Product.findById(productid);

    if(!product){
        throw new ApiError(404, "Product not exist");
    }

    for(const id of idList){
        const index = product.otherProductImages.findIndex(el =>el._id.toString() === id);

        if(index === -1){
            throw new ApiError(400, "Image not found")
        }

        const image = product.otherProductImages[index];
        
        const deletedImage = await deleteFromCloudinary(image?.image);

        if(!deletedImage){
            throw new ApiError(500, "Problem while deleting image")
        }

        product.otherProductImages.splice(index, 1);
    }

    await product.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            product,
            "Product other images deleted successfully"
        ));
});

export {
    getAllUser,
    addNewProduct,
    updateProductDetails,
    updateProductImage,
    addOtherProductImages,
    deleteOtherProductImage
}