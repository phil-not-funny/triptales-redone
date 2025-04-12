import Page from "@/components/pages/PostPage";
import { PageHead } from "@/components/top/PageHead";

interface UserPageProps {
  params: Promise<{ guid: string }>;
}

export default async function PostPage({ params }: UserPageProps) {
  const { guid } = await params;

  return (
    <PageHead className="flex items-center justify-center">
      <Page guid={guid} />
    </PageHead>
  );
}
