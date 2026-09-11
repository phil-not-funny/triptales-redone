"use client";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { UserProfileProps } from "./UserProfile";
import UserService from "@/lib/services/userService";
import { useState } from "react";
import useUser from "@/hooks/useUser";
import { useTranslations } from 'next-intl';
import { useRouter } from "next/navigation";
import { Verified } from "lucide-react";
import { useUserFollow } from "./UserFollowContext";

const UserProfileControls: React.FC<UserProfileProps> = ({ user }) => {
  const { following, setFollowing } = useUserFollow();
  const [verified, setVerified] = useState<boolean>(!!user.verified);

  const { user: client, loggedIn: loggedIn, isAdmin } = useUser();
  const canInteract = loggedIn && client?.username !== user.username;
  const router = useRouter();
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

  const handleVerify = async () => {
    const newStatus = !verified;
    const success = await UserService.setVerified(user.guid, newStatus);
    if (success) {
      setVerified(newStatus);
      toast.success(
        t(newStatus ? "verifySuccess" : "unverifySuccess", { displayName: user.displayName }),
      );
      // The verified badge is rendered on the server, refresh to update it
      router.refresh();
    } else {
      toast.error(t("verifyError"));
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
      {isAdmin && (
        <Button onClick={handleVerify} variant={"outline"}>
          <Verified />
          {verified ? t("unverify") : t("verify")}
        </Button>
      )}
    </>
  );
};

export default UserProfileControls;
