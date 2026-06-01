import { MistxNav } from "@/components/layout/MistxNav";
import Hero from "@/components/products/Hero";
import DestinationsSection from "@/components/products/DestinationsSection";
import FinalCTASection from "@/components/products/FinalCTASection";
import { MediaPrefetcher } from "@/components/ui/MediaPrefetcher";

export default function ProductsPage() {
  return (
    <main style={{ overflowX: "clip" }}>
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
    </main>
  );
}
