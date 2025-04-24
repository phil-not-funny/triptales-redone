import { UserFlavorForm } from "../../forms/UserFlavorForm";
import { UserSettingsProps } from "./SettingsPage";

export const SettingsFlavorSection: React.FC<UserSettingsProps> = ({ user }) => {
  return (
    <div className="w-full max-w-xl px-3 md:px-0">
      <h2 className="text-center text-xl font-semibold text-gray-700">
        Customization
      </h2>
      <UserFlavorForm user={user} />
    </div>
  );
};
