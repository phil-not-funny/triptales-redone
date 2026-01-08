import Page from "@/components/pages/SettingsPage/SettingsPage";
import PageHead from "@/components/top/PageHead";
import { getTranslations } from 'next-intl/server';

export default async function SettingsPage() {
  const t = await getTranslations("Settings");

  return (
    <PageHead className="pt-24">
      <div className="flex h-full w-full flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold">{t("title")}</h1>

        <Page />
      </div>
    </PageHead>
  );
}
