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
  // The loaded profile is stored with the username it belongs to, so a change
  // of the logged-in user shows the loading state again without extra state.
  const [loaded, setLoaded] = useState<{
    username: string;
    user: UserDetailedResponse | null;
  } | null>(null);
  const t = useTranslations("Sorry");

  const username = savedUser?.username;
  const loading = !username || loaded?.username !== username;
  const user = loaded?.user ?? null;

  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    UserService.getByUsername(username).then((response) => {
      if (!cancelled) setLoaded({ username, user: response });
    });
    return () => {
      cancelled = true;
    };
  }, [username]);

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
