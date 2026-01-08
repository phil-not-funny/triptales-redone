import { LoginForm } from "@/components/forms/LoginForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { getTranslations } from 'next-intl/server';

export default async function Login() {
  const t = await getTranslations("Forms.LoginForm");
  const tCommon = await getTranslations("Common");

  return (
    <div className="z-20 flex h-full w-full items-center justify-center">
      <Card className="flex items-center justify-center bg-neutral-100 p-4 py-8 md:basis-1/2">
        <CardHeader className="w-full">
          <CardTitle className="font-title !text-primary-saturated border-primary-light border-b text-center text-3xl uppercase">
            {t("title")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex w-full max-w-md flex-col items-center justify-center gap-4">
          <LoginForm />
          <Link href={"/landing"}>
            <Button variant={"outline"}>
              <ArrowLeftIcon /> {tCommon("back")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
