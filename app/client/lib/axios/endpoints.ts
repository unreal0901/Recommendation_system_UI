"use client";
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authEndpoints = {
  loginUser: "user/auth/login",
  registerUser: "user/auth/register",
  verifyToken: "user/auth/verify",
};
export const friendsEndpoints = {};
