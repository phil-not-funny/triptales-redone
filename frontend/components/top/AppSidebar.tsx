"use client";

import {
  Home,
  Inbox,
  Search,
  Settings,
  LogIn,
  LogOut,
  UserPlus,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "../providers/UserProvider";
import { useEffect } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";

type Item = {
  title: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => Promise<void>;
};

export const AppSidebar: React.FC = () => {
  const navItems: Item[] = [
    { title: "Home", url: "/", icon: Home },
    { title: "Inbox", url: "#", icon: Inbox },
    { title: "Search", url: "#", icon: Search },
    { title: "Settings", url: "#", icon: Settings },
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
        await logout();
      },
    },
  ];

  const { loggedIn, refreshUser, logout, user } = useUser();

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <Sidebar className="border-r border-gray-100 bg-gray-50 text-gray-700">
      <SidebarHeader className="flex items-center justify-between border-b border-gray-100 px-4 py-6">
        <div className="flex items-center gap-3">
          <Image
            src={"/images/triptales_logo.png"}
            width={200}
            height={200}
            alt="TripTales Logo"
            className="h-[40px] w-[40px] transition-transform duration-300 hover:scale-105"
          />
          <h1 className="text-xl font-semibold tracking-wide text-gray-800 md:text-2xl">
            TripTales
          </h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-sm font-medium text-gray-500">
            Navigation
          </SidebarGroupLabel>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
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

        <SidebarGroup className="mt-6">
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
      </SidebarContent>

      {loggedIn && user && (
        <SidebarFooter className="border-t border-gray-100 bg-gray-50 px-4 py-6">
          <Link
            href={`/user/${user.username}`}
            className="flex items-center justify-between rounded-lg p-2 transition-colors duration-150 hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {user.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {user.displayName}
                </p>
                <p className="text-xs text-gray-500">@{user.username}</p>
              </div>
            </div>
          </Link>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};
