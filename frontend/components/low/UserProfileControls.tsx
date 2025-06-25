"use client";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { UserProfileProps } from "./UserProfile";
import UserService from "@/lib/services/userService";
import { useState } from "react";
import useUser from "@/hooks/useUser";

const UserProfileControls: React.FC<UserProfileProps> = ({ user }) => {
  const [following, setFollowing] = useState<boolean>(user.userFollowing);
  
  const { user: client, loggedIn: loggedIn } = useUser();
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

export default UserProfileControls;