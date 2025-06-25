import {
  Home,
  Inbox,
  Search,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { AppSidebarAuthorization, AppSidebarFooter } from "./DynamicAppSidebar";

export type Item = {
  title: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => Promise<void>;
};

export default async function AppSidebar() {
  const navItems: Item[] = [
    { title: "Home", url: "/", icon: Home },
    { title: "Inbox", url: "#", icon: Inbox },
    { title: "Search", url: "#", icon: Search },
  ];

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
        <AppSidebarAuthorization />
      </SidebarContent>
      <AppSidebarFooter />
    </Sidebar>
  );
}
