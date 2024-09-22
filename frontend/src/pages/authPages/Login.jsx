import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import authService from "../../services/auth";
import {apiHandler} from "../../utils"
import { useSelector, useDispatch } from "react-redux";
import { login  as authLogin} from "../../store/authSlice";


function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async ({email, password}) => {
    setError("");
    setLoading(true)

    const [response, error] = await apiHandler(authService.login({email, password}));
    
    if(response){
      dispatch(authLogin(response.data));
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/');
      }
    }

    if(error){
      setError(error.message)
    }

    setLoading(false)
  };

  return (
    <div className="bg-amber-100 flex items-center justify-center min-h-screen p-4 sm:p-8">
      <div className={`${loading ? "blur-[1px] ": "" } bg-amber-200 shadow-lg rounded-lg p-6 sm:p-8 max-w-xs sm:max-w-md w-full`}>
        <h2 className="text-2xl sm:text-3xl font-semibold text-amber-800 mb-6 text-center">
          Login
        </h2>
        {error && <p className="text-red-600 text-2xl font-bold mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit(login)}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-amber-900 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              disabled={loading}
              id="email"
              name="email"
              //   required
              className="w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50 border-amber-300 placeholder-amber-400 text-amber-900"
              {...register("email", {
                required: true,
              })}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-amber-900 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              disabled={loading}
              id="password"
              name="password"
              required
              className="w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50 border-amber-300 placeholder-amber-400 text-amber-900"
              {...register("password", {
                required: true,
              })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white font-semibold py-2 sm:py-3 rounded-lg hover:bg-amber-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-center text-amber-700 mt-4">
          Don't have an account?
          <Link
            to="/signup"
            className="text-amber-900 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
