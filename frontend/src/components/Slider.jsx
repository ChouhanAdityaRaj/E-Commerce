import React, { useState } from "react";
import image from "../assets/image.jpg";

function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image,
      text: "Slide 1 Text",
    },
    {
      image,
      text: "Slide 2 Text",
    },
    {
      image,
      text: "Slide 3 Text",
    },
  ];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex items-center justify-center my-8 flex-col">
      <div className="flex flex-col justify-center mb-3 w-full sm:my-3 md:my-5 lg:my-5">
        <h1 className="text-center text-2xl font-semibold my-1 sm:text-2xl md:text-3xl lg:text-5xl">
          Discover
        </h1>
        <p className="text-center text-xs font-semibold text-zinc-500">
          Our Wide Range Of Timeless Style, Inherited Elegance Collection
        </p>
      </div>

      <div className="relative w-[100%] h-full  overflow-hidden shadow-lg">
        <div
          className="w-full h-full flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="flex-shrink-0 w-full h-[30vh] sm:h-[35vh] xl:h-[90vh] md:h-[40vh] relative">
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-md text-sm sm:text-base md:text-lg">
                {slide.text}
              </div>
            </div>
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

export default Slider;
