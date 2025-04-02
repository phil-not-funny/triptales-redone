"use client";

import Authenticated from "@/components/auth/Authenticated";
import { useUser } from "@/components/provider/UserProvider";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export default function Home() {
  const { user, logout } = useUser();

  return (
    <Authenticated>
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <h1 className="text-primary text-6xl font-bold">
          Welcome to Triptales {user?.displayName}
        </h1>
        <Button variant={"outline"} onClick={async () => await logout()}>
          <ArrowLeftIcon /> Logout
        </Button>
      </div>
    </Authenticated>
  );
}
