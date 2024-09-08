import React, { useState, useEffect } from "react";
import { Collection, Slider, CardSlider } from "../components";
import image from "../assets/image.jpg";
import { SlMagnifier } from "react-icons/sl";

function Home() {
  return (
    <>
      {/* Welcome component */}
      <section className="flex items-center justify-center h-full w-full">
        <div className="relative w-full ">
          <img
            src={image}
            alt="Placeholder"
            className="w-full h-[30vh] sm:h-[75vh] object-cover mx-auto"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h1 className="text-white text-lg sm:text-4xl font-bold mb-2">
              Heritage Clothiers
            </h1>
            <p className="text-white text-xs sm:text-lg max-w-md">
              Place for Timeless Style, Inherited Elegance.
            </p>
          </div>
        </div>
      </section>

      {/* Collection */}
      <Collection numberOfCollection={7} defaultCollectionItem={true} />

      {/* Slider */}
      <Slider />

      {/* Card Slider */}
      <CardSlider/>

    </>
  );
}

export default Home;
