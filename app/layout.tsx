import type { Metadata } from "next";
import "./globals.css";

import { cormorant, cambo } from "@/app/fonts";
import { spaceGrotesk } from "@/lib/typography";
import { LenisProvider } from "@/components/home/LenisContext";

export { cormorant, cambo };

export const metadata: Metadata = {
  title: "Columbus",
  description: "AI-powered location and market research",
  icons: {
    icon: "/logobueno.png",
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      {/* Keep global styles simple - match GFrontEndWork: no Navbar/Footer here, no font on body */}
      <body className={`${spaceGrotesk.className} antialiased bg-white min-h-screen`}>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
