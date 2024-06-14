import {v2 as cloudinary} from "cloudinary";

const deleteFromCloudinary = async (imagePath) => {
    try {
        if(!imagePath) return null;

        const publicId = imagePath.split('/')[imagePath.split('/').length-1].replace('.jpg','')
    
        const response = await cloudinary.uploader.destroy(
            publicId, 
            {
                resource_type: 'image',
                folder: process.env.CLOUDINARY_FOLDER_NAME,
            }
        )

        return response;
    } catch (error) {
        return null;
    }
}

export {deleteFromCloudinary};