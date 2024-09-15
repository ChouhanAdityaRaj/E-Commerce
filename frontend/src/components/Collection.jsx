import React, { useEffect } from "react";
import { useApi } from "../hooks";
import productService from "../services/product";
import Loader from "./Loader";
import moreCollectionImage from "../assets/moreCollectionImage.jpg";

const CategoryGrid = ({numberOfCollection=null ,defaultCollectionItem=false}) => {
  const [response, loading, error] = useApi(productService.getAllCategories());

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h1>{error.message}</h1>;
  }

  if (response) {
    return (
      <div className="p-4 my-5 mx-1 ">
        <div className="flex flex-col justify-center mb-3 w-full sm:my-3 md:my-5 lg:my-5">
          <h1 className="text-center text-2xl font-semibold my-1 sm:text-2xl md:text-3xl lg:text-5xl">
            Collection
          </h1>
          <p className="text-center text-xs font-semibold text-zinc-500">
            Our Wide Range Of Timeless Style, Inherited Elegance Collection
          </p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-3">

          {numberOfCollection && response.data.map((category, i) => {
            if(i <= numberOfCollection){
              return category.name !== "uncategorized" ? (
                <div key={category._id} className="relative flex flex-col">
                  <img
                    src={category.image}
                    alt={category.name}
                    className=" w-auto max-h-96 object-cover rounded-xl "
                    />
                  <div className="mt-2">
                    <h2 className="text-sm font-semibold pl-1 sm:text-sm md:text-lg lg:text-lg hover:underline">
                      {category.name}
                    </h2>
                  </div>
                </div>
              ) : null;
            }
          })}

          {!numberOfCollection && response.data.map((category, i) => {
              return category.name !== "uncategorized" ? (
                <div key={category._id} className="relative flex flex-col">
                  <img
                    src={category.image}
                    alt={category.name}
                    className=" w-auto max-h-96 object-cover rounded-xl "
                    />
                  <div className="mt-2">
                    <h2 className="text-sm font-semibold pl-1 sm:text-sm md:text-lg lg:text-lg hover:underline">
                      {category.name}
                    </h2>
                  </div>
                </div>
              ) : null;
          })}
          
          {defaultCollectionItem && (<div className="relative flex flex-col">
            <img
              src={moreCollectionImage}
              alt="More"
              className=" w-auto max-h-96 object-cover rounded-xl "
            />
            <div className="mt-2">
              <h2 className="text-sm font-semibold pl-1 sm:text-sm md:text-lg lg:text-lg hover:underline">
                More
              </h2>
            </div>
          </div>)}

        </div>
      </div>
    );
  }
};

export default CategoryGrid;
