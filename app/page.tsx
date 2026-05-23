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
function IslandGap() {
  return (
    <div className="max-w-[1287px] mx-5 md:mx-auto" style={{ height: 120 }} />
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
