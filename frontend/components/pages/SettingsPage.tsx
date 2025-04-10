"use client";

import { UserPrivateResponse } from "@/types/RequestTypes";
import { UserFlavorForm } from "../forms/UserFlavorForm";
import Sorry from "../low/Sorry";
import { useUser } from "../providers/UserProvider";
import { Separator } from "../ui/separator";
import { Fragment } from "react";

interface UserSettingsProps {
  user: UserPrivateResponse;
}

const SettingsFlavorSection: React.FC<UserSettingsProps> = ({ user }) => {
  return (
    <div className="w-full max-w-xl">
      <h2 className="text-center text-xl font-semibold text-gray-700">
        Customization
      </h2>
      <UserFlavorForm user={user} />
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Settings</h1>
      {!user ? (
        <Sorry>Please Log In to Continue</Sorry>
      ) : (
        <Fragment>
          <Separator className="my-8" />
          <SettingsFlavorSection user={user} />
        </Fragment>
      )}
    </div>
  );
};

export default SettingsPage;
