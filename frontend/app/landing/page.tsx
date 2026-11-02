import { AnimatedButton, Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Landing() {
  const t = await getTranslations("Landing");

  return (
    <div className="relative z-20 flex h-full w-full items-center justify-center">
      <div className="absolute top-5 left-5">
        <Link href={"/"}>
          <Button variant={"outline"}>
            <ArrowLeft /> {t("backHome")}
          </Button>
        </Link>
      </div>

      <Card className="flex items-center justify-center bg-neutral-100 p-4 py-8 md:basis-1/2">
        <CardHeader className="w-full">
          <CardTitle className="font-title !text-primary-saturated border-primary-light border-b text-center text-3xl uppercase">
            {t("welcomeBack")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("chooseOption")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-3">
          <Link href={"/landing/login"}>
            <Button variant={"default"}>{t("logIn")}</Button>
          </Link>
          <Link href={"/landing/signup"}>
            <Button variant={"outline"}>{t("signUp")}</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
