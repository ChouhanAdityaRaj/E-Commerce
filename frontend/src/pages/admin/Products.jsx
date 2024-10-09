import React, { useEffect, useState } from "react";
import { FaSearch, FaStar, FaRegStar, FaEdit, FaTrash } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { apiHandler } from "../../utils";
import productService from "../../services/product";
import { ErrorMessage, Loader } from "../../components";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function Products() {
  const sortOptions = [
    "New Arrivals",
    "Customer Rating",
    "Price Low To High",
    "Price High To Low",
  ];
  const { register, handleSubmit, reset } = useForm();

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [isButtonDisable, setIsButtonDisable] = useState(false);
  const [sortByFilter, setSortByFilter] = useState("");
  const [sortTypeFilter, setSortTypeFilter] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    (async () => {
      setError("");
      setLoading(true);
      const [response, error] = await apiHandler(
        productService.searchProducts({
          search: searchQuery,
          sortBy: sortByFilter,
          sortType: sortTypeFilter,
        })
      );

      if (response) {
        setProducts(response.data);
      }

      if (error) {
        setError(error.message);
      }
      setLoading(false);
    })();
  }, [reload]);

  const handleFilter = () => {
    setLoading(true);
    setIsOpen(false);

    if (filter === "New Arrivals") {
      setSortByFilter("createdAt");
      setSortTypeFilter(-1);
    }
    if (filter === "Customer Rating") {
      setSortByFilter("rating");
      setSortTypeFilter(-1);
    }
    if (filter === "Price Low To High") {
      setSortByFilter("price");
      setSortTypeFilter(1);
    }
    if (filter === "Price High To Low") {
      setSortByFilter("price");
      setSortTypeFilter(-1);
    }
    setReload(!reload);
    setLoading(false);
  };

  const handleSearchProduct = ({ query }) => {
    setLoading(true);

    setSearchQuery(query);
    setReload(!reload);
    setLoading(false);
  };

  const DateTimeFormate = (isoString) => {
    const date = new Date(isoString);

    const day = date.getDate().toString().padStart(2, "0"); // Day (2 digits)
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month (2 digits, +1 because months are zero-indexed)
    const year = date.getFullYear(); // Year (4 digits)

    // Extracting time components
    const hours = date.getHours().toString().padStart(2, "0"); // Hours (2 digits)
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Minutes (2 digits)
    const seconds = date.getSeconds().toString().padStart(2, "0"); // Seconds (2 digits)

    // Formatting the date and time
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (loading) {
    return <Loader />;
  }

  if (products) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Top Section with Add Button and Search Bar */}
        <div className="mb-6 flex justify-between items-center">
          {/* Add New Product Button */}
          <Link
            to={"create-product"}
            className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            Add New Product
          </Link>

          {/* Search Bar */}
          {products.length > 0 && (
            <form
              onSubmit={handleSubmit(handleSearchProduct)}
              className="relative w-full max-w-md"
            >
              <input
                type="text"
                onChange={(e) => setSearchQuery(e.target.value)}
                {...register("query")}
                placeholder="Search by product name..."
                className="w-full p-3 pl-10 bg-white rounded-lg shadow focus:outline-none"
              />
              <FaSearch className="absolute left-3 top-4 text-gray-500" />
            </form>
          )}
        </div>

        {/* Sort&Filter And Reset Button */}
        {products.length > 0 && (
          <div className="flex justify-end">
            <button
              className="text-xl font-medium text-gray-600 hover:underline"
              onClick={() => setIsOpen(true)}
              disabled={isButtonDisable}
            >
              <span className="inline-block mr-2">&#x2630;</span> Filter & Sort
            </button>
          </div>
        )}

        {products.length > 0 && (
          <div
            className={`${
              searchQuery !== "" ? "flex" : "hidden"
            } justify-end mt-3 mr-5`}
          >
            <button
              className="text-xl font-medium text-indigo-400 hover:underline"
              onClick={() => {
                setSearchQuery(""), reset();
                setReload(!reload);
              }}
              disabled={isButtonDisable}
            >
              <GrPowerReset className=" inline-block mr-2" />
              Restet
            </button>
          </div>
        )}

        {/* Product List */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 my-5">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between"
              >
                {/* Product Image */}
                <img
                  src={product.productImage}
                  alt={product.productName}
                  className="w-full h-[40vh] object-contain rounded-md mb-4"
                />

                {/* Product Info */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {product.productName}
                  </h2>
                  <p className="text-gray-600 ">{product.description}</p>
                </div>

                {/* Product Price and Rating */}
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-bold text-gray-800">
                    {product.price}
                  </span>
                  <div className="flex">
                    {/* Render stars based on rating */}
                    {product.rating ? (
                      <p>
                        {Array.from({ length: product.rating }).map((_, i) => (
                          <FaStar
                            key={i}
                            className=" inline-block text-yellow-300 text-md"
                          />
                        ))}
                        {Array.from({ length: 5 - product.rating }).map(
                          (_, i) => (
                            <FaRegStar
                              key={i}
                              className=" text-yellow-300 inline-block text-md"
                            />
                          )
                        )}
                      </p>
                    ) : (
                      <p className="m-2"></p>
                    )}
                  </div>
                </div>

                {/* Update and Remove Buttons */}
                <div className="mt-4 flex justify-start space-x-2">
                  <button className="flex items-center bg-indigo-500 text-white px-3 py-1 rounded shadow hover:bg-indigo-600 transition">
                    <FaEdit className="mr-2" /> Update
                  </button>
                  <button className="flex items-center bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition">
                    <FaTrash className="mr-2" /> Remove
                  </button>
                </div>
                <p className="py-2 px-4 text-center mt-3 font-medium">
                  {DateTimeFormate(product.createdAt)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-3xl col-span-3 text-gray-600">There is No Products</p>
          )}
        </div>

        {/* Filter Sidebar */}
        <div className="relative">
          {/* Sidebar (shown when isOpen is true) */}
          <div
            className={`fixed top-0 right-0 h-full w-64 lg:w-96 bg-white shadow-lg transform transition-transform ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ zIndex: 999 }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-lg absolute top-4 right-4 text-gray-600"
            >
              &#x2715;
            </button>

            {/* Sidebar Content */}
            <div className="p-6 space-y-6">
              <h2 className="text-xl lg:text-4xl font-bold">Filter & Sort</h2>

              {/* Sort By Options */}
              <div className="mb-4">
                <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-7">
                  Sort By
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option, index) => (
                    <button
                      onClick={() => setFilter(option)}
                      key={index}
                      className={`${
                        filter === option
                          ? "border border-gray-700 font-semibold"
                          : "border border-gray-400 hover:bg-gray-100"
                      } px-3 py-1  rounded-full text-xl`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Done Button */}
              <button
                onClick={handleFilter}
                className="w-full py-3 bg-red-400 text-white font-semibold rounded-full lg:text-2xl"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Overlay (visible when sidebar is open) */}
          {isOpen && (
            <div
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black opacity-50"
              style={{ zIndex: 998 }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Products;
