"use client";

import { AnimatePresence } from "framer-motion";
import { MotionDiv } from "../Motion";
import { usePathname } from "next/navigation";
import { PropsWithClassNameAndChildren } from "@/types/ComponentTypes";

interface Props extends PropsWithClassNameAndChildren {
    deltaX?: number;
}

const CardPageTransistion: React.FC<Props> = ({
  children,
  className,
  deltaX = 100,
}) => {
  const path = usePathname();

  return (
    <AnimatePresence mode="popLayout">
      <MotionDiv
        key={path}
        initial={{ x: deltaX, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -deltaX, opacity: 0 }}
        className={className}
      >
        {children}
      </MotionDiv>
    </AnimatePresence>
  );
};

export default CardPageTransistion;
