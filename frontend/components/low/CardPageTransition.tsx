"use client";

import { AnimatePresence } from "framer-motion";
import { MotionDiv } from "../Motion";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface Props {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  deltaY?: number;
}

const CardPageTransistion: React.FC<Props> = ({
  children,
  className,
  duration = 0.3,
  deltaY = 500,
}) => {
  const key = usePathname();
  const [y, setY] = useState<number>(deltaY);
  useEffect(() => {
    if (key.includes("signup") || key.includes("login")) setY((y) => y * -1);
  }, [key]);

  return (
    <AnimatePresence mode="popLayout">
      <MotionDiv
        initial={{ y: y, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: y * -1, opacity: 0 }}
        transition={{ ease: "easeOut", duration }}
        className={className}
        key={key}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </MotionDiv>
    </AnimatePresence>
  );
};
function FrozenRouter(props: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext ?? {});
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
}

export default CardPageTransistion;
