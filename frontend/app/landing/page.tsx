import { AnimatedButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { getTranslations } from 'next-intl/server';

export default async function Landing() {
  const t = await getTranslations("Landing");

  return (
    <div className="z-20 flex h-full w-full items-center justify-center">
      <Card className="flex items-center justify-center bg-neutral-100 p-4 py-8 md:basis-1/2">
        <CardHeader className="w-full">
          <CardTitle className="font-title !text-primary-saturated border-primary-light border-b text-center text-3xl uppercase">
            {t("welcomeBack")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("chooseOption")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center flex-col justify-center gap-3">
          <Link href={"/landing/login"}>
            <AnimatedButton variant={"default"}>{t("logIn")}</AnimatedButton>
          </Link>
          <Link href={"/landing/signup"}>
            <AnimatedButton variant={"outline"}>{t("signUp")}</AnimatedButton>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
