import type { Metadata } from "next";
import "./globals.css";

import { cormorant, cambo, geist, dmSans, inter } from "@/app/fonts";
import { LenisProvider } from "@/components/home/LenisContext";
import { ScrollRestorer } from "@/components/layout/ScrollRestorer";
import { PageFrame } from "@/components/layout/PageFrame";

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
    <html lang="en" className={`${dmSans.variable} ${geist.variable} ${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>

      {/* DM Sans is the project-wide body font; Geist remains registered as a
          variable for the few legacy spots that still reference it directly. */}
      <body
        className={`${dmSans.className} antialiased min-h-screen`}
        style={{ backgroundColor: "#0A2239" }}
      >
        <LenisProvider>
          <ScrollRestorer />
          <PageFrame>{children}</PageFrame>
        </LenisProvider>
      </body>
    </html>
  );
}
