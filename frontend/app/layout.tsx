import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/components/provider/Providers";
import { AppSidebar } from "@/components/top/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
    <html lang="en">
      <body className={`font-body relative min-h-screen antialiased`}>
        <Providers>
          <AppSidebar />
          <main className="h-full w-full">
            <SidebarTrigger />
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
