import { PostForm } from "@/components/forms/PostForm";
import PageHead from "@/components/top/PageHead";
import { getTranslations } from "next-intl/server";
import LoginRequired from "@/components/low/LoginRequired";
import Sorry from "@/components/low/Sorry";
import UserService from "@/lib/services/userService";
import PostService from "@/lib/services/postService";

interface EditPostPageProps {
  params: Promise<{ guid: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const user = await UserService.me();
  if (!user) return <LoginRequired />;

  const { guid } = await params;
  const post = (await PostService.getPost(guid)).data;
  const tSorry = await getTranslations("Sorry");
  if (!post) return <Sorry>{tSorry("postNotFound")}</Sorry>;
  if (post.author.guid !== user.guid && user.role !== "Admin")
    return <Sorry includeTryAgain={false}>{tSorry("notAllowed")}</Sorry>;

  const t = await getTranslations("Pages");

  return (
    <PageHead className="pt-24">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">{t("editPost")}</h1>
        <div className="w-full max-w-4xl px-3 md:px-0">
          <PostForm mode="edit" post={post} />
        </div>
      </div>
    </PageHead>
  );
}
