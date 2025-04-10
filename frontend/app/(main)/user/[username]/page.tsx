import UserProfilePage from "@/components/pages/UserProfilePage";
import { PageHead } from "@/components/top/PageHead";

interface UserPageProps {
  params: Promise<{ username: string }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;

  return (
    <PageHead>
      <UserProfilePage username={username} />
    </PageHead>
  );
}
