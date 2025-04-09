"use client";

import { UserDetailedResponse, UserPublicResponse } from "@/types/RequestTypes";
import UserProfile from "../low/UserProfile";
import Image from "next/image";
import UserProfileWithBanner from "../low/UserProfileWithBanner";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import UserService from "@/lib/services/userService";
import Sorry from "../low/Sorry";

interface UserProfileWithBackgroundProps {
  username: string;
}

const UserProfilePage: React.FC<UserProfileWithBackgroundProps> = ({
  username,
}) => {
  const [user, setUser] = useState<UserDetailedResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const init = async () => {
    const response = await UserService.getByUsername(username);

    if (response) setUser(response);
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, [username]);

  const backgroundImage = "/images/default-background.jpg";

  return user ? (
    <div className="relative min-h-screen w-full items-center justify-center lg:flex">
      <Image
        className="absolute z-0 hidden h-auto w-full overflow-hidden object-scale-down lg:block"
        src={backgroundImage}
        alt="Background Image"
        width={1920}
        height={1080}
      />
      <div className="z-10 flex h-full w-full items-center justify-center lg:absolute">
        <UserProfile user={user} className="hidden lg:block" />
        <UserProfileWithBanner
          user={user}
          bannerImage={backgroundImage}
          className="block rounded-none lg:hidden"
        />
      </div>
    </div>
  ) : loading ? (
    <Loading />
  ) : (
    <Sorry className="h-screen">We were unable to find the user you provided.</Sorry>
  );
};

export default UserProfilePage;
