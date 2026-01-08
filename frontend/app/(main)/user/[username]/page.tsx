import { UserDetailedResponse } from "@/types/RequestTypes";
import UserService from "@/lib/services/userService";
import Sorry from "@/components/low/Sorry";
import { UserProfileWithBanner } from "@/components/low/UserProfile";
import Post from "@/components/low/Post";
import { ArrowDown } from "lucide-react";
import PageHead from "@/components/top/PageHead";
import { getTranslations } from 'next-intl/server';

interface UserPageProps {
  params: Promise<{ username: string }>;
}

export const revalidate = 60;
export const dynamicParams = true; 

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;
  const t = await getTranslations("Sorry");
  const tPages = await getTranslations("Pages");

  const user: UserDetailedResponse | null = await UserService.getByUsername(username);

  const backgroundImage = "/images/default-background.jpg";

  return user ? (
    <PageHead>
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-10">
        <UserProfileWithBanner
          user={user}
          bannerImage={backgroundImage}
          className="rounded-none lg:rounded-lg"
        />
        {user.posts.length > 0 && (
          <h1 className="flex w-full items-center justify-center gap-4 text-center text-2xl font-bold">
            <ArrowDown /> {tPages("posts")} <ArrowDown />
          </h1>
        )}
      </div>
      {user.posts.map((post) => (
        <Post key={post.guid} post={post} embed />
      ))}
    </PageHead>
  ) : (
    <Sorry className="h-screen">
      {t("userNotFound")}
    </Sorry>
  );
}
