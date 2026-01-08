import { NewPostForm } from "@/components/forms/NewPostForm";
import PageHead from "@/components/top/PageHead";
import { getTranslations } from 'next-intl/server';

export default async function NewPostPage() {
  const t = await getTranslations("Pages");

  return (
    <PageHead className="pt-24">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">{t("newPost")}</h1>
        <div className="w-full max-w-4xl px-3 md:px-0">
          <NewPostForm />
        </div>
      </div>
    </PageHead>
  );
}
