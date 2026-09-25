"use client";

import { AnimatePresence } from "framer-motion";
import { MotionDiv } from "../Motion";
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface Props {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  deltaY?: number;
}

const isAuthPage = (path: string) =>
  path.includes("signup") || path.includes("login");

const CardPageTransistion: React.FC<Props> = ({
  children,
  className,
  duration = 0.3,
  deltaY = 500,
}) => {
  const key = usePathname();

  // Every visit of the login or signup page mirrors the slide direction of the
  // pages that follow it. `sign` is the direction a page enters with; it is
  // adjusted while rendering, when the path changes.
  const [current, setCurrent] = useState({ key, sign: 1 });
  if (current.key !== key) {
    setCurrent({
      key,
      sign: isAuthPage(current.key) ? -current.sign : current.sign,
    });
  }
  const enterY = deltaY * current.sign;
  const exitY = isAuthPage(current.key) ? enterY : -enterY;

  return (
    <AnimatePresence mode="popLayout">
      <MotionDiv
        initial={{ y: enterY, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: exitY, opacity: 0 }}
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
  // The context of the page being animated out must not follow the new route.
  const [frozen] = useState(context);

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
}

export default CardPageTransistion;
