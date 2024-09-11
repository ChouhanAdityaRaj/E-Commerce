import React from "react";

const ErrorMessage = ({ message }) => {
  return (
    <div className="flex justify-center items-center h-screen bg-neutral-500">
        <p className="mt-2 text-3xl md:text-7xl  xl:text-8xl ">{message}</p>
    </div>
  );
};

export default ErrorMessage;
