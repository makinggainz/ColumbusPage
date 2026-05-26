import type { Metadata } from "next";
import "./globals.css";

import { LenisProvider } from "@/components/home/LenisContext";
import { ScrollRestorer } from "@/components/layout/ScrollRestorer";
import { RootShell } from "@/components/layout/RootShell";

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
        {/* Warm the connections for the remote image domains we render
            (next/image proxies them through the optimizer, but the
            optimizer still talks to the origin once). */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://i.pravatar.cc" />
        {/* Preload the two most-used self-hosted Axiforma weights — they
            sit behind every hero <h1>, so swapping in the real face
            before first paint avoids a visible FOUT on the LCP text. */}
        <link
          rel="preload"
          href="/fonts/Axiforma-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Axiforma-SemiBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Opening+Hours+Sans:wght@400..700&display=swap"
        />
      </head>

      {/* Body background (white) is driven by globals.css (`html, body`);
          no inline style here so the stylesheet rule stays in control. */}
      <body className="antialiased min-h-screen">
        <LenisProvider>
          <ScrollRestorer />
          {/* RootShell renders the standard PageFrame + reveal footer on
              every route, but article pages (/blog/<slug>) opt out and
              render full-bleed with no reveal footer. */}
          <RootShell>{children}</RootShell>
        </LenisProvider>
      </body>
    </html>
  );
}
