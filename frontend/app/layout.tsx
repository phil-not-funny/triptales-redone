import type { Metadata } from "next";
import {
  IBM_Plex_Serif,
  Inter,
  Libre_Franklin,
  Nunito_Sans,
  Oswald,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});
const oswald = Oswald({
  variable: "--font-oswald",
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});
const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});
const inter = Inter({
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});
const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

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
        className={`${nunitoSans.variable} ${oswald.variable} ${libreFranklin.variable} ${inter.variable} ${ibmPlexSerif.variable} font-body relative min-h-screen text-gray-800! antialiased`}
      >
        <NextIntlClientProvider>
          <div className="h-full w-full">{children}</div>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
