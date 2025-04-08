"use client";

import { UserPublicResponse } from "@/types/ReqeuestTypes";
import UserProfile from "../low/UserProfile";
import Image from "next/image";
import UserProfileWithBanner from "../low/UserProfileWithBanner";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import UserService from "@/lib/services/userService";

interface UserProfileWithBackgroundProps {
  username: string;
}

const UserProfilePage: React.FC<UserProfileWithBackgroundProps> = ({
  username,
}) => {
  const [user, setUser] = useState<UserPublicResponse | null>(null);
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
    <h1>User not Found</h1>
  );
};

export default UserProfilePage;
