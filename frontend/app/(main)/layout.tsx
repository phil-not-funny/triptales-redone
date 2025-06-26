import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "sonner";
import AppSidebar from "@/components/top/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Footer from "@/components/top/Footer";

export const metadata: Metadata = {
  title: "Triptales",
  description:
    "Triptales is a platform for creating and sharing travel stories.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="min-h-screen w-full">
        <SidebarTrigger className="absolute top-2 left-2 z-20" />
        <div className="min-h-screen w-full text-gray-800">{children}</div>
        <Footer />
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
