"use client";

import { PropsWithChildren } from "react";
import { UserProvider } from "./UserProvider";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return <UserProvider>{children}</UserProvider>;
};

export default Providers;
