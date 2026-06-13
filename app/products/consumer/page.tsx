import type { Metadata } from "next";
import { MistxNav } from "@/components/layout/MistxNav";
import Hero from "@/components/products/Hero";
import DestinationsSection from "@/components/products/DestinationsSection";
import FinalCTASection from "@/components/products/FinalCTASection";
import { MediaPrefetcher } from "@/components/ui/MediaPrefetcher";
import { JsonLd } from "@/components/JsonLd";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";

export const metadata: Metadata = {
  title: { absolute: "Elio / Social Super Map / Personal AI Map Assistant" },
  description:
    "Elio is a social map app — your personal AI assistant for your city, your travels, and everything in between, including itinerary planning.",
  openGraph: {
    title:
      "Elio, is a Social Super Map / A personal assistant for maps / City and travel exploration app",
    description:
      "Elio is a social map app — your personal AI assistant for your city, your travels, and everything in between, including itinerary planning.",
    url: "https://columbus.earth/products/consumer",
  },
};

export default function ProductsPage() {
  return (
    <main style={{ overflowX: "clip" }}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Elio",
          applicationCategory: "TravelApplication",
          operatingSystem: "Web, iOS, Android",
          description:
            "Elio is the social super map — making maps feel alive for your city, your travels, and everything in between.",
          url: "https://columbus.earth/products/consumer",
          publisher: { "@id": "https://columbus.earth/#organization" },
        }}
      />
      <MistxNav lightCta darkBackdrop />

      {/* Hero owns the entire pinned-phone sticky-scroll: TwerkPage's
          "social super map" header + two scenes (For your city / For
          your travels), with one phone pinned and its screenshot +
          backdrop cross-fading per phase. */}
      <Hero />

      {/* Bento grid + cycling-title marquees + "Elio is on desktop and
          mobile" desktop mockup, lifted from TwerkPage. */}
      <DestinationsSection />

      <FinalCTASection />

      {/* Eager prefetch-all: after load + idle, warms every below-fold
          image (phone mockups, scene backdrops, avatars, globe) so the
          sticky-scroll never reveals a half-loaded scene. Skips on
          data-saver. Renders nothing. */}
      <MediaPrefetcher />
      <ScrollDepthTracker page="consumer" />
    </main>
  );
}
