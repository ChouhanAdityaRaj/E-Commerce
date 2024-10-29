import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../hooks";
import productService from "../../services/product";
import userService from "../../services/user";
import { ErrorMessage, Loader, MessageAlert, ReviewList } from "../../components";
import { FaStar, FaRegStar } from "react-icons/fa";
import { LuIndianRupee } from "react-icons/lu";
import { apiHandler } from "../../utils";

function ProductDetail() {
  const { productid } = useParams();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState();
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [alert, setAlert] = useState(null);
  const [isAddToCartActive, setIsAddToCartActive] = useState(false);

  const sizes = ["S", "M", "L", "XL", "XXL", "XXXl"];

  const [response, loading, error] = useApi(
    productService.getProductById(productid)
  );

  useEffect(() => {
    if (response) {
      setMainImage(response.data.productImage);
    }
  }, [response]);

  const alertMessageHandler = () => {
    setAlert(null);
  };

  const addToCartHandler = async () => {
    setAlert(null);
    setIsAddToCartActive(true);



    const [response, error] = await apiHandler(
      userService.addToCart(productid, { size: selectedSize, quantity })
    );



    if (response) {
      setAlert({
        isError: false,
        message: "Your product successfully added to cart",
      });
    }

    if (error?.statusCode === 401) {
      navigate("/login");
    }

    if (error) {
      setAlert({ message: error.message });
    }

    setTimeout(() => {
      setAlert(null);
    }, 6000);

    setIsAddToCartActive(false);
  };


  

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (loading) {
    return <Loader />;
  }

  if (response) {
    const product = response.data;

    const avilableSizes = product.stock.map((stock) =>
      stock.size && stock.quantity ? stock.size : null
    );

    return (
      <div className="container mx-auto pt-16 px-4">
        {/* Alert Message */}
        {alert && (
          <MessageAlert
            message={alert?.message}
            handleMessage={alertMessageHandler}
            isError={alert?.isError}
          />
        )}

        {/* Product Details */}
        <div className="flex flex-col xl:flex-row items-start lg:space-x-10 m-2">
          {/* Left - Image Gallery */}
          <div className="w-full xl:w-1/2 flex flex-col justify-center h-full">
            <div className="relative self-center mb-4 w-full xl:w-[95%] h-[40vh] md:h-[60vh] lg:h-[80vh] xl:h-[93vh]">
              <img
                className="w-full h-full object-contain rounded-xl"
                src={mainImage}
                alt={product.productName}
              />
            </div>

            {/* Thumbnail images */}
            <div className="flex justify-center space-x-2 h-[10vh] lg:h-[15vh]">
              <img
                className="w-1/5 h-auto object-cover rounded-xl"
                src={product.productImage}
                alt={`Thumbnail 1`}
                onClick={() => setMainImage(product.productImage)}
              />
              {product.otherProductImages?.map((image, i) => (
                <img
                  key={image._id}
                  className="w-1/5 h-auto object-cover rounded-md"
                  src={image.image}
                  alt={`Thumbnail ${i + 1}`}
                  onClick={() => setMainImage(image.image)}
                />
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="w-full xl:w-1/2 space-y-4 lg:space-y-12 xl:space-y-6 my-10 xl:mt-0 ">
            <h1 className="text-4xl md:text-4xl lg:text-7xl xl:text-5xl font-bold">
              {product.productName}
            </h1>

            {/* Description */}
            <p className="text-gray-700 text-lg md:text-lg lg:text-4xl  xl:text-2xl ">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center">
              <span className="text-yellow-500">
                {product.rating ? (
                  <p>
                    {Array.from({ length: product.rating }).map((_, i) => (
                      <FaStar
                        key={i}
                        className="inline-block text-yellow-300 text-2xl md:text-2xl lg:text-5xl  xl:text-2xl"
                      />
                    ))}
                    {Array.from({ length: 5 - product.rating }).map((_, i) => (
                      <FaRegStar
                        key={i}
                        className="text-yellow-300 inline-block text-2xl md:text-2xl lg:text-5xl  xl:text-2xl"
                      />
                    ))}
                  </p>
                ) : (
                  <p className="m-2"></p>
                )}
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl md:text-3xl lg:text-6xl  xl:text-4xl font-semibold flex items-center">
              <LuIndianRupee className="inline-block text-3xl md:text-2xl  xl:text-4xl lg:text-6xl " />
              {product.price}
            </div>

            <hr />

            {/* Available Sizes */}
            <div className="py-5">
              <label className="block font-semibold mb-2 text-xl lg:text-4xl xl:text-xl">
                Available Size
              </label>
              <div className="w-[95%] h-[6vh] lg:h-[8vh] xl:h-[7vh]  flex space-x-2 lg:space-x-3">
                {sizes.map((size, i) => (
                  <button
                    key={i}
                    disabled={!avilableSizes.includes(size)}
                    className={`border w-full xl:w-fit  text-sm md:text-xl lg:text-4xl xl:text-2xl ${
                      selectedSize === size ? "bg-yellow-200" : ""
                    } ${
                      !avilableSizes.includes(size)
                        ? "bg-gray-300 opacity-50"
                        : ""
                    } border-gray-300 rounded px-4 py-2`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <hr />

            {/* Quantity Selector */}
            <div className="flex flex-col md:flex-row items-start space-x-4 py-5 w-full ">
              <label className="block font-semibold mb-2 text-lg lg:text-4xl xl:text-xl">
                Quantity
              </label>
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  className="px-4 w-[10vw] h-[5vh] lg:h-[7vh] xl:w-[3vw] xl:h-[3vh] text-2xl md:text-4xl lg:text-6xl xl:text-3xl"
                  onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                  disabled={!avilableSizes.length}
                >
                  -
                </button>
                <input
                  type="text"
                  value={avilableSizes ? quantity : 0}
                  className="w-[12vw] xl:w-[3vw] xl:h-[8vh] text-center border-l border-r border-gray-300 h-10 md:h-16 text-xl md:text-4xl lg:text-4xl  xl:text-2xl"
                  readOnly
                />
                <button
                  className="px-4 w-[10vw] h-[5vh] lg:h-[7vh] xl:w-[3vw] xl:h-[3vh] text-2xl md:text-4xl lg:text-6xl xl:text-3xl"
                  onClick={() => setQuantity(quantity < 10 ? quantity + 1 : 10)}
                  disabled={!avilableSizes.length}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="w-[95%] h-20vh flex justify-center">
              <button
                className=" w-full h-[6vh] lg:h-[8vh] xl:w-[25vw] bg-black rounded-full text-white text-lg md:text-2xl px-4 py-2"
                disabled={!avilableSizes.length || isAddToCartActive}
                onClick={addToCartHandler}
              >
                {avilableSizes.length ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>


        {/* Product Reviews */}
        {/* {product.rating && (<ReviewList productid={product._id} limit={5} page={1} moreReviewButton={true}/>)} */}
        <ReviewList productid={product._id} limit={5} page={1} moreReviewButton={true}/>
        
      </div>
    );
  }
}

export default ProductDetail;
