import DynamicPostComments from "@/components/low/DynamicPostComments";
import Post from "@/components/low/Post";
import Sorry from "@/components/low/Sorry";
import PageHead from "@/components/top/PageHead";
import PostService from "@/lib/services/postService";
import { getTranslations } from 'next-intl/server';

interface UserPageProps {
  params: Promise<{ guid: string }>;
}

export const revalidate = 60;

export default async function PostPage({ params }: UserPageProps) {
  const { guid } = await params;
  const t = await getTranslations("Sorry");

  const post = (await PostService.getPost(guid)).data;

  return !post ? (
    <Sorry>{t("postNotFound")}</Sorry>
  ) : (
    <PageHead className="gap-6 md:pt-12">
      <Post embed={false} post={post} />
      <DynamicPostComments post={post} />
    </PageHead>
  );
}
