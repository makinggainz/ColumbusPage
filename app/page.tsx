import { CircleHero } from "@/components/home/CircleHero";
import { CircleProducts } from "@/components/home/CircleProducts";
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
      {/* circleUI concept — every piece of media lives inside a circular
          portal; nav + copy orbit it. CircleHero carries its own curved
          navigation ring, so no sticky <MistxNav> renders on the home
          route. CircleProducts is the three-portal section that follows. */}
      <CircleHero />
      <CircleProducts />

      {/* Existing homepage sections kept below the new circleUI lead. */}
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
