import { useEffect, useState } from "react";
import UserService from "@/lib/services/userService";
import { UserPrivateResponse } from "@/types/RequestTypes";

export default function useUser() {
  const [user, setUser] = useState<UserPrivateResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    UserService.me().then((res) => {
      setUser(res ?? null);
      setLoading(false);
    });
  }, []);

  return { user, loggedIn: !!user, loading };
}
