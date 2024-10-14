import React,{ useState } from "react";
import { useForm } from "react-hook-form";
import {MessageAlert, Loader } from "../../components";
import { apiHandler } from "../../utils";
import adminService from "../../services/admin";
import { useNavigate } from "react-router-dom";

function CreateCategory() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate(); 

  const [loading, setLoading] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState("");
  const [responseAlertMessage, setResponseAlertMessage] = useState("");

  const handleCreateCategory = async({ name, description, image }) => {
    setLoading(true);

    const formData = new FormData();

    formData.append("name", name)
    formData.append("description", description)
    formData.append("categoryImage", image[0])

    const [response, error] = await apiHandler(
      adminService.createCategory(formData)
    );

    if (response) {
      setResponseAlertMessage(response.message);
      setTimeout(() => {
        navigate("/admin/categories")
      }, 2500)
    }

    if (error) {
      setErrorAlertMessage(error.message);
    }

    setLoading(false);
  };


  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg">
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
      <h2 className="text-3xl font-bold mb-6 text-center">Create Category</h2>
      <form onSubmit={handleSubmit(handleCreateCategory)}>
        {/* Name Input */}
        <div className="mb-6">
          <label className="block mb-3 text-lg font-medium text-gray-800">
            Name
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Description Input */}
        <div className="mb-6">
          <label className="block mb-3 text-lg font-medium text-gray-800">
            Description
          </label>
          <textarea
            {...register("description")}
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            rows="4"
          />
        </div>

        {/* Image Input */}
        <div className="mb-6">
          <label className="block mb-3 text-lg font-medium text-gray-800">
            Image
          </label>
          <input
            type="file"
            {...register("image")}
            className="w-full text-lg file:py-2 file:px-4 file:rounded-lg file:bg-blue-50 file:border file:border-gray-300  hover:file:bg-gray-200"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-3 text-lg rounded-lg hover:bg-red-600 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateCategory;
