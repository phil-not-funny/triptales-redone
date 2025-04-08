import { UserPublicResponse } from "@/types/ReqeuestTypes";
import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Verified } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { PropsWithClassName } from "@/types/ComponentTypes";

interface UserProfileWithBannerProps {
  user: UserPublicResponse;
  bannerImage?: string;
}

const UserProfileWithBanner: React.FC<
  UserProfileWithBannerProps & PropsWithClassName
> = ({ user, bannerImage = "/images/default-background.jpg", className }) => {
  return (
    <Card className={`w-full max-w-3xl pt-0 shadow-sm ${className}`}>
      {/* Banner Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={bannerImage}
          alt="User Banner"
          width={1200}
          height={300}
          className="h-full w-full object-cover"
          priority
        />
      </div>

      {/* Content Section */}
      <CardContent className="p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between gap-6 border-b border-gray-100 pt-0 pb-6">
          {/* Avatar */}
          <Avatar className="h-24 w-24 rounded-full border-4 border-white">
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
            <p className="mt-1 text-sm">@{user.username}</p>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <span>
                <span className="font-medium">
                  {user.following?.length || 0}
                </span>{" "}
                Following
              </span>
            </div>
          </div>
        </div>

        {/* Bio Section (Placeholder) */}
        <div className="mt-6">
          <h2 className="mb-2 text-lg font-medium">About</h2>
          <p className="text-sm leading-relaxed">
            {user.displayName} hasn't added a bio yet.
          </p>
        </div>

        {/* Stats or Additional Info */}
        <div className="mt-6 flex flex-col gap-4 md:flex-row">
          <div className="flex-1 rounded-lg bg-gray-50 p-4">
            <h3 className="text-sm font-medium">Joined</h3>
            <p className="mt-1 text-xs">April 2025</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <Button variant={"outline"}>Follow</Button>
          <Button variant={"outline"}>Message</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileWithBanner;
