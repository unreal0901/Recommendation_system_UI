"use client";

import { useEffect, useState } from "react";
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
import { ChevronDown, LogOut, User } from "lucide-react";
import { useAuthStore } from "@/app/client/lib/store/useAuthStore";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  avatar: string;
}

const recommendedUsers: User[] = [
  { id: "1", name: "Alice", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "2", name: "Bob", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "3", name: "Charlie", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "4", name: "David", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "5", name: "Eve", avatar: "/placeholder.svg?height=40&width=40" },
];

export function ProfileComponents() {
  const { loggedInUser, logout } = useAuthStore();
  const handleLogout = () => {
    logout();
  };

  const [requests, setRequests] = useState({
    sent: ["Frank", "Grace"],
    received: ["Henry", "Isabel"],
  });

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Requests <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem>
                <span className="font-medium">
                  Sent Requests ({requests.sent.length})
                </span>
              </DropdownMenuItem>
              {requests.sent.map((user, index) => (
                <DropdownMenuItem key={`sent-${index}`}>
                  {user}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem>
                <span className="font-medium">
                  Received Requests ({requests.received.length})
                </span>
              </DropdownMenuItem>
              {requests.received.map((user, index) => (
                <DropdownMenuItem key={`received-${index}`}>
                  {user}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
        <h2 className="text-xl font-semibold mb-4">Recommended Users</h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {recommendedUsers.map((user) => (
              <Card key={user.id} className="w-[250px]">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={user.avatar}
                      alt={`${user.name}'s avatar`}
                    />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{user.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Connect</Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
