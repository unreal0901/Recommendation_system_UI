"use client";
import axiosInstance from "../axiosConfig";
import { friendsEndpoints } from "../endpoints";

export const SendFriendRequest = async (requestPayload: {
  receiverId: string;
}) => {
  try {
    const response = await axiosInstance.post(
      friendsEndpoints.sendFriendRequest,
      requestPayload
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const acceptFriendRequest = async (requestPayload: {
  requestId: string;
}) => {
  try {
    const response = await axiosInstance.patch(
      friendsEndpoints.acceptRequest,
      requestPayload
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const rejectFriendRequest = async (requestPayload: {
  requestId: string;
}) => {
  try {
    const response = await axiosInstance.patch(
      friendsEndpoints.rejectRequest,
      requestPayload
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAllFriendsPaginated = async (page: number, limit: number) => {
  try {
    const response = await axiosInstance.get(
      friendsEndpoints.getAllFriendsPaginated(page, limit)
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAllSentRequestsPaginated = async (
  page: number,
  limit: number
) => {
  try {
    const response = await axiosInstance.get(
      friendsEndpoints.getAllSentRequestsPaginated(page, limit)
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAllIncomingRequestsPaginated = async (
  page: number,
  limit: number
) => {
  try {
    const response = await axiosInstance.get(
      friendsEndpoints.getAllIncomingRequestsPaginated(page, limit)
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAllRecommendedFriendsPaginated = async () => {
  try {
    const response = await axiosInstance.get(
      friendsEndpoints.getRecommendedFriends
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
