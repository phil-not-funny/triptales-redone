"use client";

import { UserDetailedResponse } from "@/types/RequestTypes";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Verified } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { PropsWithClassName } from "@/types/ComponentTypes";
import { formatDateOnlyString } from "@/lib/utils";
import Image from "next/image";
import { Fragment, useState } from "react";
import UserService from "@/lib/services/userService";
import { toast } from "sonner";
import { useUser } from "../providers/UserProvider";

const UserProfileCardContent: React.FC<UserProfileProps> = ({ user }) => {
  const { loggedIn, user: client } = useUser();
  const canInteract = loggedIn && client?.username !== user.username;

  const [followerCount, setFollowerCount] = useState<number>(
    user.followerCount,
  );
  const [following, setFollowing] = useState<boolean>(user.follows);

  const handleFollow = async () => {
    const success = await UserService.follow(user.guid);
    if (success) {
      const newStatus = !following;
      setFollowing(newStatus);
      setFollowerCount((prev) => prev + (newStatus ? 1 : -1));
      toast.success(
        `You are ${newStatus ? "now" : "no longer"} following ${user.displayName}`,
      );
    } else {
      toast.error(`Something went wrong. Please try again later.`);
    }
  };

  return (
    <Fragment>
      <CardHeader className="flex items-center gap-6 border-b border-gray-100 pb-6">
        {/* Avatar */}
        <Avatar className="h-24 w-24">
          <AvatarFallback className="text-4xl">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{user.displayName}</h1>
            {user.verified && (
              <Verified className="text-primary-saturated h-6 w-6" />
            )}
          </div>
          <p className="mt-1 text-sm text-gray-700">@{user.username}</p>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <span>
              <span className="font-medium">{followerCount}</span> Followers
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-6">
        <div className="px-4">
          <h2 className="mb-2 text-lg font-medium">About</h2>
          <p className="text-sm leading-relaxed">
            {user.biography ||
              `${user.displayName} has not provided a biography yet.`}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 rounded-lg bg-gray-100 p-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium">Joined</h3>
            <p className="mt-1 text-xs">
              {formatDateOnlyString(user.memberSince)}
            </p>
          </div>
          {user.placeOfResidence && (
            <div>
              <h3 className="text-sm font-medium">Place of Residence</h3>
              <p className="mt-1 text-xs">{user.placeOfResidence}</p>
            </div>
          )}
          {user.favoriteDestination && (
            <div>
              <h3 className="text-sm font-medium">Favorite Destination</h3>
              <p className="mt-1 text-xs">{user.favoriteDestination}</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-6 flex gap-3">
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
      </CardFooter>
    </Fragment>
  );
};

interface UserProfileProps {
  user: UserDetailedResponse;
}

export const UserProfile: React.FC<UserProfileProps & PropsWithClassName> = ({
  user,
  className,
}) => {
  return (
    <Card className={`w-full max-w-3xl p-8 ${className}`}>
      <UserProfileCardContent user={user} />
    </Card>
  );
};

interface UserProfileWithBannerProps {
  user: UserDetailedResponse;
  bannerImage?: string;
}

export const UserProfileWithBanner: React.FC<
  UserProfileWithBannerProps & PropsWithClassName
> = ({ user, bannerImage = "/images/default-background.jpg", className }) => {
  return (
    <Card className={`w-full max-w-3xl pt-0 shadow-sm ${className}`}>
      {/* Banner Section */}
      <div className="relative mb-6 h-48 w-full overflow-hidden">
        <Image
          src={bannerImage}
          alt="User Banner"
          width={1200}
          height={300}
          className="h-full w-full object-cover"
          priority
        />
      </div>

      <UserProfileCardContent user={user} />
    </Card>
  );
};
