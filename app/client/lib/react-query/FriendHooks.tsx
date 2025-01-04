import { useMutation } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  SendFriendRequest,
} from "../axios/services/friend.service";
import toast from "react-hot-toast";

export const useAddFriend = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      SendFriendRequest({ receiverId: payload.receiverId }),
    onSuccess: () => {
      toast.success("Friend Request sent");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Error Sending Friend request");
    },
  });
};

export const useAccepRequest = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      acceptFriendRequest({ requestId: payload.requestId }),
    onSuccess: () => {
      toast.success("Friend Request Accepted");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Error Accepting Friend request");
    },
  });
};

export const useRejectRequest = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      rejectFriendRequest({ requestId: payload.requestId }),
    onSuccess: () => {
      toast.success("Friend Request Rejected");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Error Rejecting Friend request");
    },
  });
};
