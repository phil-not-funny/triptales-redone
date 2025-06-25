"use client";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { UserProfileProps } from "./UserProfile";
import UserService from "@/lib/services/userService";
import { useEffect, useState } from "react";
import { UserPrivateResponse } from "@/types/RequestTypes";

const UserProfileControls: React.FC<UserProfileProps> = ({ user }) => {
  const [client, setClient] = useState<UserPrivateResponse | null>(null);
  const [following, setFollowing] = useState<boolean>(user.userFollowing);

  const init = async () => {
    const response = await UserService.me();
    if (response) setClient(response);
  };

  useEffect(() => {
    init();
  }, []);

  const loggedIn = Boolean(user);
  const canInteract = loggedIn && client?.username !== user.username;

  const handleFollow = async () => {
    const success = await UserService.follow(user.guid);
    if (success) {
      const newStatus = !following;
      setFollowing(newStatus);
      toast.success(
        `You are ${newStatus ? "now" : "no longer"} following ${user.displayName}`,
      );
    } else {
      toast.error(`Something went wrong. Please try again later.`);
    }
  };

  return (
    <>
      <Button
        disabled={!canInteract}
        onClick={handleFollow}
        variant={"outline"}
      >
        {following ? "Unfollow" : "Follow"}
      </Button>
      <Button disabled={!canInteract} variant={"outline"}>
        Message
      </Button>
    </>
  );
};
