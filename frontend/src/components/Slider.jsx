import React, { useState } from "react";
import { useApi } from "../hooks";
import productService from "../services/product";
import { Loader, ErrorMessage} from "../components"
import { Link } from "react-router-dom";

function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [response, loading, error] = useApi(productService.getAllBanners());

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? response.data.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === response.data.length - 1 ? 0 : prev + 1));
  };

  if(error){
    return (
      <ErrorMessage message={error.message}/>
    )
  }

  if(loading){
    return (
      <Loader/>
    )
  }

if(response){

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="relative w-[100%] h-full  overflow-hidden shadow-lg">
        <div
          className="w-full h-full flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
          {response?.data?.map((banner, index) =>(
            <Link to={`/b/${banner._id}`} key={banner._id} className="flex-shrink-0 w-full h-[30vh] sm:h-[35vh] xl:h-[90vh] md:h-[40vh] relative">
              <img
                src={banner.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-md text-sm sm:text-base md:text-5xl">
                {banner.title}
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
        >
          &lt;
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
          >
          &gt;
        </button>
      </div>
    </div>
  );
}
}

export default Slider;
