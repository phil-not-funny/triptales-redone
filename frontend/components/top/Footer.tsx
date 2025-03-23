"use client";

import { Typography } from "@/components/Materials";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 flex w-full flex-row flex-wrap items-center justify-around gap-x-12 gap-y-6 border-t border-zinc-800 bg-neutral-900 px-10 py-6 text-center text-neutral-300 md:justify-between">
      <Typography color="white" className="font-normal">
        &copy; 2025 Proxreal, Philip Schrenk
      </Typography>
      <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
        <li>
          <Link href="/about">
            <Typography
              color="white"
              className="font-normal transition-colors hover:text-pink-600 focus:text-pink-600"
            >
              About
            </Typography>
          </Link>
        </li>
        <li>
          <Link href={"/about#what-is-proxreal"}>
            <Typography
              color="white"
              className="font-normal transition-colors hover:text-pink-600 focus:text-pink-600"
            >
              What is Proxreal?
            </Typography>
          </Link>
        </li>
        <li>
          <Link href={"/contact"}>
            <Typography
              color="white"
              className="font-normal transition-colors hover:text-pink-600 focus:text-pink-600"
            >
              Contact
            </Typography>
          </Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
