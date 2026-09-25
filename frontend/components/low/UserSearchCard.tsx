import { UserPublicResponseSmall } from "@/types/RequestTypes";
import { Verified } from "lucide-react";
import Link from "next/link";
import Avatar from "./Avatar";

/**
 * Compact profile link used in search results.
 */
const UserSearchCard: React.FC<{ user: UserPublicResponseSmall }> = ({
  user,
}) => (
  <Link
    href={`/user/${user.username}`}
    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
  >
    <Avatar user={user} />
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <p className="truncate font-semibold text-gray-800">
          {user.displayName}
        </p>
        {user.verified && (
          <Verified className="text-primary-saturated h-4 w-4 shrink-0" />
        )}
      </div>
      <p className="truncate text-sm text-gray-500">@{user.username}</p>
    </div>
  </Link>
);

export default UserSearchCard;
