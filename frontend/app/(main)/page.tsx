"use client";

import Post from "@/components/low/Post";
import { useUser } from "@/components/providers/UserProvider";
import Image from "next/image";

const examplePost = {
  author: {
    displayName: "Test",
    username: "TestUser",
    email: "",
    guid: "",
  },
  createdAt: new Date(2025, 1, 2),
  description:
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
  title: "Test Post across Europe and Spengergasse",
  endDate: new Date(2025, 0, 31),
  likes: [],
  startDate: new Date(2025, 0, 25),
  guid: "1234-1234-1234",
};

export default function Home() {
  const { user } = useUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="relative mb-12 flex h-40 w-full items-center justify-center overflow-hidden object-cover shadow-lg sm:h-80">
        <Image
          src={"/images/homepage-background.jpg"}
          width={8640}
          height={5760}
          alt="Explore image"
          className="h-auto w-full object-cover"
        />
        <div className="absolute flex translate-y-1/2 flex-col items-center justify-center">
          <h1 className="text-primary-saturated text-3xl text-shadow-lg/30 font-bold tracking-wider uppercase md:text-5xl">
            Explore Posts
          </h1>
          <p className="text-primary-main text-lg text-shadow-lg/30 tracking-tight">
            Discover Stories from Every Corner of the World.
          </p>
        </div>
      </div>
      <Post post={examplePost} />
    </div>
  );
}
