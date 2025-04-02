"use client";

import { PropsWithChildren } from "react";
import { UserProvider } from "./UserProvider";
import { SidebarProvider } from "../ui/sidebar";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <UserProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </UserProvider>
  );
};

export default Providers;
