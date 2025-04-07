"use client";

import userService from "@/lib/services/userService";
import {
  LoginRequest,
  RegisterRequest,
  UserPrivateResponse,
} from "@/types/ReqeuestTypes";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import Loading from "../top/Loading";

export type LoginContextResponse = {
  user?: UserPrivateResponse;
  message: string;
};

export type RegisterContextResponse = {
  success: boolean;
  message: string;
};

type UserContextType = {
  user: UserPrivateResponse | null;
  register: (values: RegisterRequest) => Promise<RegisterContextResponse>;
  login: (values: LoginRequest) => Promise<LoginContextResponse>;
  loggedIn: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null); // error here! Problem: the classes are defined down there

export const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<UserPrivateResponse | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const response = await userService.me();
      if (response) {
        setUser(response);
      } else {
        setUser(null);
      }
      setLoggedIn(!!response);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
      setLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  });

  const register = async (
    values: RegisterRequest,
  ): Promise<RegisterContextResponse> => {
    const response = await userService.login(values);
    return { success: response.status === 200, message: response.message };
  };

  const login = async (values: LoginRequest): Promise<LoginContextResponse> => {
    const response = await userService.login(values);
    if (response.status === 200) {
      setUser(response.data!);
      setLoggedIn(true);
    }
    return { user: response.data, message: response.message };
  };

  const logout = async () => {
    if (await userService.logout()) {
      setUser(null);
      setLoggedIn(false);
    } else console.error("Logout failed");
  };

  const context: UserContextType = {
    user,
    register,
    login,
    loggedIn,
    logout,
    refreshUser,
  };

  if (isLoading) return <Loading />;
  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context as UserContextType;
}
