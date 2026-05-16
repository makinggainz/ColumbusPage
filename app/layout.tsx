import type { Metadata } from "next";
import "./globals.css";

import { LenisProvider } from "@/components/home/LenisContext";
import { ScrollRestorer } from "@/components/layout/ScrollRestorer";
import { PageFrame } from "@/components/layout/PageFrame";
import { Footer } from "@/components/layout/Footer";

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
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* Google Fonts — Funnel Display (titles, .h1 … .h7) and
            Opening Hours Sans (body, paragraphs, UI). preconnect speeds
            the second request; display=swap avoids FOIT. The font-family
            names are wired up in globals.css via --font-display /
            --font-sans. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Opening+Hours+Sans:wght@400..700&display=swap"
        />
      </head>

      <body
        className="antialiased min-h-screen"
        style={{ backgroundColor: "#0B1342" }}
      >
        <LenisProvider>
          <ScrollRestorer />
          {/* Footer sits behind the PageFrame card (z-index 0, fixed at
              viewport bottom via Footer's `reveal` prop). PageFrame is
              z-index 1 with a bottom margin equal to the footer height,
              so as the user scrolls past the page content the white card
              slides up over the fixed footer — revealing it from below. */}
          <Footer
            reveal
            theme="dark"
            bg="#000000"
            bgImage="/footerbackground.jpeg"
          />
          <PageFrame>{children}</PageFrame>
        </LenisProvider>
      </body>
    </html>
  );
}
