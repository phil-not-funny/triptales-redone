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
      <div className="flex h-40 w-full items-center justify-center overflow-hidden object-cover shadow-md sm:h-80">
        <Image
          src={"/images/homepage-background.jpg"}
          width={8640}
          height={5760}
          alt="Explore image"
          className="h-auto w-full object-cover"
        />
      </div>
      <Post post={examplePost} />
    </div>
  );
}
