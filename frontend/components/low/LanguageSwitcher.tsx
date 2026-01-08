"use client";

import { Globe, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from 'next-intl';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import { useState } from "react";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
];

export default function LanguageSwitcher() {
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
    
    // Set cookie
    document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Close popover
    setOpen(false);
    
    // Refresh the page to apply the new locale
    router.refresh();
    
    // Wait a bit for the refresh
    setTimeout(() => {
      setIsChanging(false);
    }, 100);
  };

  const currentLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-gray-600 transition-colors duration-200 hover:bg-gray-100"
          disabled={isChanging}
        >
          <Globe className="mr-3 h-5 w-5" />
          <span>{t("language")}: {currentLanguage.flag} {currentLanguage.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-2">
        <div className="flex flex-col gap-1">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100 text-left w-full",
                currentLocale === language.code && "bg-gray-100 font-medium"
              )}
            >
              {currentLocale === language.code ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="w-4" />
              )}
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
