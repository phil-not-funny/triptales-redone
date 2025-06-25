import PageHead from "@/components/top/PageHead";
import RandomPosts from "@/components/top/RandomPosts";
import Image from "next/image";

export default function Home() {
  return (
    <PageHead className="flex min-h-screen flex-col items-center gap-6">
      <div className="relative mb-12 flex h-40 w-full items-center justify-center overflow-hidden object-cover shadow-lg sm:h-80">
        <Image
          src={"/images/homepage-background.jpg"}
          width={8640}
          height={5760}
          alt="Explore image"
          className="h-auto w-full object-cover"
        />
        <div className="absolute flex translate-y-1/2 flex-col items-center justify-center">
          <h1 className="text-primary-saturated text-3xl font-bold tracking-wider uppercase text-shadow-lg/30 md:text-5xl">
            Explore Posts
          </h1>
          <p className="text-primary-main text-lg tracking-tight text-shadow-lg/30">
            Discover Stories from Every Corner of the World.
          </p>
        </div>
      </div>
      <RandomPosts />
    </PageHead>
  );
}
