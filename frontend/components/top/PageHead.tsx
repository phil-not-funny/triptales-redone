"use client";

import { PropsWithClassNameAndChildren } from "@/types/ComponentTypes";
import { motion as m } from "framer-motion";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  className?: string;
}

export const PageHead: React.FC<Props> = ({ children, className }) => {
  return (
    <m.div
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 80 }}
      className={`w-full min-h-screen ${className}`}
    >
      {children}
    </m.div>
  );
};

export const WithPageHead: React.FC<PropsWithClassNameAndChildren> = ({ children, className }) => {
  return <PageHead className={`pt-24 ${className}`}>{children}</PageHead>;
};
