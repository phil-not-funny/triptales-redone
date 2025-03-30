import CardPageTransistion from "@/components/low/CardPageTransition";
import { MotionDiv } from "@/components/Motion";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Fragment>
      <div className="absolute top-0 left-0 z-0 hidden max-h-screen min-h-screen max-w-screen min-w-screen overflow-clip sepia-50 md:flex md:justify-center">
        <Image
          src={"/images/default-background.jpg"}
          width={1920}
          height={1080}
          alt="Picture by Claudio Testa on Unsplash"
          className="z-0 h-screen w-auto object-cover blur-xs 2xl:h-auto 2xl:w-screen"
        />
      </div>
      <div className="absolute bottom-0 left-0 z-10 p-2">
        <p className="text-sm text-neutral-100 italic">
          Picture by{" "}
          <Link
            target="_blank"
            className="underline"
            href="https://unsplash.com/de/@claudiotesta?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
          >
            Claudio Testa
          </Link>{" "}
          on{" "}
          <Link
            target="_blank"
            className="underline"
            href="https://unsplash.com/de/fotos/grune-hugel-mit-wald-unter-bewolktem-himmel-am-tag--SO3JtE3gZo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
          >
            Unsplash
          </Link>
        </p>
      </div>
      <div className="absolute z-10 h-full w-full max-w-screen overflow-hidden">
        <CardPageTransistion className="h-full w-full">
          {children}
        </CardPageTransistion>
      </div>
    </Fragment>
  );
}
