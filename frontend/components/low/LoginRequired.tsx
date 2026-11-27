import Sorry from "@/components/low/Sorry";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function LoginRequired() {
  const t = await getTranslations("Sorry");
  const tSidebar = await getTranslations("Sidebar");

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <Sorry includeTryAgain={false}>{t("pleaseLogin")}</Sorry>
      <Link href={"/landing/login"}>
        <Button>
          <LogIn />
          {tSidebar("login")}
        </Button>
      </Link>
    </div>
  );
}
