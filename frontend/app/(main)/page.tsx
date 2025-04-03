"use client";

import { useUser } from "@/components/provider/UserProvider";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      <h1 className="font-title-plax text-primary text-center text-xl font-semibold break-words uppercase md:text-6xl">
        Welcome to Triptales {user?.displayName}
      </h1>
    </div>
  );
}
