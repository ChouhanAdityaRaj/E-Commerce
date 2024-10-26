import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { apiHandler } from "../../utils";
import productService from "../../services/product";
import adminService from "../../services/admin"
import { Loader, ErrorMessage, MessageAlert } from "../../components";
import { useForm } from 'react-hook-form';
import product from '../../services/product';

function UpdateBanner() {
  const { bannerid } = useParams();
  const { register: bannerDetailsRegister, handleSubmit: bannerDetailsHandleSubmit } = useForm();
  const { register: bannerImageRegister, handleSubmit: bannerImageHandleSubmit } = useForm();
  const { register: bannerProductsRegister, handleSubmit: bannerProductsHandleSubmit } = useForm();

  const [banner, setBanner] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState("");
  const [responseAlertMessage, setResponseAlertMessage] = useState("");
  const [otherProducts, setOtherProducts] = useState([]);


  useEffect(() => {
    (async () => {
      setError("");
      setLoading(true);

      const [response, error] = await apiHandler(productService.getBannerDetails(bannerid, {}));

      if (response) {
        setBanner(response.data);
      }

      if (error) {
        setError(error);
      }


      const [producstsResponse, productsError] = await apiHandler(productService.getAllProducts());

      if (producstsResponse) {
        const bannerProductsIds = response.data.products.map((product) => product._id);

        const products = producstsResponse.data?.filter((product) => !bannerProductsIds.includes(product._id));

        setOtherProducts(products)
      }

      if (productsError) {
        setError(productsError);
      }
      setLoading(false)

    })()
  }, [reload])



  const handleUpdateBannerDetails = async ({ title, isActive }) => {
    setLoading(true);

    const activeStatus = isActive === "true" ? true : false;

    const [response, error] = await apiHandler(
      adminService.updateBannerDetails(bannerid, {title, isActive: activeStatus})
    );

    if (response) {
      setResponseAlertMessage(response.message);
      setReload(!reload)
    }

    if (error) {
      setErrorAlertMessage(error.message);
    }

    setLoading(false);

  };

  const handleUpdateBannerImage = async ({ image }) => {
    setLoading(true);

    const formData = new FormData();

    formData.append("bannerImage", image[0])


    const [response, error] = await apiHandler(
      adminService.updateBannerImage(bannerid, formData)
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

  const handleAddProductsToBanner= async ({ products }) => {
    setLoading(true);

    const [response, error] = await apiHandler(
      adminService.addProductsToBanner(bannerid, {products})
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

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (loading) {
    return <Loader />;
  }

  if (banner) {
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

        <form
          onSubmit={bannerDetailsHandleSubmit(handleUpdateBannerDetails)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Update Banner Details
            </h2>
            <div>
              <label className="block text-sm">Title</label>
              <input
                type="text"
                defaultValue={banner?.title}
                {...bannerDetailsRegister("title")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actice Status
              </label>
              <select
                {...bannerDetailsRegister("isActive")}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={banner.isActive} hidden>{banner.isActive ? "True" : "False"}</option>
                <option hidden={banner.isActive === true} value={true}>True</option>
                <option hidden={banner.isActive === false} value={false}>False</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="bg-red-400 hover:bg-red-500  text-white py-2 px-4 rounded"
          >
            Save Banner Details
          </button>
        </form>
        <hr />

        <form
          onSubmit={bannerImageHandleSubmit(handleUpdateBannerImage)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Update Banner Image</h2>
            <div>
              <img
                src={banner?.image}
                alt="Previous Product"
                className="w-56 h-56 object-contain mb-2"
              />
              <input
                type="file"
                accept="image/*"
                {...bannerImageRegister("image")}
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

        <form onSubmit={bannerProductsHandleSubmit(handleAddProductsToBanner)} className='flex flex-col items-start'>
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-2">
              Select Products
            </label>
            {otherProducts.length ? (<select
              {...bannerProductsRegister("products")}
              multiple
              className="w-fit h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {otherProducts.map((product) => (
                <option className='bg-gray-50 my-1 border border-gray-200 w-full text-xl' key={product._id} value={product._id}>
                  {product.productName} - ₹{product.price} (Discount: {product.discount})
                </option>
              ))}
            </select>): (<p>There is no more products.</p>)}
          </div>

          <button
            type="submit"
            className={`bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded mt-3 ${ !otherProducts.length && "bg-red-200"}`}
            disabled={!otherProducts.length}
          >
            Add Selected Products 
          </button>

          <div className="bg-gray-50 flex flex-col items-center mt-5">
          <label className="w-full block text-xl text-start font-medium text-gray-700 mb-2">
              Previously Selected Products
            </label>
            <ul className="w-full max-w-md bg-white shadow-lg flex rounded-lg p-6 space-y-4">
              {banner.products.map((product) => (
                <li
                  key={product._id}
                  className=" w-full flex justify-between items-center p-4 border-r last:border-none"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{product.productName}</h2>
                    <p className="text-gray-600">
                      Price: <span className="font-bold">₹{product.price}</span>
                    </p>
                    <p className="text-gray-600">
                      Discount: <span className="font-bold">{product.discount}%</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>

          
          </div>
        </form>
      </div>
    )
  }
}

export default UpdateBanner;