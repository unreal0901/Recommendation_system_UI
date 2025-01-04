"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { LogOut, User } from "lucide-react";
import { useAuthStore } from "@/app/client/lib/store/useAuthStore";
import { PaginatedComponent } from "./PaginatedComponent";
import {
  getAllFriendsPaginated,
  getAllIncomingRequestsPaginated,
  getAllRecommendedFriendsPaginated,
  getAllSentRequestsPaginated,
  SendFriendRequest,
} from "@/app/client/lib/axios/services/friend.service";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UpdateProfile } from "@/app/client/lib/axios/services/auth.service";
import toast from "react-hot-toast";
import { queryClient } from "@/app/client/lib/react-query/queryClient";
import {
  useAccepRequest,
  useAddFriend,
  useRejectRequest,
} from "@/app/client/lib/react-query/FriendHooks";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface InterestsComponentProps {
  tags: string[];
  handleRemoveTag: (tag: string) => void;
}

const InterestsComponent = ({
  tags,
  handleRemoveTag,
}: InterestsComponentProps) => {
  return (
    <div className="space-y-2 mt-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge
            className="bg-blue-300 text-gray-800 hover:bg-red-500 hover:text-white hover:cursor-pointer"
            key={index}
            onClick={() => handleRemoveTag(tag)}
          >
            <span>{tag}</span>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export function ProfileComponents() {
  const { loggedInUser, logout } = useAuthStore();
  const [currentTag, setCurrentTag] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [initialInterests, setInitialInterests] = useState<string[]>([]);
  const [IncomingCardKey, setIncomingCardKey] = useState<any>(null);
  const [sentCardKey, setSendCardKey] = useState<any>(null);
  const [allCardKey, setAllCardKey] = useState<any>(null);
  const profileUpdate = useMutation({
    mutationFn: UpdateProfile,
    onSuccess() {
      toast.success("Updated the tags");
    },
  });

  const sendFriendRequest = useAddFriend();
  const acceptRequest = useAccepRequest();
  const rejectRequest = useRejectRequest();

  const { data: response, isFetching } = useQuery({
    queryKey: ["get_recommended_users", loggedInUser?.id],
    queryFn: () => getAllRecommendedFriendsPaginated(),
    refetchOnWindowFocus: false,
    enabled: !!loggedInUser,
  });

  const recommendedUsers = response?.data || [];

  useEffect(() => {
    const interests = loggedInUser?.interests;
    if (interests && interests.length > 0) {
      setInterests((prev) => [...prev, ...interests]);
      setInitialInterests(interests);
    }
  }, [loggedInUser]);

  const handleLogout = () => {
    logout();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim() !== "") {
      if (!interests.includes(currentTag.trim())) {
        setInterests([...interests, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setInterests(interests.filter((interest) => interest !== tag));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTag(e.target.value);
  };

  const handleInterestsUpdate = async () => {
    try {
      profileUpdate.mutate(interests);
    } catch (err) {
      console.log(err);
    }
  };

  const hasChanges =
    JSON.stringify(interests) !== JSON.stringify(initialInterests);

  const addFriendHandler = async (receiverId: string) => {
    try {
      await sendFriendRequest.mutateAsync({ receiverId: receiverId });
      queryClient.invalidateQueries({
        queryKey: sentCardKey,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const acceptRequestHandler = async (reqId: string) => {
    try {
      await acceptRequest.mutateAsync({ requestId: reqId });
      queryClient.invalidateQueries({
        queryKey: IncomingCardKey,
      });
      queryClient.invalidateQueries({
        queryKey: allCardKey,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const rejectRequestHandler = async (reqId: string) => {
    try {
      await rejectRequest.mutateAsync({ requestId: reqId });
      queryClient.invalidateQueries({
        queryKey: IncomingCardKey,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="w-24 h-24">
            <AvatarImage
              src="/placeholder.svg?height=96&width=96"
              alt="Profile Picture"
            />
            <AvatarFallback>{loggedInUser?.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{loggedInUser?.email}</h1>
            <p className="text-muted-foreground">@{loggedInUser?.username}</p>
          </div>
        </div>
        <div className="self-baseline">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div>
        <h2 className="mb-2 font-bold">Update Interests</h2>
        <div>
          <Input
            id="Interests"
            value={currentTag}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Add Interests (press Enter)"
          />
        </div>

        <InterestsComponent
          tags={interests}
          handleRemoveTag={handleRemoveTag}
        />
        <div className="mt-2 flex justify-end">
          {hasChanges && (
            <Button className="w-max" onClick={() => handleInterestsUpdate()}>
              Update
            </Button>
          )}
        </div>
      </div>
      {/* Recommended Users */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recommended Users</h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          {!isFetching && (
            <div className="flex w-max space-x-4 p-4">
              {recommendedUsers.map((user: any) => (
                <Card key={user._id} className="w-[250px]">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={user.avatar}
                        alt={`${user.username}'s avatar`}
                      />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <CardTitle>{user.username}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => addFriendHandler(user._id)}
                      className="w-full"
                    >
                      Add Friend
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Paginated Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Sent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <PaginatedComponent
              queryKey={`sent__requests_${loggedInUser?.id}`}
              queryFn={getAllSentRequestsPaginated}
              setInvalidationKey={(key: any) => setSendCardKey(key)}
              itemsPerPage={5}
              renderItem={(user) => (
                <div>
                  <h2 className="text-lg font-semibold">
                    {user.receiverDetails.username}
                  </h2>
                </div>
              )}
              keyExtractor={(user: any) => user._id}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Received Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <PaginatedComponent
              queryKey={`recieved_requests_${loggedInUser?.id}`}
              setInvalidationKey={(key: any) => setIncomingCardKey(key)}
              queryFn={getAllIncomingRequestsPaginated}
              itemsPerPage={5}
              renderItem={(request: any) => (
                <div>
                  <h2 className="text-lg font-semibold">
                    {request?.senderDetails?.username}
                  </h2>
                  <Button onClick={() => acceptRequestHandler(request._id)}>
                    Accept
                  </Button>
                  <Button onClick={() => rejectRequestHandler(request._id)}>
                    Reject
                  </Button>
                </div>
              )}
              keyExtractor={(request) => request._id}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>All Friends</CardTitle>
          </CardHeader>
          <CardContent>
            <PaginatedComponent
              queryKey={`all_friends_${loggedInUser?.id}`}
              setInvalidationKey={(key: any) => setAllCardKey(key)}
              queryFn={getAllFriendsPaginated}
              itemsPerPage={5}
              renderItem={(user: any) => (
                <div>
                  <h2 className="text-lg font-semibold w-full">{user?.friendDetails?.username}</h2>
                </div>
              )}
              keyExtractor={(user) => user._id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
