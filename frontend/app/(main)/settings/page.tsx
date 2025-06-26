import Page from "@/components/pages/SettingsPage/SettingsPage";
import PageHead from "@/components/top/PageHead";

export default function SettingsPage() {
  return (
    <PageHead className="pt-24">
      <div className="flex h-full w-full flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold">Settings</h1>

        <Page />
      </div>
    </PageHead>
  );
}
