import type { Metadata } from "next";
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
import { MediaPrefetcher } from "@/components/ui/MediaPrefetcher";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";

export const metadata: Metadata = {
  // `absolute` bypasses the root layout's "%s | Columbus Earth" template.
  title: { absolute: "Columbus / AI Geospatial Intelligence / Elio Social Maps / Agentic GIS / Research" },
  description:
    "The Applied AI lab building street smart AI. Columbus Pro for enterprise-grade location intelligence. Elio is a social map for city and travel exploration.",
  openGraph: {
    title: "Columbus Earth / Building a thinking earth / AI Maps Company",
    description:
      "The Applied AI lab building street smart AI. Columbus Pro for enterprise-grade location intelligence. Elio is a social map for city and travel exploration.",
    url: "https://columbus.earth",
  },
};

// Footer is now rendered in `app/layout.tsx` with `reveal` mode — it sits
// fixed at the viewport bottom (z-index 0) behind the PageFrame card so it
// reveals when the user scrolls past the end of the page content.
function IslandGap() {
  return (
    <div className="max-w-[1287px] w-[calc(100%-2.5rem)] mx-auto" style={{ height: 120 }} />
  );
}

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <MistxNav />
      <HeroNew />

      {/* "We're all about maps" intro + bento grid (Columbus / Elio /
          Research). The intro lede is the renamed TextScrollIntro
          (scroll-driven word reveal); the bento grid below shows the
          three products as a featured + 2-stacked tile layout. */}
      {/* pt-16 (not mt-16): padding, not margin, so the hero's 30px
          floating-div bottom gutter (margin-bottom on .hn-section) isn't
          swallowed by sibling margin-collapse and stays a true 30px. */}
      <div className="pt-16">
        <TextScrollIntro />
        <BentoProducts />

        <MissionScrollIntro />
        <BlogSection />
      </div>

      <IslandGap />

      {/* Hiring Humans */}
      <div>
        <Careers />
      </div>

      {/* Eager prefetch-all: after the page loads + the main thread goes
          idle, warms every below-fold image (promotes them to eager) and
          pre-buffers the footer video, so first-run users never scroll into
          a half-loaded section. Renders nothing; skips on data-saver. */}
      <MediaPrefetcher />
      <ScrollDepthTracker page="homepage" />
    </main>
  );
}
