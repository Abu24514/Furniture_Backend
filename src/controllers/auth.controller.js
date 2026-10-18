import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import { registerUserService, loginUserService } from "../services/auth.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/** 
 controller for REGISTER
 @POST : /api/auth/register
 */

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await registerUserService({ name, email, password });
  const token = generateToken(user._id);

  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/** 
 controller for LOGIN
 @POST : /api/auth/login
 */

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await loginUserService({ email, password });
  const token = generateToken(user._id);

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/** 
 controller for LOGOut
 @POST :/api/auth/logout
 */

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

/** 
 controller for PROFILE / CURRENT USER
 @GET : /api/auth/me
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Current user fetched successfully",
    data: req.user,
  });
});