import { cn } from "@/lib/utils";
import { Avatar as RAvatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PropsWithClassName } from "@/types/ComponentTypes";

type AvatarProps = PropsWithClassName & {
  user: { username: string; profilePicture?: string };
  textClassName?: string;
};

const avatarUrl = "https://localhost:5001";

const Avatar: React.FC<AvatarProps> = ({ user, className, textClassName }) => {
  return (
    <RAvatar className={cn("h-12 w-12", className)}>
      {user.profilePicture && (
        <AvatarImage
          src={`${avatarUrl}/${user.profilePicture}`}
          alt={user.username}
        />
      )}
      <AvatarFallback className={cn("font-semibold leading-0 text-xl", textClassName)}>
        {user.username.charAt(0).toUpperCase()}
      </AvatarFallback>
    </RAvatar>
  );
};

export default Avatar;
