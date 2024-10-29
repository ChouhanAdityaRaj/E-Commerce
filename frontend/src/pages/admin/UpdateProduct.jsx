import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import productService from "../../services/product";
import { ErrorMessage, MessageAlert, Loader } from "../../components";
import { apiHandler } from "../../utils";
import adminService from "../../services/admin";
import { useNavigate } from "react-router-dom";

function UpdateProduct() {
  const { productid } = useParams();
  const navigate = useNavigate();

  const {
    register: productDetailsRegister,
    handleSubmit: productDetailsHandleSubmit,
  } = useForm();

  const {
    register: productImageRegister,
    handleSubmit: productImageHandleSubmit,
  } = useForm();

  const {
    register: productOtherImagesRegister,
    handleSubmit: productOtherImagesHandleSubmit,
  } = useForm();

  const {
    register: productCategoryRegister,
    handleSubmit: productCategoryHandleSubmit,
  } = useForm();

  const {
    register: productStockRegister,
    handleSubmit: productStockHandleSubmit,
    reset: productStockReset,
  } = useForm();

  const {
    register: productDiscountRegister,
    handleSubmit: productDiscountHandleSubmit,
  } = useForm();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [isButtonDisable, setIsButtonDisable] = useState(false);
  const [category, setCategory] = useState([]);
  const [errorAlertMessage, setErrorAlertMessage] = useState("");
  const [responseAlertMessage, setResponseAlertMessage] = useState("");
  const [stock, setStock] = useState([]);

  useEffect(() => {
    (async () => {
      setError("");
      setLoading(true);

      const [response, error] = await apiHandler(
        productService.getProductById(productid)
      );

      if (response) {;
        setProduct(response.data);
        setStock(response.data.stock);
      }

      if (error) {
        setError(error);
      }

      const [categoryResponse, categoryError] = await apiHandler(
        productService.getAllCategories()
      );

      if (categoryResponse) {
        setCategory(categoryResponse.data);
      }

      setLoading(false);
    })();
  }, [reload]);

  const handleUpdateProductDetails = async ({
    productName,
    description,
    price,
  }) => {
    setLoading(true);
    const [response, error] = await apiHandler(
      adminService.updateProductDetails(product?._id, {
        productName,
        description,
        price,
      })
    );

    if (response) {
      setResponseAlertMessage(response.message);
      setReload(!reload);
    }

    if (error) {
      setErrorAlertMessage(error.message);
    }

    setLoading(false);
  };

  const handleProductImageUpdate = async ({ productImage }) => {
    setLoading(true);

    
    const formData = new FormData();

    formData.append("productImage", productImage[0]);

    const [response, error] = await apiHandler(
      adminService.updateProductImage(product?._id, formData)
    );

    if (response) {
      setResponseAlertMessage(response.message);
      setReload(!reload);
    }

    if (error) {
      setErrorAlertMessage(error.message);
    }

    setLoading(false);
  };

  const handleDeleteProductOtherImage = async (imgId) => {
    setLoading(true)
    
    const [response, error] = await apiHandler(
      adminService.deleteProductOtherImage(
        product?._id,
        [imgId]
      )
    );
    
    if (response) {
      setResponseAlertMessage(response.message);
      setReload(!reload);
    }
    
    if (error) {
      setErrorAlertMessage(error.message);
    }

    setLoading(false)
  }

  const handleProductOtherImages = async ({ productOtherImages }) => {
    setLoading(true);

      const formData = new FormData();

      for (const img of productOtherImages) {
        formData.append(`productOtherImages`, img);
      }

      const [response, error] = await apiHandler(
        adminService.addProductOtherImage(product?._id, formData)
      );

      if (response) {
        setResponseAlertMessage(response.message);
        setReload(!reload);
      }

      if (error) {
        setErrorAlertMessage(error.message);
      }

    setLoading(false);
  };

  const handleProductCategory = async ({ categoryid }) => {
    setLoading(true);

    const [response, error] = await apiHandler(
      adminService.updateProductCategory(product?._id, categoryid)
    );

    if (response) {
      setResponseAlertMessage(response.message);
      setReload(!reload);
    }

    if (error) {
      setErrorAlertMessage(error.message);
    }

    setLoading(false);
  };

  const addStockOption = () => {
    setStock((prev) => [...prev, { size: "", quantity: 0 }]);
  };

  const handleProductStock = async ({ stocks }) => {
    setLoading(true);

    const filteredStocks = stocks.filter(
      (stock) => !Number.isNaN(stock.quantity)
    );

    const [response, error] = await apiHandler(
      adminService.updateProductStocks(product?._id, filteredStocks)
    );

    if (response) {
      setResponseAlertMessage(response.message);
      setReload(!reload);
      productStockReset();
      setStock([]);
    }

    if (error) {
      setErrorAlertMessage(error.message);
    }

    setLoading(false);
  };

  const handleProductDiscount = async({discount}) => {
    setLoading(true);

    const [response, error] = await apiHandler(
      adminService.updateProductsDiscount(product?._id, {discount: +discount})
    );

    if (response) {
      setResponseAlertMessage(response.message);
      setTimeout(() => {
        navigate(`/admin/products`)
      }, 1200)
    }

    if (error) {
      setErrorAlertMessage(error.message);
    }

    setLoading(false);
  }

  const handleRemoveProductDiscount = async() => {
    setLoading(true);

    const [response, error] = await apiHandler(
      adminService.removeProductsDiscount(product?._id)
    );

    

    if (response) {
      setResponseAlertMessage(response.message);
      setTimeout(() => {
        navigate(`/admin/products`)
      }, 1200)
    }

    if (error) {
      setErrorAlertMessage(error.message);
    }

    setLoading(false);
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (loading) {
    return <Loader />;
  }

  if (product) {
    return (
      <div className="container mx-auto p-4 space-y-8">
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

        {/* Form 1: Update Product Name, Description, and Price */}
        <form
          onSubmit={productDetailsHandleSubmit(handleUpdateProductDetails)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Update Product Information
            </h2>
            <div>
              <label className="block text-sm">Product Name</label>
              <input
                type="text"
                defaultValue={product?.productName}
                {...productDetailsRegister("productName")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Description</label>
              <textarea
                defaultValue={product?.description}
                {...productDetailsRegister("description")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Price</label>
              <input
                type="number"
                defaultValue={Math.round(product?.price)}
                {...productDetailsRegister("price")}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-red-400 hover:bg-red-500  text-white py-2 px-4 rounded"
          >
            Save Product Info
          </button>
        </form>

        <hr />

        {/* Form 2: Update Image with Preview */}
        <form
          onSubmit={productImageHandleSubmit(handleProductImageUpdate)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Update Image</h2>
            <div>
              <img
                src={product?.productImage}
                alt="Previous Product"
                className="w-56 h-56 object-contain mb-2"
              />
              <input
                type="file"
                accept="image/*"
                {...productImageRegister("productImage")}
                className="block w-[30%] text-xl text-gray-900 border border-gray-300  cursor-pointer bg-gray-50"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded"
          >
            Save Image
          </button>
        </form>

        <hr />

        {/* Form 3: Add Multiple Images */}
        <div>
          <form
            onSubmit={productOtherImagesHandleSubmit(handleProductOtherImages)}
            className="space-y-6 "
          >
            <div className="flex  space-x-2">
              {product?.otherProductImages.length ? product?.otherProductImages.map((img, index) => (
                <div key={index} className="flex flex-col justify-center">
                  <img
                    src={img.image}
                    alt={`product-${index}`}
                    className="w-52 h-52 object-contain"
                  />
                  <button 
                    type="button"
                    className="ml-9 mt-3 rounded-md hover:bg-red-400 transition-colors duration-300 ease-in-out w-[60%] border borde-gray-200"
                    onClick={() => handleDeleteProductOtherImage(img._id)}
                  >
                    Remove
                  </button>
                </div>
              )): <p className="mb-7 ml-2 text-3xl">There is not images.</p>}
              </div>
              <div>
                <h2 className="text-xl font-semibold">Add Images</h2>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  {...productOtherImagesRegister("productOtherImages")}
                  className="block w-[30%] text-xl text-gray-900 border border-gray-300  cursor-pointer bg-gray-50 mt-4"
                />
              </div>
            <button
              type="submit"
              className="bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded"
            >
              Upload
            </button>
          </form>
        </div>

        <hr />

        {/* Form 4: Update Product Category */}
        <form
          onSubmit={productCategoryHandleSubmit(handleProductCategory)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Update Category</h2>
            <div>
              <label className="block text-sm">Category</label>
              <select
                {...productCategoryRegister("categoryid", {
                  required: true,
                })}
                className="w-full p-2 border rounded"
              >
                <option value={product.category._id} hidden>
                  {product.category.name}
                </option>

                {category?.map((option) => (
                  <option
                    key={option._id}
                    hidden={product.category._id === option._id}
                    value={option._id}
                  >
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded"
          >
            Save Category
          </button>
        </form>

        <hr />

        {/* Form 5: Update Stock */}
        <form
          onSubmit={productStockHandleSubmit(handleProductStock)}
          className="space-y-6"
        >
          <div>
            <label className="block mb-2 text-gray-600">Stock Options</label>
            {stock.map(({ size, quantity }, i) => (
              <div key={i} className="flex space-x-4 mb-4">
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  defaultValue={size}
                  placeholder="Size"
                  {...productStockRegister(`stocks[${i}].size`, {
                    setValueAs: (value) => value.toUpperCase(),
                  })}
                />
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Add more qunatity"
                  min="0"
                  {...productStockRegister(`stocks[${i}].quantity`, {
                    valueAsNumber: true,
                  })}
                />
                <div className="w-[20%] p-3 border rounded-lg text-center bg-indigo-300">
                  {quantity}
                </div>
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
          <button
            type="submit"
            className="bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded"
          >
            Save Stock
          </button>
        </form>

        {/* Form 6: Update Discount */}
        <form
          onSubmit={productDiscountHandleSubmit(handleProductDiscount)}
          className="space-y-6"
        >
            <h2 className="text-xl font-semibold">
              Update Product Discount
            </h2>
            <div>
              <label className="block text-sm">Product Discount (%)</label>
              <input
                type="number"
                defaultValue={product.discount}
                {...productDiscountRegister("discount")}
                className="w-full p-2 border rounded"
              />
              <label className="block mt-2 text-sm text-gray-500">If a discount already exists, remove it first before applying the new one.</label>
            </div>
          <button
            type="submit"
            className={`${product?.discount ? "bg-red-100 hover:bg-red-100" : "bg-red-400 hover:bg-red-500" }  text-white py-2 px-4 rounded`}
            disabled={product?.discount}
          >
            Save Discount
          </button>
          <button 
            className="ml-3 bg-indigo-400 hover:bg-indigo-500  text-white py-2 px-4 rounded"
            onClick={handleRemoveProductDiscount}
          >
            Remove Discount
          </button>
        </form>
      </div>
    );
  }
}

export default UpdateProduct;
