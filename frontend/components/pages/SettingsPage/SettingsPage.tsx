"use client";

import { UserDetailedResponse } from "@/types/RequestTypes";
import Sorry from "../../low/Sorry";
import { useUser } from "../../providers/UserProvider";
import { Separator } from "../../ui/separator";
import { Fragment, useEffect, useState } from "react";
import UserService from "@/lib/services/userService";
import SettingsPictureSection from "./SettingsPictureSection";
import { SettingsFlavorSection } from "./SettingsFlavorSection";

export interface UserSettingsProps {
  user: UserDetailedResponse;
}

const SettingsPage: React.FC = () => {
  const { user: savedUser } = useUser();
  const [user, setUser] = useState<UserDetailedResponse | null>(null);

  const init = async () => {
    const response = await UserService.getByUsername(savedUser?.username || "");
    if (response) {
      setUser(response);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Settings</h1>
      {!user ? (
        <Sorry>Please Log In to Continue</Sorry>
      ) : (
        <Fragment>
          <Separator />
          <SettingsFlavorSection user={user} />
          <SettingsPictureSection user={user} />
        </Fragment>
      )}
    </div>
  );
};

export default SettingsPage;
