"use client";

import {
  Link,
  ListPlusIcon,
  LogIn,
  LogOut,
  Settings,
  UserPlus,
} from "lucide-react";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import UserService from "@/lib/services/userService";
import { Item } from "./AppSidebar";
import Avatar from "../low/Avatar";
import useUser from "@/hooks/useUser";

export const AppSidebarAuthorization: React.FC = () => {
  const { loggedIn } = useUser();

  const onlyLoggedIn: Item[] = [
    { title: "Settings", url: "/settings", icon: Settings },
    { title: "New Post", url: "/post/new", icon: ListPlusIcon },
  ];

  const authItems: Item[] = [
    { title: "Login", url: "/landing/login", icon: LogIn },
    { title: "Sign Up", url: "/landing/signup", icon: UserPlus },
  ];

  const unAuthItems: Item[] = [
    {
      title: "Logout",
      url: "/landing",
      icon: LogOut,
      onClick: async () => {
        await UserService.logout();
      },
    },
  ];

  return (
    <>
      {loggedIn && (
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-sm font-medium text-gray-500">
            User Options
          </SidebarGroupLabel>
          <SidebarContent>
            <SidebarMenu>
              {onlyLoggedIn.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    variant={"outline"}
                    className="w-full justify-start text-gray-600 transition-colors duration-200 hover:bg-gray-100"
                    asChild
                  >
                    <Link href={item.url}>
                      <item.icon className="mr-3 h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      )}

      <SidebarGroup>
        <SidebarGroupLabel className="px-4 text-sm font-medium text-gray-500">
          Authentication
        </SidebarGroupLabel>
        <SidebarContent>
          <SidebarMenu>
            {(loggedIn ? unAuthItems : authItems).map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  variant={"outline"}
                  className="w-full justify-start text-gray-600 transition-colors duration-200 hover:bg-gray-100"
                  asChild
                  onClick={item.onClick}
                >
                  <Link href={item.url}>
                    <item.icon className="mr-3 h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </SidebarGroup>
    </>
  );
};

export const AppSidebarFooter: React.FC = () => {
  const { user, loggedIn } = useUser();

  return (
    loggedIn &&
    user && (
      <SidebarFooter className="border-t border-gray-100 bg-gray-50 px-4 py-6">
        <Link
          href={`/user/${user.username}`}
          className="flex items-center justify-between rounded-lg p-2 transition-colors duration-150 hover:bg-gray-100"
        >
          <div className="flex items-center gap-3">
            <Avatar user={user} />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {user.displayName}
              </p>
              <p className="text-xs text-gray-500">@{user.username}</p>
            </div>
          </div>
        </Link>
      </SidebarFooter>
    )
  );
};
