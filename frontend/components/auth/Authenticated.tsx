"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useUser } from "../providers/UserProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Loading from "../top/Loading";

const Authenticated: React.FC<PropsWithChildren> = ({ children }) => {
  const { loggedIn } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const init = async () => {
    if (!loggedIn) {
      toast.error("Please log in to continue.");
      router.push("/landing");
    } else
    setLoading(false);
  };

  useEffect(() => {
    init();
  });

  return !loading ? children : <Loading />;
};

export default Authenticated;
