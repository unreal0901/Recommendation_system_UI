"use client";
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authEndpoints = {
  loginUser: "user/auth/login",
  registerUser: "user/auth/register",
  verifyToken: "user/auth/verify",
  updateProfile: "user/update-interests",
};
export const friendsEndpoints = {
  sendFriendRequest: "user/friends/request",
  getAllFriendsPaginated: (page: number, limit: number) =>
    `user/friends/all?page=${page}&limit=${limit}`,
  getAllSentRequestsPaginated: (page: number, limit: number) =>
    `user/friends/request/sent?page=${page}&limit=${limit}`,
  getAllIncomingRequestsPaginated: (page: number, limit: number) =>
    `user/friends/request/received?page=${page}&limit=${limit}`,
  acceptRequest: "user/friends/accept",
  rejectRequest: "user/friends/reject",
  getRecommendedFriends: `user/friends/recommended`,
};
