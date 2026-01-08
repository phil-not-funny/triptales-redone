import Sorry from "@/components/low/Sorry";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations("Sorry");
  const tCommon = await getTranslations("Common");

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <Sorry includeTryAgain={false}>
        {t("pageNotFound")}
      </Sorry>
      <Link href={"/"}>
        <Button>
          <ArrowLeft />
          {tCommon("toHomepage")}
        </Button>
      </Link>
    </div>
  );
}
