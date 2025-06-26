import DynamicPostComments from "@/components/low/DynamicPostComments";
import Post from "@/components/low/Post";
import Sorry from "@/components/low/Sorry";
import PageHead from "@/components/top/PageHead";
import PostService from "@/lib/services/postService";

interface UserPageProps {
  params: Promise<{ guid: string }>;
}

export const revalidate = 60;

export default async function PostPage({ params }: UserPageProps) {
  const { guid } = await params;

  const post = (await PostService.getPost(guid)).data;

  return !post ? (
    <Sorry>The post you were looking for doesn't exist.</Sorry>
  ) : (
    <PageHead className="gap-6 md:pt-12">
      <Post embed={false} post={post} />
      <DynamicPostComments post={post} />
    </PageHead>
  );
}
