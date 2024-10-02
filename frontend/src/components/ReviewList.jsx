import React, { useEffect, useState } from "react";
import { useApi } from "../hooks";
import productService from "../services/product";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import { FaStar, FaRegStar } from "react-icons/fa";
import { apiHandler } from "../utils";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux";
import { MessageAlert } from "../components"

function ReviewList({ productid, limit, page, sortBy, sortType, isFilterRequired=true }) {
  
  const { register, handleSubmit} = useForm()
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth);


  const [productResponse, productLoading, productError] = useApi(
    productService.getProductById(productid)
  );

  const [error, setError] = useState("");
  const [reviewResponse, setReviewResponse] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [sortByFilter, setSortByFilter] = useState(sortBy || "");
  const [sortTypeFilter, setSortTypeFilter] = useState(sortType || "");
  const [isWriteReviewFormOpen, setIsWriteReviewFormOpen] = useState(false)
  const [currentUserReview, setCurrentUserReview] = useState(null);
  const [defaultRating, setDefaultRating] = useState(0);
  const [filter, setFilter] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonDisable, setIsButtonDisable] = useState(false);
  const [reload, setReload] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState("")
  const [responseAlertMessage, setResponseAlertMessage] = useState("")

  const sortOptions = ["Top rated first", "Worst Rated first", "Recent first", "Oldest first"];
  

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };


  const handleFilter = () => {
    setReviewLoading(true)
    toggleSidebar();

    if(filter === "Top rated first"){
      setSortByFilter("rating");
      setSortTypeFilter(-1);
    }
    if(filter === "Worst Rated first"){
      setSortByFilter("rating");
      setSortTypeFilter(1);
    }
    if(filter === "Recent first"){
      setSortByFilter("date");
      setSortTypeFilter(-1);
    }
    if(filter === "Oldest first"){
      setSortByFilter("date");
      setSortTypeFilter(1);
    }

    setReviewLoading(false)
  }

  const dateFormater = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  };

  useEffect(() => {
    setError("");
    (async () => {
      setReviewLoading(true);
      const [response, error] = await apiHandler(
        productService.getProductReview(productid, {
          limit,
          page,
          sortBy: sortByFilter,
          sortType: sortTypeFilter,
        })
      );

      if (response) {
        setReviewResponse(response.data);
        
        if(currentUser?.status){
          for(const review of response.data){
            if(review.user._id === currentUser.userData._id){
              setCurrentUserReview(review); 
              setDefaultRating(review.rating);
            }
          }
        }
      }

      if (error) {
        setError(error.message);
      }
    })();
    setReviewLoading(false);
  }, [sortByFilter, sortTypeFilter, reload]);



  const handleCreateReview = async ({content}) => {
    setIsButtonDisable(true);

    const [response, error] = await apiHandler(productService.createReview(productResponse?.data._id, {content, rating: defaultRating}))

    if(response){
      setResponseAlertMessage(response.message)
      setReload(!reload);
      setIsWriteReviewFormOpen(false)
    }

    if(error){
      setErrorAlertMessage(error.message)
    }

    setIsButtonDisable(false);
  }

  const handleUpdateReview = async ({content}) => {
    setIsButtonDisable(true);

    const [response, error] = await apiHandler(productService.updateReview(currentUserReview._id, { content, rating: defaultRating}));

    if(response){
      setResponseAlertMessage(response.message)
      setReload(!reload);
      setIsWriteReviewFormOpen(false)
    }

    if(error){
      setErrorAlertMessage(error.message)
    }

    setIsButtonDisable(false);
  }


  if (error) {
    <ErrorMessage message={error} />;
  }

  if (reviewLoading || productLoading) {
    <Loader />;
  }

  if (reviewResponse && productResponse) {
    const reviews = reviewResponse;
    const product = productResponse.data;

    return (
      <div className="w-[100%] flex justify-center">
        <div className="w-[95%] lg:w-[90%] p-4 md:p-8 bg-white border-t border-gray-200">
        {errorAlertMessage && (<MessageAlert message={errorAlertMessage} handleMessage={() => setErrorAlertMessage("")}/>)}
        {responseAlertMessage && (<MessageAlert message={responseAlertMessage} isError={false} handleMessage={() => setResponseAlertMessage("")}/>)}
          <h1 className="text-5xl lg:text-7xl xl:text-5xl font-semibold text-center mt-2 mb-6">
            Reviews
          </h1>

          {/* Rating Summary Section */}       
          <div className="flex flex-col md:flex-row items-center justify-center xl:mt-7 lg:mt-16">
            <div className="flex flex-col items-center w-full mt-10 md:mt-0">
              <div className="flex items-center space-x-4">
                <span className="text-3xl lg:text-6xl xl:text-5xl font-bold">
                  {product.rating.toFixed(1)}
                </span>
                <div className="flex">
                  {product.rating ? (
                    <p>
                      {Array.from({ length: Math.round(product.rating) }).map(
                        (_, i) => (
                          <FaStar
                            key={i}
                            className=" inline-block text-yellow-300 text-3xl  lg:text-6xl xl:text-5xl"
                          />
                        )
                      )}
                      {Array.from({
                        length: 5 - Math.round(product.rating),
                      }).map((_, i) => (
                        <FaRegStar
                          key={i}
                          className=" text-yellow-300 inline-block text-3xl  lg:text-6xl xl:text-5xl"
                        />
                      ))}
                    </p>
                  ) : (
                    <p className="m-2"></p>
                  )}
                </div>
              </div>
              <p className="text-md lg:text-3xl xl:text-[1.5rem] mt-2">{reviews.length} Users</p>
            </div>
          </div>

           {/* Filter & Sort Button*/}
           <div className="flex justify-end m-3">
            <button
              className="text-md lg:text-3xl xl:text-2xl font-medium text-gray-600 hover:underline"
              onClick={toggleSidebar}
              disabled={isButtonDisable}
            >
              <span className="inline-block mr-2">&#x2630;</span> Filter & Sort
            </button>
          </div>

          
          {/* Filter */}
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
              onClick={toggleSidebar}
              className="text-lg absolute top-4 right-4 text-gray-600"
            >
              &#x2715;
            </button>

            {/* Sidebar Content */}
            <div className="p-6 space-y-6">
              <h2 className="text-xl lg:text-4xl font-bold">Filter & Sort</h2>

              {/* Sort By Options */}
              <div className="mb-4">
                <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-7">Sort By</h3>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option, index) => (
                    <button
                      onClick={() => setFilter(option)}
                      key={index}
                      className={`${filter === option ? "border border-black font-semibold" : "border border-gray-400 hover:bg-gray-100"} px-3 py-1  rounded-full text-sm lg:text-2xl`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>


              {/* Done Button */}
              <button
                onClick={handleFilter}
                className="w-full py-3 bg-blue-900 text-white font-semibold rounded-full lg:text-2xl"
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
          

          {/* Review Section */}
          <div className="mt-8">
            {reviews.map((review, i) => (
              <div key={review._id} className="flex flex-col mb-5 lg:mb-10 lg:space-y-3 xl:space-y-2">
                <div className="flex items-center">
                  <div className="flex">
                    {product.rating ? (
                      <p>
                        {Array.from({ length: Math.round(review.rating) }).map(
                          (_, i) => (
                            <FaStar
                              key={i}
                              className=" inline-block text-yellow-300 text-md lg:text-3xl xl:text-2xl"
                            />
                          )
                        )}
                        {Array.from({
                          length: 5 - Math.round(review.rating),
                        }).map((_, i) => (
                          <FaRegStar
                            key={i}
                            className=" text-yellow-300 inline-block text-md lg:text-3xl xl:text-2xl"
                          />
                        ))}
                      </p>
                    ) : (
                      <p className="m-2"></p>
                    )}
                  </div>
                </div>
                <p className="text-sm lg:text-3xl xl:text-xl">{review.content}</p>
                <div className="text-gray-500 text-sm lg:text-2xl xl:text-sm">
                  <span>{review.user.fullName}</span> -{" "}
                  <span>{dateFormater(review.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Review Button */}
          <div className="mt-8 flex justify-center flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {currentUser.status && (<button 
              onClick={() => setIsWriteReviewFormOpen(true)} 
              className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded.md hover:bg-blue-400 lg:text-3xl lg:px-7 lg:py-4 xl:text-xl xl:py-3"
              disabled={isButtonDisable}
            >
              {currentUserReview ? "Update Review" : "Write A Review"}
            </button>)}
            <button 
              disabled={isButtonDisable}
              className="w-full md:w-auto px-4 py-2 bg-gray-100 text-blue-500 rounded.md hover:bg-gray-50 lg:text-3xl lg:px-7 lg:py-4 xl:text-xl xl:py-3"
            >
              See All Reviews
            </button>
          </div>

          {/* Write Review Form */}
          <div
          className={`fixed inset-0 bg-black bg-opacity-50 ${
            isWriteReviewFormOpen ? "flex" : "hidden"
          } justify-center items-center z-30`}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-2/3 lg:w-[60%] xl:w-1/3">
            <h2 className="text-2xl font-bold mb-4">Review</h2>
            <form onSubmit={handleSubmit(currentUserReview ? handleUpdateReview : handleCreateReview)}>
              <ul className="space-y-3 lg:text-2xl xl:text-lg">
                <li className="space-y-1">
                  <label className="text-lg lg:text-2xl xl:text-lg font-medium ml-1">
                    Rating
                  </label>


                  {!currentUserReview && (<p>{Array.from({length : 5}).map((_,i) => {
                    if(i < defaultRating){
                      return (
                        <FaStar
                          key={i}
                          className=" inline-block text-yellow-300 text-md lg:text-3xl xl:text-2xl"
                          onClick={() => setDefaultRating(i+1)}
                        />
                      )
                    } else {
                      return (
                        <FaRegStar
                            key={i}
                            className=" text-yellow-300 inline-block text-md lg:text-3xl xl:text-2xl"
                            onClick={() => setDefaultRating(i+1)}

                          />
                      )
                    }
                  })}</p>)}


                  {currentUserReview && defaultRating && (<p>{Array.from({length : 5}).map((_,i) => {
                    if(i < defaultRating){
                      return (
                        <FaStar
                          key={i}
                          className=" inline-block text-yellow-300 text-md lg:text-3xl xl:text-2xl"
                          onClick={() => setDefaultRating(i+1)}
                        />
                      )
                    } else {
                      return (
                        <FaRegStar
                            key={i}
                            className=" text-yellow-300 inline-block text-md lg:text-3xl xl:text-2xl"
                            onClick={() => setDefaultRating(i+1)}

                          />
                      )
                    }
                  })}</p>)}
                </li>
                <li className="space-y-1">
                  <label className="text-lg lg:text-2xl xl:text-lg font-medium ml-1">
                    Content
                  </label>
                  <textarea
                    defaultValue={currentUserReview?.content}
                    {...register("content")}
                    className="w-full p-2 border rounded-md"
                  />
                </li>
              </ul>
              <div className="flex justify-end space-x-4">
                <button
                  disabled={isButtonDisable}
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded-md"
                  onClick={() => setIsWriteReviewFormOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isButtonDisable}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        </div>
      </div>
    );
  }
}

export default ReviewList;
