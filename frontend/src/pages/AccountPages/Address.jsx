import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks";
import userService from "../../services/user";
import { Loader, ErrorMessage, MessageAlert } from "../../components";
import { useForm } from "react-hook-form";
import { apiHandler } from "../../utils";

function Address() {
  const {
    register: updateAddressRegister,
    handleSubmit: updateAddressHandleSubmit,
  } = useForm();
  const { register: addAddressRegister, handleSubmit: addAddresHandleSubmit, reset: addAddressReset } =
    useForm();

  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [updateFormId, setUpdateFormId] = useState("");
  const [updateFormData, setUpdateFormData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [reload, setReload] = useState(false);
  const [isAddAddressFromOpen, setIsAddAddressFromOpen] = useState(false);
  const [isButtonDisable, setIsButtonDisable] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const [response, error] = await apiHandler(
        userService.getUserAddresses()
      );

      if (response) {
        setAddresses(response.data);
      }

      if (error) {
        setError(error);
      }
    })();
    setLoading(false);
  }, [reload]);

  useEffect(() => {
    if (isUpdateFormOpen === true) {
      addresses.forEach((address) => {
        if (address._id === updateFormId) {
          setUpdateFormData(address);
        }
      });
    }
  }, [isUpdateFormOpen, updateFormId]);

  const updateAddressHandler = async (data) => {
    setIsButtonDisable(true);
    setErrorMessage("");
    setResponseMessage("");

    const updateObject = {};

    for (const [key, value] of Object.entries(data)) {
      if (value) {
        updateObject[key] = value;
      }
    }

    const [response, error] = await apiHandler(
      userService.updateAddress(updateFormId, updateObject)
    );

    if (response) {
      setResponseMessage(response.message);
      setReload(!reload);
      setUpdateFormId("");
      setUpdateFormData(null);
      setIsUpdateFormOpen(false);
    }

    if (error) {
      setErrorMessage(error.message);
    }

    setIsButtonDisable(false);
  };

  const addAddressHandler = async (data) => {
    setIsButtonDisable(true);
    setErrorMessage("");
    setResponseMessage("");

    const addressObject = {};

    for (const [key, value] of Object.entries(data)) {
      if (value) {
        addressObject[key] = value;
      }
    }

    const [response, error] = await apiHandler(
      userService.addAddress(addressObject)
    );

    if (response) {
      setResponseMessage(response.message);
      setIsAddAddressFromOpen(false);
      setReload(!reload);
      addAddressReset();
    }

    if (error) {
      setErrorMessage(error.message);
    }
    setIsButtonDisable(false);
  };

  const removeAddressHandler = async (addressId) => {
    setIsButtonDisable(true);
    setErrorMessage("");
    setResponseMessage("");

    const [response, error] = await apiHandler(
      userService.deleteAddress(addressId)
    );

    if (response) {
      setResponseMessage(response.message);
      setReload(!reload);
    }

    if (error) {
      setErrorMessage(error.message);
    }
    setIsButtonDisable(false);
  };

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (loading) {
    return <Loader />;
  }

  if (addresses) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 pt-16">
        {errorMessage && (
          <MessageAlert
            message={errorMessage}
            handleMessage={() => setErrorMessage("")}
          />
        )}
        {responseMessage && (
          <MessageAlert
            message={responseMessage}
            isError={false}
            handleMessage={() => setResponseMessage("")}
          />
        )}
        <h1 className="text-3xl lg:text-6xl xl:text-4xl font-bold mb-6 text-center">
          {addresses.length
            ? "Your Addresses"
            : "You haven't added any addresses yet."}
        </h1>
        <div className="flex flex-wrap gap-4 justify-center">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="border p-4 rounded-lg mb-4 shadow-lg w-full md:w-1/2 lg:w-[80%]  xl:w-1/3"
            >
              <h2 className="font-bold text-lg">{address.user.fullName}</h2>
              <p className="font-semibold">
                Phone number: {address.mobileNumber}
              </p>
              <p>{address.address}</p>
              <p>
                {address.city}, {address.state} {address.pinCode}
              </p>
              <p>India</p>
              <div className="mt-4 space-x-2">
                <button
                  className=" transition-colors duration-300 ease-in-out px-3 py-1 border border-gray-200 rounded-md bg-blue-500 hover:bg-white hover:text-black text-white"
                  disabled={isButtonDisable}
                  onClick={() => {
                    setIsUpdateFormOpen(true);
                    setUpdateFormId(address._id);
                  }}
                >
                  Edit
                </button>
                <button
                  disabled={isButtonDisable}
                  className=" transition-colors duration-500 ease-in-out px-3 py-1 border border-gray-200 rounded-md bg-blue-500 hover:bg-white hover:text-black text-white"
                  onClick={() => removeAddressHandler(address._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            disabled={isButtonDisable}
            onClick={() => setIsAddAddressFromOpen(true)}
            className=" transition-colors duration-500 ease-in-out border p-4 rounded-lg mb-4 w-full md:w-1/2 lg:w-1/3 flex items-center justify-center bg-blue-500 text-white text-3xl hover:bg-white hover:text-black"
          >
            Add Address
          </button>
        </div>

        {/* Update Form */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 ${
            updateFormData ? "flex" : "hidden"
          } justify-center items-center z-30`}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-2/3 lg:w-[60%] xl:w-1/3">
            <h2 className="text-2xl font-bold mb-4">Update Address</h2>
            <form onSubmit={updateAddressHandleSubmit(updateAddressHandler)}>
              <ul className="space-y-3 lg:text-2xl xl:text-lg">
                <li className="space-y-1">
                  <label className="text-lg lg:text-2xl xl:text-lg font-medium ml-1">
                    State
                  </label>
                  <input
                    type="text"
                    defaultValue={updateFormData?.state}
                    {...updateAddressRegister("state")}
                    className="w-full p-2 border rounded-md"
                  />
                </li>

                <li className="space-y-1">
                  <label className="text-lg lg:text-2xl xl:text-lg font-medium ml-1">
                    City
                  </label>
                  <input
                    type="text"
                    defaultValue={updateFormData?.city}
                    {...updateAddressRegister("city")}
                    className="w-full p-2 border rounded-md"
                  />
                </li>

                <li className="space-y-1">
                  <label className="text-lg lg:text-2xl xl:text-lg font-medium ml-1">
                    Pin Code
                  </label>
                  <input
                    type="text"
                    defaultValue={updateFormData?.pinCode}
                    {...updateAddressRegister("pinCode")}
                    className="w-full p-2 border rounded-md"
                  />
                </li>

                <li className="space-y-1">
                  <label className="text-lg lg:text-2xl xl:text-lg font-medium ml-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    defaultValue={updateFormData?.mobileNumber}
                    {...updateAddressRegister("mobileNumber")}
                    className="w-full p-2 border rounded-md"
                  />
                </li>

                <li className="space-y-1">
                  <label className="text-lg lg:text-2xl xl:text-lg font-medium ml-1">
                    Address
                  </label>
                  <textarea
                    defaultValue={updateFormData?.address}
                    {...updateAddressRegister("address")}
                    className="w-full p-2 border rounded-md"
                  />
                </li>
              </ul>
              <div className="flex justify-end space-x-4">
                <button
                  disabled={isButtonDisable}
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded-md"
                  onClick={() => {
                    setIsUpdateFormOpen(false);
                    setUpdateFormId("");
                    setUpdateFormData(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={isButtonDisable}
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Add Address Form */}
        {isAddAddressFromOpen && (
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30`}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-2/3 lg:w-[60%] xl:w-1/3">
              <h2 className="text-2xl font-bold mb-4">Add Address</h2>
              <form onSubmit={addAddresHandleSubmit(addAddressHandler)}>
                <ul className="space-y-3 lg:text-2xl xl:text-lg">
                  <li className="space-y-1">
                    <label className="text-lg lg:text-2xl xl:text-lg font-medium ml-1">
                      State
                    </label>
                    <input
                      type="text"
                      {...addAddressRegister("state")}
                      className="w-full p-2 border rounded-md"
                    />
                  </li>

                  <li className="space-y-1">
                    <label className="text-lg lg:text-2xl xl:text-lg font-medium ml-1">
                      City
                    </label>
                    <input
                      type="text"
                      {...addAddressRegister("city")}
                      className="w-full p-2 border rounded-md"
                    />
                  </li>

                  <li className="space-y-1">
                    <label className="text-lg lg:text-2xl xl:text-lg font-medium ml-1">
                      Pin Code
                    </label>
                    <input
                      type="text"
                      {...addAddressRegister("pinCode")}
                      className="w-full p-2 border rounded-md"
                    />
                  </li>

                  <li className="space-y-1">
                    <label className="text-lg lg:text-2xl xl:text-lg font-medium ml-1">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      {...addAddressRegister("mobileNumber")}
                      className="w-full p-2 border rounded-md"
                    />
                  </li>

                  <li className="space-y-1">
                    <label className="text-lg lg:text-2xl xl:text-lg font-medium ml-1">
                      Address
                    </label>
                    <textarea
                      {...addAddressRegister("address")}
                      className="w-full p-2 border rounded-md"
                    />
                  </li>
                </ul>
                <div className="flex justify-end space-x-4">
                  <button
                    disabled={isButtonDisable}
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded-md"
                    onClick={() => setIsAddAddressFromOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isButtonDisable}
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Address;
