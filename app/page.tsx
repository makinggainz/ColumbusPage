import { type ReactNode } from "react";
import { MistxNav } from "@/components/layout/MistxNav";
import { HeroNew } from "@/components/home/HeroNew";
import { BentoProducts } from "@/components/home/BentoProducts";
import {
  TextScrollIntro,
  BlogSection,
  MissionScrollIntro,
} from "@/components/home/lightspark";
import { Careers } from "@/components/home/Careers";

// Footer is now rendered in `app/layout.tsx` with `reveal` mode — it sits
// fixed at the viewport bottom (z-index 0) behind the PageFrame card so it
// reveals when the user scrolls past the end of the page content.

/* Homepage-only backdrop. The navy void behind the PageFrame card is set
   globally (app/globals.css `html, body` + the <body> inline style in
   app/layout.tsx), so this <style> overrides it to white *only* while the
   homepage is mounted — it's server-rendered into the initial HTML (no
   navy flash) and removed by client-side nav to any other route, which
   reverts to navy. `!important` is required to beat the inline <body>
   background from the root layout. The same scoped block switches on the
   PageFrame drop shadow via --frame-shadow (default `none` elsewhere) so
   the white card reads as a floating panel against the white backdrop. */
const HOME_BACKDROP_CSS = `
html, body { background: #FFFFFF !important; }
:root {
  --frame-shadow: 0 -1px 2px rgba(15, 23, 60, 0.10),
                  0 -6px 14px rgba(15, 23, 60, 0.15);
}
`;

function IslandGap() {
  return (
    <div className="max-w-[1287px] mx-5 md:mx-auto" style={{ height: 120 }} />
  );
}

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <style>{HOME_BACKDROP_CSS}</style>
      <MistxNav />
      <HeroNew />

      {/* "We're all about maps" intro + bento grid (Columbus / Elio /
          Research). The intro lede is the renamed TextScrollIntro
          (scroll-driven word reveal); the bento grid below shows the
          three products as a featured + 2-stacked tile layout. */}
      <div className="mt-16">
        <TextScrollIntro />
        <BentoProducts />

        <BlogSection />
        <MissionScrollIntro />
      </div>

      <IslandGap />

      {/* Hiring Humans */}
      <div>
        <Careers />
      </div>
    </main>
  );
}
