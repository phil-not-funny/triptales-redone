"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";

type UserFollowState = {
  following: boolean;
  followerCount: number;
  setFollowing: (following: boolean) => void;
};

const UserFollowContext = createContext<UserFollowState | null>(null);

interface UserFollowProviderProps {
  initialFollowing: boolean;
  initialFollowerCount: number;
}

// Shares the follow state between the follow button and the follower count on a profile
export const UserFollowProvider = ({
  initialFollowing,
  initialFollowerCount,
  children,
}: PropsWithChildren<UserFollowProviderProps>) => {
  const [following, setFollowingState] = useState<boolean>(initialFollowing);
  const [followerCount, setFollowerCount] = useState<number>(initialFollowerCount);

  const setFollowing = (value: boolean) => {
    if (value === following) return;
    setFollowingState(value);
    setFollowerCount((prev) => prev + (value ? 1 : -1));
  };

  return (
    <UserFollowContext.Provider value={{ following, followerCount, setFollowing }}>
      {children}
    </UserFollowContext.Provider>
  );
};

export const useUserFollow = () => {
  const context = useContext(UserFollowContext);
  if (!context)
    throw new Error("useUserFollow must be used within a UserFollowProvider");
  return context;
};

export const FollowerCount = () => {
  const { followerCount } = useUserFollow();
  return <span className="font-medium">{followerCount}</span>;
};
