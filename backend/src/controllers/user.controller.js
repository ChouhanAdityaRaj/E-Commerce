import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { generateAccessAndRefreshToken } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";

const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const existedUser = await User.findOne({ email: email });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -isBlacklist -isAdmin"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdUser,
        "User Registered successfully please login"
      )
    );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({email});

  if (!user) {
    throw new ApiError(404, "User not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id);

  const loggedInUser = await User.findById(user?._id).select("-password -refreshToken -isBlacklist -isAdmin");

  const options = {
    httpOnly: true, 
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
      200, 
      loggedInUser, 
      "User Logged In Successfully"
    ));
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset:{
        refreshToken: 1
      }
    }
  );

  const options = {
    httpOnly: true, 
    secure: true
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(
      200,
      {},
      "User logged out"
    ));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomigRefreshToken = req.cookies?.refreshToken;

  if(!incomigRefreshToken){
    throw new ApiError(401, "Unauthorised request");
  }

  const decodedRefreshToken = jwt.verify(incomigRefreshToken, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decodedRefreshToken?._id);

  if(!user){
    throw new ApiError(401, "Invalid Refresh Token");
  }

  if(incomigRefreshToken !== user?.refreshToken){
    throw new ApiError(401, "Refresh token is expired or used");
  }

  const { accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

  const options = {
    httpOnly: true, 
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
      200,
      {},
      "Access Token Refreshed Successfully"
    ))
})

export { signup, login, logout, refreshAccessToken };