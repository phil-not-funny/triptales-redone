"use client";

import { UserDetailedResponse } from "@/types/RequestTypes";
import Sorry from "../../low/Sorry";
import { Separator } from "../../ui/separator";
import { Fragment, useEffect, useState } from "react";
import UserService from "@/lib/services/userService";
import SettingsPictureSection from "./SettingsPictureSection";
import { SettingsFlavorSection } from "./SettingsFlavorSection";
import useUser from "@/hooks/useUser";
import Loading from "@/components/top/Loading";
import { useTranslations } from 'next-intl';

export interface UserSettingsProps {
  user: UserDetailedResponse;
}

const SettingsPage: React.FC = () => {
  const { user: savedUser } = useUser();
  const [user, setUser] = useState<UserDetailedResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const t = useTranslations("Sorry");

  const init = async () => {
    if (!savedUser || !savedUser?.username) return;
    setLoading(true);
    const response = await UserService.getByUsername(savedUser?.username);
    if (response) {
      setUser(response);
    }
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, [savedUser]);

  return loading ? (
    <Loading />
  ) : !user ? (
    <Sorry>{t("pleaseLogin")}</Sorry>
  ) : (
    <Fragment>
      <Separator />
      <SettingsFlavorSection user={user} />
      <SettingsPictureSection user={user} />
    </Fragment>
  );
};

export default SettingsPage;
