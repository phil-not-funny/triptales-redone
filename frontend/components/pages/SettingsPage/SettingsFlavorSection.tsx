"use client";

import { UserFlavorForm } from "../../forms/UserFlavorForm";
import { UserSettingsProps } from "./SettingsPage";
import { useTranslations } from 'next-intl';

export const SettingsFlavorSection: React.FC<UserSettingsProps> = ({ user }) => {
  const t = useTranslations("Settings");
  
  return (
    <div className="w-full max-w-xl px-3 md:px-0">
      <h2 className="text-center text-xl font-semibold text-gray-700">
        {t("customization")}
      </h2>
      <UserFlavorForm user={user} />
    </div>
  );
};
