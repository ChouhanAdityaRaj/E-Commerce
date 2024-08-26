import React from "react";

function Loader() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex space-x-2">
        <span className="text-5xl font-bold text-gray-800 animate-pulse">
          A
        </span>
        <span className="text-5xl font-bold text-gray-800 animate-pulse [animation-delay:200ms]">
          B
        </span>
        <span className="text-5xl font-bold text-gray-800 animate-pulse [animation-delay:400ms]">
          C
        </span>
        <span className="text-5xl font-bold text-gray-800 animate-pulse [animation-delay:600ms]">
          D
        </span>
      </div>
    </div>
  );
}

export default Loader;
