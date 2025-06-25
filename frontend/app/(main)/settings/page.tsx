import Authenticated from "@/components/auth/Authenticated";
import Page from "@/components/pages/SettingsPage/SettingsPage";
import  PageHead  from "@/components/top/PageHead";

export default function SettingsPage() {
  return (
    <Authenticated>
      <PageHead className="pt-24">
        <Page />
      </PageHead>
    </Authenticated>
  );
}
