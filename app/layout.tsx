import type { Metadata } from "next";
import "./globals.css";

import { cormorant, cambo, geist, dmSans, inter } from "@/app/fonts";
import { LenisProvider } from "@/components/home/LenisContext";
import { ScrollRestorer } from "@/components/layout/ScrollRestorer";
import { PageFrame } from "@/components/layout/PageFrame";
import { Footer } from "@/components/layout/Footer";

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
          {/* Footer sits behind the PageFrame card (z-index 0, fixed at
              viewport bottom via Footer's `reveal` prop). PageFrame is
              z-index 1 with a bottom margin equal to the footer height,
              so as the user scrolls past the page content the white card
              slides up over the fixed footer — revealing it from below. */}
          <Footer reveal theme="dark" bg="#0A2239" />
          <PageFrame>{children}</PageFrame>
        </LenisProvider>
      </body>
    </html>
  );
}
