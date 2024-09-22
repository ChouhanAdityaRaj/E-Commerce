import { useEffect, useState } from "react";

const ErrorComponent = ({ message, isError=true, handleMessage }) => {

  useEffect(() => {
    setTimeout(() => {
      handleMessage();
    }, 7000)
  }, [])

  return (
    <>
        <div className="w-full flex justify-center ">
          <div className={`fixed flex justify-between items-center top-1 w-[40%] h-[8vh] ${isError ? "bg-red-400" : "bg-green-300"} text-white text-center px-4 py-5 z-50  rounded-full`}>
            <p className="text-lg">{message}</p>
            <button
              className= {`bg-white ${isError ? "text-red-500" : "text-green-500"} px-4 py-2 rounded-full hover:bg-gray-200`}
              onClick={handleMessage}
            >
              OK
            </button>
          </div>
        </div>
    </>
  );
};

export default ErrorComponent;
