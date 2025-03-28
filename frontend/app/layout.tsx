import type { Metadata } from "next";
import "./globals.css";

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
      <body
        className={`relative antialiased min-h-screen font-body`}
      >
        {children}
      </body>
    </html>
  );
}
