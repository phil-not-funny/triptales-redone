"use client";

import { Fragment, PropsWithChildren, useEffect } from "react";
import { useUser } from "../provider/UserProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Authenticated: React.FC<PropsWithChildren> = ({ children }) => {
  const { loggedIn } = useUser();
  const router = useRouter();

  const init = async () => {
    if (!loggedIn) {
      toast.error("Please log in to continue.");
      router.push("/landing");
    }
  };

  useEffect(() => {
    init();
  }, []);

  return <Fragment>{children}</Fragment>;
};

export default Authenticated;
