import Page from "@/components/pages/SettingsPage/SettingsPage";
import PageHead from "@/components/top/PageHead";
import { getTranslations } from 'next-intl/server';
import LoginRequired from "@/components/low/LoginRequired";
import UserService from "@/lib/services/userService";

export default async function SettingsPage() {
  if (!(await UserService.me())) return <LoginRequired />;

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
