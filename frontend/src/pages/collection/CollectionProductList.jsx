import React, { useState } from "react";
import { Link, useSearchParams, useParams, useNavigate} from "react-router-dom";
import { useApi } from "../../hooks";
import productService from "../../services/product";
import { Loader, ErrorMessage } from "../../components";
import { LuIndianRupee } from "react-icons/lu";
import { FaStar, FaRegStar } from "react-icons/fa";

function CollectionProductList() {
    const { categoryid } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();


  const queryString = Object.fromEntries([...searchParams]);
  const sortOptions = ["New Arrivals", "Customer Rating", "Price Low To High", "Price High To Low"];


  const [filter, setFilter] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  
  const [response, loading, error] = useApi(productService.getCategoryById(categoryid, queryString));

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };


  const handleFilter = () => {
    toggleSidebar();

    let url = `/collections/${categoryid}?`

    switch(filter){
      case "New Arrivals":
       return navigate(`${url}sortBy=date&sortType=-1`)

      case "Customer Rating":
       return navigate(`${url}sortBy=rating&sortType=-1`)

      case "Price Low To High":
       return navigate(`${url}sortBy=price&sortType=1`)

      case "Price High To Low":
       return navigate(`${url}sortBy=price&sortType=-1`)
    }
  }

  if (error.message === "input must be a 24 character hex string, 12 byte Uint8Array, or an integer") {
    return <ErrorMessage message={"Invalid Product"} />;
  }
  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (loading) {
    return <Loader />;
  }

  if (response) {
    return (
      <div className="pt-7">

        {/* Filter */}
        <div className="relative">
          {/* Sidebar (shown when isOpen is true) */}
          <div
            className={`fixed top-0 right-0 h-full w-64 md:w-80 bg-white shadow-lg transform transition-transform ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ zIndex: 999 }}
          >
            {/* Close Button */}
            <button
              onClick={toggleSidebar}
              className="text-lg absolute top-4 right-4 text-gray-600"
            >
              &#x2715;
            </button>

            {/* Sidebar Content */}
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-bold">Filter & Sort</h2>

              {/* Sort By Options */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Sort By</h3>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option, index) => (
                    <button
                      onClick={() => setFilter(option)}
                      key={index}
                      className={`${filter === option ? "border border-black font-semibold" : "border border-gray-400 hover:bg-gray-100"} px-3 py-1  rounded-full text-sm `}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>


              {/* Done Button */}
              <button
                onClick={handleFilter}
                className="w-full py-3 bg-blue-900 text-white font-semibold rounded-full"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Overlay (visible when sidebar is open) */}
          {isOpen && (
            <div
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black opacity-50"
              style={{ zIndex: 998 }}
            />
          )}
        </div>

        {/* Top Section */}
        <div className="px-4 md:px-8 lg:px-16 py-8">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4">
            <span className="mx-1">Collection</span> /
            <span className="mx-1">{response?.data.name}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-6 ">{response?.data.name}</h1>

          {/* Filter & Sort */}
          <div className="flex justify-end">
            <button
              className="text-sm font-medium text-gray-600 hover:underline"
              onClick={toggleSidebar}
            >
              <span className="inline-block mr-2">&#x2630;</span> Filter & Sort
            </button>
          </div>
        </div>

        {/* Collection Product List */}
        <div className="w-full flex justify-center relative">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1 p-4 w-[100%] md:w-[90%] lg:w-[80%] ">
            {response?.data?.products.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="bg-white text-black flex flex-col h-[41vh] md:h-[37vh] xl:h-[90vh] rounded-sm overflow-hidden border"
              >
                {/* Product Image */}
                <div className="h-4/5 w-full">
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Product Details */}
                <div className="h-auto px-2 py-2 flex flex-col ">
                  <h2 className=" text-lg font-semibold my-1">
                    {product.productName}
                  </h2>
                  <h3 className="text-sm ">{product.description}</h3>
                  <p className="text-md my-2">
                    <LuIndianRupee className=" inline-block" />
                    {product.price}
                  </p>
                  {product.rating ? (
                    <p>
                      {Array.from({ length: product.rating }).map((_, i) => (
                        <FaStar key={i} className=" inline-block text-yellow-300 text-md" />
                      ))}
                      {Array.from({ length: 5 - product.rating }).map(
                        (_, i) => (
                          <FaRegStar key={i} className=" text-yellow-300 inline-block text-md" />
                        )
                      )}
                    </p>
                  ) : (
                    <p className="m-2"></p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default CollectionProductList;
