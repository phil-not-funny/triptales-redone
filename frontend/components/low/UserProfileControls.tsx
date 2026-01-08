"use client";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { UserProfileProps } from "./UserProfile";
import UserService from "@/lib/services/userService";
import { useState } from "react";
import useUser from "@/hooks/useUser";
import { useTranslations } from 'next-intl';

const UserProfileControls: React.FC<UserProfileProps> = ({ user }) => {
  const [following, setFollowing] = useState<boolean>(user.userFollowing);
  
  const { user: client, loggedIn: loggedIn } = useUser();
  const canInteract = loggedIn && client?.username !== user.username;
  const t = useTranslations("UserProfile");
  const tCommon = useTranslations("Common");

  const handleFollow = async () => {
    const success = await UserService.follow(user.guid);
    if (success) {
      const newStatus = !following;
      setFollowing(newStatus);
      const statusText = newStatus ? t("now") : t("noLonger");
      toast.success(t("followSuccess", { displayName: user.displayName, status: statusText }));
    } else {
      toast.error(t("followError"));
    }
  };

  return (
    <>
      <Button
        disabled={!canInteract}
        onClick={handleFollow}
        variant={"outline"}
      >
        {following ? tCommon("unfollow") : tCommon("follow")}
      </Button>
      <Button disabled={!canInteract} variant={"outline"}>
        {tCommon("message")}
      </Button>
    </>
  );
};

export default UserProfileControls;