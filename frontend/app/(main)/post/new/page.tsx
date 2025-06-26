import { NewPostForm } from "@/components/forms/NewPostForm";
import PageHead from "@/components/top/PageHead";

export default function NewPostPage() {
  return (
    <PageHead className="pt-24">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">New Post</h1>
        <div className="w-full max-w-4xl px-3 md:px-0">
          <NewPostForm />
        </div>
      </div>
    </PageHead>
  );
}
