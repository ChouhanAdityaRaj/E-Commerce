import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { apiHandler } from "../../utils";
import productService from "../../services/product";
import adminService from "../../services/admin"
import { Loader, ErrorMessage, MessageAlert} from "../../components";
import { useForm } from 'react-hook-form';

function UpdateCategory() {
  const {categoryid} = useParams();
  const { register: categoryDetailsRegister, handleSubmit: categoryDetailsHandleSubmit } = useForm();
  const { register:categoryImageRegister , handleSubmit: categoryImageHandleSubmit } = useForm();

  const [category, setCategory] = useState(null);
  const [error, setError] = useState("");
  const [loading , setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState("");
  const [responseAlertMessage, setResponseAlertMessage] = useState("");

  useEffect(() => {
    (async () => {
      setError("");
      setLoading(true);

      const [response, error] = await apiHandler(productService.getAllCategories());

      if (response) {
        const category = response.data.filter((category) => category._id === categoryid );
        setCategory(category[0]);      
      }

      if (error) {
        setError(error);
      }
      setLoading(false)
    })()
  }, [reload])



  const handleUpdateCategoryDetails = async({name, description}) => {
    setLoading(true);

    const [response, error] = await apiHandler(
      adminService.updateCategoryDetails(categoryid, {name, description})
    );

    if (response) {
      setResponseAlertMessage(response.message);
      setReload(!reload)
    }

    if (error) {
      setErrorAlertMessage(error.message);
    }

    setLoading(false);
    
  };

  const handleUpdateCategoryImage = async ({image}) => {
    setLoading(true);

    const formData = new FormData();

    formData.append("categoryImage", image[0])
    

    const [response, error] = await apiHandler(
      adminService.updateCategoryImage(categoryid, formData)
    );

    if (response) {
      setResponseAlertMessage(response.message);
      setReload(!reload);
    }

    if (error) {
      setErrorAlertMessage(error.message);
    }

    setLoading(false);
  };

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (loading) {
    return <Loader />;
  }

  if(category){
    return (
      <div className="container mx-auto p-4 space-y-8">
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

         <form
          onSubmit={categoryDetailsHandleSubmit(handleUpdateCategoryDetails)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Update Category Details
            </h2>
            <div>
              <label className="block text-sm">Name</label>
              <input
                type="text"
                defaultValue={category?.name}
                {...categoryDetailsRegister("name")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Description</label>
              <textarea
                defaultValue={category?.description}
                {...categoryDetailsRegister("description")}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-red-400 hover:bg-red-500  text-white py-2 px-4 rounded"
          >
            Save Category Details
          </button>
        </form>

        <form
          onSubmit={categoryImageHandleSubmit(handleUpdateCategoryImage)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Update Category Image</h2>
            <div>
              <img
                src={category?.image}
                alt="Previous Product"
                className="w-56 h-56 object-contain mb-2"
              />
              <input
                type="file"
                accept="image/*"
                {...categoryImageRegister("image")}
                className="block w-[30%] text-xl text-gray-900 border border-gray-300  cursor-pointer bg-gray-50"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded"
          >
            Save Image
          </button>
        </form>

        <hr />
        </div>
    )
  }
}

export default UpdateCategory