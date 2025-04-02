"use client";

import userService from "@/lib/services/userService";
import {
  LoginRequest,
  RegisterRequest,
  UserPrivateResponse,
} from "@/types/ReqeuestTypes";
import { createContext, PropsWithChildren, useContext, useState } from "react";

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
  isLoggedIn: () => Promise<boolean>;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null); // error here! Problem: the classes are defined down there

export const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<UserPrivateResponse | null>(null);

  const register = async (
    values: RegisterRequest,
  ): Promise<RegisterContextResponse> => {
    const response = await userService.login(values);
    return { success: response.status === 200, message: response.message };
  };

  const login = async (values: LoginRequest): Promise<LoginContextResponse> => {
    const response = await userService.login(values);
    if (response.status === 200) setUser(response.data!);
    return { user: response.data, message: response.message };
  };

  const logout = async () => {
    if (await userService.logout()) setUser(null);
    else console.error("Logout failed");
  };

  const isLoggedIn = async (): Promise<boolean> => {
    const response = await userService.me();
    if (response) setUser(response);
    return !!response;
  };

  const context: UserContextType = {
    user,
    register,
    login,
    isLoggedIn,
    logout,
  };

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
