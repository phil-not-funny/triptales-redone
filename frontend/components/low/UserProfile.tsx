import { UserPublicResponse } from "@/types/ReqeuestTypes";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Verified } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { PropsWithClassName } from "@/types/ComponentTypes";

interface UserProfileProps {
  user: UserPublicResponse;
}

const UserProfile: React.FC<UserProfileProps & PropsWithClassName> = ({ user, className }) => {
  return (
    <Card className={`w-full max-w-3xl p-8 ${className}`}>
      {/* Header Section */}
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
              <span className="font-medium">{user.following?.length || 0}</span>{" "}
              Following
            </span>
          </div>
        </div>
      </CardHeader>

      {/* Bio Section (Placeholder) */}
      <CardContent className="mt-6">
        <h2 className="mb-2 text-lg font-medium">About</h2>
        <p className="text-sm leading-relaxed">
          {user.displayName} hasn't added a bio yet.
        </p>
      </CardContent>

      {/* Stats or Additional Info */}
      <div className="mt-6 flex flex-col gap-4 md:flex-row">
        <div className="flex-1 rounded-lg bg-gray-50 p-4">
          <h3 className="text-sm font-medium">Joined</h3>
          <p className="mt-1 text-xs">April 2025</p>
        </div>
      </div>

      {/* Action Buttons */}
      <CardFooter className="mt-6 flex gap-3">
        <Button variant={"outline"}>Follow</Button>
        <Button variant={"outline"}>Message</Button>
      </CardFooter>
    </Card>
  );
};

export default UserProfile;
