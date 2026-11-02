"use client";

import { Globe, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn, setLocaleCookie } from "@/lib/utils";
import { SidebarMenuButton } from "../ui/sidebar";
import { LANGUAGES } from "@/i18n/utils";

export default function LanguageSwitcher({
  asSideBarItem = false,
}: {
  asSideBarItem?: boolean;
}) {
  const router = useRouter();
  const currentLocale = useLocale();
  const t = useTranslations("Sidebar");
  const [isChanging, setIsChanging] = useState(false);
  const [open, setOpen] = useState(false);

  const changeLanguage = async (locale: string) => {
    if (locale === currentLocale || isChanging) {
      setOpen(false);
      return;
    }
    setIsChanging(true);
    setLocaleCookie(locale);
    setOpen(false);
    router.refresh();

    setTimeout(() => {
      setIsChanging(false);
    }, 100);
  };

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === currentLocale) || LANGUAGES[0];

  const components = {
    btn: Button,
    sBtn: SidebarMenuButton,
  };

  const DynamicButton = asSideBarItem ? components.sBtn : components.btn;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <DynamicButton
          variant="outline"
          className="w-full justify-start text-gray-600 transition-colors duration-200 hover:bg-gray-100"
          disabled={isChanging}
        >
          <Globe className="mr-3 h-5 w-5" />
          <span>
            {t("language")}: {currentLanguage.flag} {currentLanguage.name}
          </span>
        </DynamicButton>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-fit p-2">
        <div className="flex flex-col gap-1">
          {LANGUAGES.map((language) => (
            <Button
              variant="ghost"
              size="sm"
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={cn(
                "justify-start",
                currentLocale === language.code
                  ? "bg-gray-100 font-medium"
                  : "",
              )}
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
              {currentLocale === language.code ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="w-4" />
              )}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
