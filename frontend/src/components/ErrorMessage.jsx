import React from "react";

const ErrorMessage = ({ message }) => {
  return (
    <div className="flex justify-center items-center h-screen">
        <p className="mt-2 text-2xl md:text-5xl  xl:text-6xl ">{message}</p>
    </div>
  );
};

export default ErrorMessage;
