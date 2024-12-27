import React ,{ useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { apiHandler } from '../../utils';
import userService from "../../services/user";
import { useApi } from "../../hooks";
import { Loader, MessageAlert, ErrorMessage } from "../../components";
import { useDispatch } from 'react-redux';
import { login } from "../../store/authSlice"

function Profile() {

  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();

  const [isPasswordFormOpen, setPasswordFormOpen] = useState(false);
  const [isFullNameFormOpen, setFullNameFormOpen] = useState(false);
  const [isButtonDeactive, setIsButtonDeactive] = useState(false);
  const [response, setResponse] = useState(null);
  const [handlerResponse, setHandlerResponse] = useState("");
  const [error, setError] = useState("");
  const [handlerError, setHandlerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reload, setRelad] = useState(false);

  const openPasswordForm = () => setPasswordFormOpen(true);
  const closePasswordForm = () => setPasswordFormOpen(false);

  const openFullNameForm = () => setFullNameFormOpen(true);
  const closeFullNameForm = () => setFullNameFormOpen(false);

  useEffect(() => {
    (async () => {
      setError("")
      setLoading(true)

      const [response, error] = await apiHandler(userService.currentUser());

      if(response){
        setResponse(response.data);
        dispatch(login(response.data));
      }

      if(error){
        setError(error.message);
      }

      setLoading(false);
    })()
  }, [reload])




  const handlePasswordChange = async ({ oldPassword, newPassword, conformPassword }) => {
    setIsButtonDeactive(true)

    const [response, error] = await apiHandler(userService.changePassword({oldPassword, newPassword, conformPassword}))
    
    if(response){
      setRelad(!reload);
      closePasswordForm();
      setHandlerResponse(response.message);
    }

    if(error){
      setHandlerError(error.message)
    }

    setIsButtonDeactive(false)
  }

  const handleFullNameChange = async ({ fullName }) => {
    setIsButtonDeactive(true)

    const [response, error] = await apiHandler(userService.changeFullName({ fullName }))
    
    if(response){
      setRelad(!reload);
      closeFullNameForm();
      setHandlerResponse(response.message);
    }

    if(error){
      setHandlerError(error.message)
    }

    setIsButtonDeactive(false)
    
  }

  const handleAlertMessage = () => {
    setHandlerResponse("");
    setHandlerError("");
  }




  if(error){
    return <ErrorMessage message={error}/>
  }


  if(loading){
    return <Loader/>
  }


  if(response){

    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
      <div className="bg-gray-100 p-6 rounded-md shadow-lg w-full lg:w-[70%] xl:w-[50%] space-y-6 lg:space-y-12 m-4">
        {handlerError && (<MessageAlert message={handlerError} handleMessage={handleAlertMessage}/>)}
        {handlerResponse && (<MessageAlert message={handlerResponse} isError={false} handleMessage={handleAlertMessage} />)}
        <h2 className="text-4xl lg:text-6xl font-semibold mb-4">User Info</h2>
        <div className="mb-4 space-y-2 lg:space-y-4">
          <p className="text-gray-700 text-xl lg:text-4xl">Full Name: <span className="font-semibold">{response.fullName}</span></p>
          <p className="text-gray-700 text-xl lg:text-4xl">Email: <span className="font-semibold">{response.email}</span></p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={openFullNameForm}
            className="bg-amber-400 hover:bg-amber-300 text-white font-semibold py-2 px-4 rounded focus:outline-none lg:text-2xl"
            >
            Change Full Name
          </button>
          <button
            onClick={openPasswordForm}
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-2 px-4 rounded focus:outline-none lg:text-2xl"
            >
            Change Password
          </button>
        </div>
      </div>

      {/* Overlay Form for Changing Password */}
      {isPasswordFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md lg:max-w-2xl">
            <h3 className="text-xl lg:text-5xl font-semibold mb-4">Change Password</h3>
            <form onSubmit={handleSubmit(handlePasswordChange)}>
              <div className="mb-4 space-y-3">
                <label className="block text-gray-700 lg:text-2xl">Old Password</label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-beige lg:h-[5vh]"
                  {...register("oldPassword", {
                    required: true,
                  })}
                />
                <label className="block text-gray-700 lg:text-2xl">New Password</label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-beige lg:h-[5vh]"
                  {...register("newPassword", {
                    required: true,
                  })}
                  />
                <label className="block text-gray-700 lg:text-2xl">Conform Password</label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-beige lg:h-[5vh]"
                  {...register("conformPassword", {
                    required: true,
                  })}
                  />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closePasswordForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2 lg:text-4xl lg:mt-4"
                  disabled={isButtonDeactive}
                  >
                  Cancel
                </button>
                <button
                  type="submit"
                  className=" text-white py-2 px-4 rounded bg-indigo-500 hover:bg-indigo-400 lg:text-4xl lg:mt-4"
                  disabled={isButtonDeactive}
                  >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Overlay Form for Changing Full Name */}
      {isFullNameFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md lg:max-w-2xl  lg:space-y-10">
            <h3 className="text-xl lg:text-5xl font-semibold mb-4">Change Full Name</h3>
            <form  onSubmit={handleSubmit(handleFullNameChange)}>
              <div className="mb-4">
                <label className="block text-gray-700 lg:text-3xl">Full Name</label>
                <input
                  defaultValue={response.fullName}
                  type="text"
                  className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-beige lg:h-[5vh]"
                  {...register("fullName", {
                    required: true
                  })}
                  />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeFullNameForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2 lg:text-4xl lg:mt-4"
                  disabled={isButtonDeactive}
                  >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-white py-2 px-4 rounded lg:text-4xl lg:mt-4"
                  disabled={isButtonDeactive}
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

export default Profile