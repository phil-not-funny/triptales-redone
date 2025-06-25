import Authenticated from "@/components/auth/Authenticated";
import Page from "@/components/pages/NewPostPage";
import PageHead from "@/components/top/PageHead";

export default function NewPostPage() {
  return (
    <Authenticated>
      <PageHead className="pt-24">
        <Page />
      </PageHead>
    </Authenticated>
  );
}
