import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { useApi } from '../../hooks';
import productService from '../../services/product';
import adminService from '../../services/admin';
import { ErrorMessage, Loader, MessageAlert } from "../../components";
import { apiHandler } from '../../utils';
import { useNavigate } from 'react-router-dom';


function CreateBanner() {
    const { register, handleSubmit } = useForm();
    const [response, loading, error] = useApi(productService.getAllProducts());
    const navigate = useNavigate();

    const [responseAlertMessage, setResponseAlertMessage] = useState("");
    const [errorAlertMessage, setErrorAlertMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const onSubmit = async ({ title, image, isActive, products }) => {
        setIsLoading(true);

        if(!image[0]){
            setErrorAlertMessage("Image is required")
            setIsLoading(false)
            return 
        }

        const formData = new FormData();

        formData.append("title", title)
        formData.append("isActive", isActive)
        formData.append("bannerImage", image[0])
        
        products.forEach((id, i) => {
            formData.append(`products[${i}]`, id)
        })

        const [response, error] = await apiHandler(adminService.createBanner(formData));
        

        if (response) {
            navigate("/admin/banner")
        }

        if (error) {
            setErrorAlertMessage(error.message);
        }

        setIsLoading(false)
    };

    if (error) {
        return <ErrorMessage message={error.message} />;
    }

    if (loading || isLoading) {
        return <Loader />;
    }

    if (response) {
        return (
            <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
                {responseAlertMessage && (
                    <MessageAlert
                        message={responseAlertMessage}
                        isError={false}
                        handleMessage={() => setResponseAlertMessage("")}
                    />
                )}
                {errorAlertMessage && (
                    <MessageAlert
                        message={errorAlertMessage}
                        handleMessage={() => setErrorAlertMessage("")}
                    />
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            {...register("title")}
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("image")}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            {...register("isActive")}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </div>

                    {/* Multi-Select Products */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Products
                        </label>
                        <select
                            {...register("products")}
                            multiple
                            className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {response.data.map((product) => (
                                <option key={product._id} value={product._id}>
                                    {product.productName} - ₹{product.price} (Discount: {product.discount})
                                </option>
                            ))}
                        </select>
                    </div>


                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default CreateBanner