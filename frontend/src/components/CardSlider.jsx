import React, { useState } from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import topRatedImage from "../assets/top-rated.jpg";
import mostBuyedImage from "../assets/most-buyed.jpg";
import newArrivalImage from "../assets/new-arrivals.jpg";
import { Link } from "react-router-dom"

function CardSlider() {
  const slides = [
    {
      id: "1",
      title: "New Arrival First",
      image: newArrivalImage,
      activeStatus: true,
      path: "/product?search=&sortBy=date&sortType=-1"

    },
    {
      id: "2",
      title: "Top Rated First",
      image: topRatedImage,
      activeStatus: true,
      path: "/product?search=&sortBy=rating&sortType=-1"

    },
    {
      id: "3",
      title: "All Products",
      image: mostBuyedImage,
      activeStatus: true,
      path: "/product?search="

    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const canSlideLeft = currentIndex > 0;
  const canSlideRight = currentIndex < slides.length - 3;

  const slideLeft = () => {
    if (canSlideLeft) {
      setCurrentIndex(currentIndex - 3);
    }
  };

  const slideRight = () => {
    if (canSlideRight) {
      setCurrentIndex(currentIndex + 3);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center mb-3 w-full sm:my-3 md:my-5 lg:my-5">
        <h1 className="text-center text-2xl font-semibold my-1 sm:text-2xl md:text-3xl lg:text-5xl">
          Explore
        </h1>
        <p className="text-center text-xs font-semibold text-zinc-500">
          Our Wide Range Of Timeless Style, Inherited Elegance Collection
        </p>
      </div>
      <div className="w-[99%] md:w-[97%] mx-auto relative flex justify-center items-center">
        {/* Left Arrow */}
        {canSlideLeft && (
          <button
            className="absolute left-0 transform -translate-y-1/2  rounded-full z-10"
            onClick={slideLeft}
          >
            <SlArrowLeft className="w-5 h-5 md:w-9 md:h-9" />
          </button>
        )}

        {/* Slides Container */}
        <div className="flex overflow-hidden w-[92%]">
          <div
            className="flex w-full"
            style={{
              transform: `translateX(-${(currentIndex * 100) / 3}%)`,
              transition: "transform 0.5s ease-in-out",
            }}
          >
            {slides.map((slide) => slide.activeStatus && (
              <Link
                key={slide.id}
                to={slide.path}
                className="flex-shrink-0 w-[33.33%] h-[20vh] sm:h-[50vh] md:h-[26vh] xl:h-[70vh] bg-white text-black rounded-xl"
              >
                <div className="w-full h-full flex flex-col items-center  p-2">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-4/5 w-full object-cover rounded-lg"
                  />
                  <p className="text-[12px] sm:text-2xl md:text-gl  xl:text-2xl font-bold mt-2 hover:underline font-serif">
                    {slide.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        {canSlideRight && (
          <button
            className="absolute right-0 transform -translate-y-1/2 rounded-full z-10"
            onClick={slideRight}
          >
            <SlArrowRight className="w-5 h-5 md:w-9 md:h-9" />
          </button>
        )}
      </div>
    </>
  );
}

export default CardSlider;
