"use client";

import { UserDetailedResponse } from "@/types/RequestTypes";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import Loading from "../top/Loading";
import UserService from "@/lib/services/userService";
import Sorry from "../low/Sorry";
import { UserProfile, UserProfileWithBanner } from "../low/UserProfile";
import Post from "../low/Post";
import { ArrowDown, ArrowDown01 } from "lucide-react";
import { PageHead } from "../top/PageHead";

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
    <PageHead>
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-10">
        <UserProfileWithBanner
          user={user}
          bannerImage={backgroundImage}
          className="rounded-none lg:rounded-lg"
        />
        {user.posts.length > 0 && (
          <h1 className="flex w-full items-center justify-center gap-4 text-center text-2xl font-bold">
            <ArrowDown /> Posts <ArrowDown />
          </h1>
        )}
      </div>
      {user.posts.map((post) => (
        <Post key={post.guid} post={post} embed />
      ))}
    </PageHead>
  ) : loading ? (
    <Loading />
  ) : (
    <Sorry className="h-screen">
      We were unable to find the user you provided.
    </Sorry>
  );
};

export default UserProfilePage;
