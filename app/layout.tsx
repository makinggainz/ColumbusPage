import type { Metadata } from "next";
import "./globals.css";

import { cormorant, cambo, geist, dmSans } from "@/app/fonts";
import { LenisProvider } from "@/components/home/LenisContext";
import { PageTransitionProvider } from "@/components/layout/PageTransition";

export { cormorant, cambo };

export const metadata: Metadata = {
  title: "Columbus",
  description: "AI-powered location and market research",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${geist.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>

      {/* DM Sans is the project-wide body font; Geist remains registered as a
          variable for the few legacy spots that still reference it directly. */}
      <body className={`${dmSans.className} antialiased bg-white min-h-screen`}>
        <LenisProvider>
          <PageTransitionProvider>{children}</PageTransitionProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
