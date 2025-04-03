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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "../provider/UserProvider";
import { useEffect } from "react";

type Item = {
  title: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => Promise<void>;
};

export const AppSidebar: React.FC = () => {
  const { loggedIn, refreshUser, logout } = useUser();

  const navItems: Item[] = [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];

  const authItems: Item[] = [
    {
      title: "Login",
      url: "/landing/login",
      icon: LogIn,
    },
    {
      title: "Sign Up",
      url: "/landing/signup",
      icon: UserPlus,
    },
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

  useEffect(() => {
    refreshUser();
  });

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-between">
        <Image
          src={"/images/triptales_logo.png"}
          width={200}
          height={200}
          alt="Logo"
          className="hidden h-[45px] w-[45px] saturate-200 md:block"
        />
        <h1 className="font-title-plax text-primary-dark -mt-1 text-center text-lg font-semibold tracking-wide uppercase md:text-3xl">
          TripTales
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton variant={"outline"} asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Authentication</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {(loggedIn ? unAuthItems : authItems).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    variant={"outline"}
                    asChild
                    onClick={item.onClick}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
