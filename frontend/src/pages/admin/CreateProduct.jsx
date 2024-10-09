import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader, MessageAlert } from "../../components";
import { useApi } from "../../hooks";
import productService from "../../services/product";
import adminService from "../../services/admin";
import { apiHandler } from "../../utils";
import { useNavigate } from "react-router-dom";

function CreateProduct() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [categoryResponse, categoryLoading, categoryError] = useApi(
    productService.getAllCategories()
  );

  const [stock, setStock] = useState(1);
  const [responseAlertMessage, setResponseAlertMessage] = useState("");
  const [errorAlertMessage, setErrorAlertMessage] = useState("");
  const [isButtonDisable, setIsButtonDisable] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isProdactCreating, setIsProductCreating] = useState(false);

  useEffect(() => {
    if (categoryResponse) {
      const options = categoryResponse.data.filter(
        (category) => category.name !== "uncategorized"
      );
      setCategoryOptions(options);
    }
  }, [categoryResponse]);

  const addStockOption = () => {
    setStock(stock + 1);
  };

  const handleCreateProduct = async ({
    productName,
    description,
    price,
    productImage,
    productOtherImages,
    stock,
    category,
  }) => {
    setIsButtonDisable(true);
    setIsProductCreating(true)

    const formData = new FormData();

    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("productImage", productImage[0]);

    stock.forEach((item, i) => {
      formData.append(`stock[${i}][size]`, item.size);
      formData.append(`stock[${i}][quantity]`, item.quantity);
    });

    for (const image of productOtherImages) {
      formData.append(`productOtherImages`, image);
    }

    const [response, error] = await apiHandler(
      adminService.addNewProduct(formData)
    );

    if (response) {
      setResponseAlertMessage(response.message);
      setTimeout(() => {
        navigate("/admin/products");
      }, 4000)
    }

    if (error) {
      setErrorAlertMessage(error.message);
    }

    setIsProductCreating(false)

    setIsButtonDisable(false);
  };

  if(isProdactCreating){
    return (
      <Loader/>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
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
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Add New Product
        </h2>
        <form
          onSubmit={handleSubmit(handleCreateProduct)}
          className="space-y-4"
          id="foo"
        >
          {/* Product Name */}
          <div>
            <label className="block mb-2 text-gray-600">Product Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter product name"
              {...register("productName", {
                required: true,
              })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-gray-600">Description</label>
            <textarea
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter product description"
              rows="4"
              {...register("description", {
                required: true,
              })}
            ></textarea>
          </div>

          {/* Main Image */}
          <div>
            <label className="block mb-2 text-gray-600">Main Image</label>
            <input
              type="file"
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              {...register("productImage", {
                required: true,
              })}
              accept="image/*"
            />
          </div>

          {/* Additional Images */}
          <div>
            <label className="block mb-2 text-gray-600">Other Images</label>
            <input
              type="file"
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              {...register("productOtherImages")}
              multiple
              accept="image/*"
            />
          </div>

          {/* Stock Options */}
          <div>
            <label className="block mb-2 text-gray-600">Stock Options</label>
            {Array.from({ length: stock }).map((_, i) => (
              <div key={i} className="flex space-x-4 mb-4">
                <input
                  type="text"
                  name="size"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Size"
                  {...register(`stock[${i}].size`, {
                    required: true,
                  })}
                />
                <input
                  type="number"
                  name="quantity"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Quantity"
                  min="0"
                  {...register(`stock[${i}].quantity`, {
                    required: true,
                  })}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addStockOption}
              className="text-blue-500 hover:text-blue-700 transition"
              disabled={isButtonDisable}
            >
              + Add More Size Option
            </button>
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 text-gray-600">Category</label>
            <select
              {...register("category")}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="" hidden>
                Choose Category
              </option>
              {categoryOptions &&
                categoryOptions.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block mb-2 text-gray-600">Price</label>
            <input
              type="number"
              name="price"
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter product price"
              min="0"
              step="0.01"
              {...register("price", {
                required: true,
              })}
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-red-400 text-white px-6 py-3 rounded-lg shadow hover:bg-red-500 transition-colors duration-500"
              disabled={isButtonDisable}
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;
