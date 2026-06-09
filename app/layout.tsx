import type { Metadata } from "next";
import "./globals.css";

import { LenisProvider } from "@/components/home/LenisContext";
import { ScrollRestorer } from "@/components/layout/ScrollRestorer";
import { RootShell } from "@/components/layout/RootShell";
import { HeroPrefetcher } from "@/components/ui/HeroPrefetcher";
import { JsonLd } from "@/components/JsonLd";
import { ConsentBanner } from "@/components/ui/ConsentBanner";

export const metadata: Metadata = {
  metadataBase: new URL("https://columbus.earth"),
  title: {
    template: "%s | Columbus Earth",
    default: "Columbus Earth — AI-Powered Geospatial Intelligence",
  },
  description:
    "Columbus Earth builds frontier geospatial AI — the Large Geospatial Model, Columbus Pro for enterprise site selection, and Elio for travel exploration.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Columbus Earth",
    images: [
      {
        url: "/HomeHeroBg.png",
        width: 1400,
        height: 900,
        alt: "Columbus Earth — AI-Powered Geospatial Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
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
        {/* iOS Safari tints the address-bar / status-bar region with this
            colour (the Liquid Glass chrome reads it as the page accent).
            White matches the uniformly white page backdrop, so the chrome
            reads as a seamless continuation of the page on every route. */}
        <meta name="theme-color" content="#FFFFFF" />
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
          {/* Warms sibling routes' hero images into cache while idle, so
              cross-page navigation lands on an already-loaded hero. */}
          <HeroPrefetcher />
        </LenisProvider>
        <ConsentBanner />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://columbus.earth/#organization",
                name: "Columbus Earth",
                url: "https://columbus.earth",
                logo: "https://columbus.earth/logobueno.png",
                description:
                  "Columbus Earth Inc. is a spatial frontier AI company building the first production Large Geospatial Model.",
                founders: [
                  {
                    "@type": "Person",
                    name: "David Ramirez Blonski",
                    jobTitle: "Co-Founder, CEO",
                  },
                  {
                    "@type": "Person",
                    name: "Alexander Ramirez Blonski",
                    jobTitle: "Co-Founder, CPO",
                  },
                  {
                    "@type": "Person",
                    name: "Erick Lara",
                    jobTitle: "Co-Founder, CTO",
                  },
                ],
              },
              {
                "@type": "WebSite",
                "@id": "https://columbus.earth/#website",
                url: "https://columbus.earth",
                name: "Columbus Earth",
                publisher: { "@id": "https://columbus.earth/#organization" },
              },
            ],
          }}
        />
      </body>
    </html>
  );
}
