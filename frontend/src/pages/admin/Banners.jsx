import React, { useEffect, useState } from "react";
import {FaEdit, FaTrash } from "react-icons/fa";
import { apiHandler } from "../../utils";
import productService from "../../services/product";
import adminService from "../../services/admin";
import { ErrorMessage, Loader, MessageAlert } from "../../components";
import { Link } from "react-router-dom";

function Banners() {
      const [banners, setBanners] = useState([]);
      const [error, setError] = useState("");
      const [loading, setLoading] = useState(false);
      const [reload, setReload] = useState(false);
      const [showRemoveConform, setShowRemoveConform] = useState({status: false, id: null});
      const [errorAlertMessage, setErrorAlertMessage] = useState("")
      const [responseAlertMessage, setResponseAlertMessage] = useState("")
    
      useEffect(() => {
        (async () => {
          setError("");
          setLoading(true);
          const [response, error] = await apiHandler(
            productService.getAllBanners()
          );
    
          if (response) {
            setBanners(response.data);
          }
    
          if (error) {
            setError(error.message);
          }
          setLoading(false);
        })();
      }, [reload]);
    
    
      const handleRemoveBanner = async (id) => {
        setErrorAlertMessage("")
        setLoading(true)
        setShowRemoveConform({status: false, id: null})
    
        const [response, error] = await apiHandler(adminService.deleteBanner(id));
    
        if(response){
          setResponseAlertMessage(response.message);
          setReload(!reload);
        }
    
        if(error){
          setErrorAlertMessage(error.message);
        }
    
        setLoading(false); 
      }
    
      const DateTimeFormate = (isoString) => {
        const date = new Date(isoString);
    
        const day = date.getDate().toString().padStart(2, "0"); // Day (2 digits)
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month (2 digits, +1 because months are zero-indexed)
        const year = date.getFullYear(); // Year (4 digits)
    
        // Extracting time components
        const hours = date.getHours().toString().padStart(2, "0"); // Hours (2 digits)
        const minutes = date.getMinutes().toString().padStart(2, "0"); // Minutes (2 digits)
        const seconds = date.getSeconds().toString().padStart(2, "0"); // Seconds (2 digits)
    
        // Formatting the date and time
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
      };
    
      if (error) {
        return <ErrorMessage message={error.message} />;
      }
    
      if (loading) {
        return <Loader />;
      }
    
      if (banners) {
        return (
          <div className="p-6 bg-gray-100 min-h-screen">
            {responseAlertMessage && (
              <MessageAlert
                message={responseAlertMessage}
                isError={false}
                handleMessage={() => setResponseAlertMessage("")}
              />
            )}
            {errorAlertMessage && (
              <MessageAlert
                message={errorAlertMessage}
                handleMessage={() => setErrorAlertMessage("")}
              />
            )}
            <Link
            to={"/admin/banner/create-banner"}
            className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            Add New Banner
          </Link>
            
            {/* Banners List */}
    
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 my-5">
              {banners.length > 0 ? (
                banners.map((banner) => (
                  <div
                    key={banner._id}
                    className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between"
                  >
                    {/* Banner Image */}
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-[40vh] object-contain rounded-md mb-4"
                    />
    
                    {/* Banner Info */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {banner.title}
                      </h2>
                      <p className="text-gray-600 ">Active - {banner.isActive ? "✅" : "❌"}</p>
                    </div>
    
                    {/* Update and Remove Buttons */}
                    <div className="mt-4 flex justify-start space-x-2">
                      <Link to={`/admin/banner/update-banner/${banner._id}`} className="flex items-center bg-indigo-500 text-white px-3 py-1 rounded shadow hover:bg-indigo-600 transition">
                        <FaEdit className="mr-2" /> Update
                      </Link>
                      <button onClick={() => setShowRemoveConform({status: true, id: banner._id})} className="flex items-center bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition">
                        <FaTrash className="mr-2" /> Remove
                      </button>
                    </div>
                    <p className="py-2 px-4 text-center mt-3 font-medium">
                      {DateTimeFormate(banner.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-3xl col-span-3 text-gray-600">There is No Banners</p>
              )}
            </div>
    
            
    
    
            {showRemoveConform.status && (
            <div className="fixed inset-0 flex items-center justify-center z-30">
              {/* Overlay */}
              <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={() => setShowRemoveConform({status:false, id: null})}
              ></div>
    
    
              {/*Remove Confirmation Box */}
              <div className="relative z-40 p-6 bg-white rounded-lg shadow-lg w-80 text-center">
                <p className="mb-4 text-lg">Are you sure you want to delete Banenr?</p>
                <div className="flex justify-center space-x-4">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => handleRemoveBanner(showRemoveConform.id)}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => setShowRemoveConform({status:false, id: null})}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>
        );
      }
}

export default Banners