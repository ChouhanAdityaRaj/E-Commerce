import React,{ useEffect, useState } from 'react'
import { apiHandler } from "../../utils";
import productService from "../../services/product";
import { Loader, ErrorMessage, MessageAlert} from "../../components";
import { Link } from 'react-router-dom';

function Categories() {

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading , setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState("");
  const [responseAlertMessage, setResponseAlertMessage] = useState("");
  

  useEffect(() => {
    (async() => {
      setError("")
      setLoading(true)

      const [response, error] = await apiHandler(productService.getAllCategories());

      if(response){
        setCategories(response.data)
      }

      if(error){
        setError(error)
      }

      setLoading(false)
    })()
  }, [reload])

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

  if(categories){
    return (
    <div className="p-5">
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
        
        <div className="mb-6 flex justify-between items-center">
          
          <Link
            to={"/admin/categories/create-category"}
            className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            Add Category
          </Link>
        </div>

      <ul className="space-y-4">
        {categories.length ? categories.map(({ _id, name, description, image, createdAt }) => (
          <li
            key={_id}
            className="p-4 border rounded flex  justify-between bg-white shadow-md"
          >
            
            <img 
              src={image} 
              alt={name} 
              className="w-32 h-32 rounded object-contain mr-6" 
            />

            
            <div className="flex-1  ">
              <h3 className="font-semibold text-2xl">{name}</h3>
              <p className="text-gray-600 text-md">{description}</p>
              <p className="text-gray-600 text-md mt-3">{DateTimeFormate(createdAt)}</p>
            </div>

            
            <div className="space-x-2">
              <Link
                to={`/admin/category/update-category/${_id}`}
                className="px-7 py-3 text-white bg-indigo-400 hover:bg-indigo-500 rounded"
              >
                Update
              </Link>
              <button
                className="px-5 py-3 text-white bg-red-400 hover:bg-red-500 rounded"
              >
                Remove
              </button>
            </div>
          </li>
        )) : <p className="text-center text-3xl col-span-3 text-gray-600">There is No Categories</p> }
      </ul>
    </div>
  );
}
}

export default Categories;