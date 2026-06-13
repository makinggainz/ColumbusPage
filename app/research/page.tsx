import type { Metadata } from "next";
import { TechnologyPage } from "@/components/technology/TechnologyPage";
import { MediaPrefetcher } from "@/components/ui/MediaPrefetcher";
import { JsonLd } from "@/components/JsonLd";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";

export const metadata: Metadata = {
  title: { absolute: "Research / LGM at Columbus Earth" },
  description:
    "Columbus Earth is building the Large Geospatial Model — geospatial foundation models that bring street-smart, physical-world AI to maps.",
  openGraph: {
    title:
      "Research at Columbus Earth / Building Geospatial Foundation Models / Applying AI to maps / Building street smart AI",
    description:
      "Columbus Earth is building the Large Geospatial Model — geospatial foundation models that bring street-smart, physical-world AI to maps.",
    url: "https://columbus.earth/research",
  },
};

export default function ResearchRoutePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "Building a Brain for Earth",
          description:
            "At Columbus, we collect the world's data, and build a brain that comprehends it all. We're building frontier geospatial intelligence.",
          url: "https://columbus.earth/research",
          publisher: { "@id": "https://columbus.earth/#organization" },
          isPartOf: { "@id": "https://columbus.earth/#website" },
        }}
      />
      <TechnologyPage />
      {/* Eager prefetch-all: after load + idle, warms every below-fold image
          (tech diagram, model logos, Voyager graphic, blog cards) so the long
          scroll never reveals a half-loaded section. Scoped to /research;
          /technology renders the same TechnologyPage without it. */}
      <MediaPrefetcher />
      <ScrollDepthTracker page="research" />
    </>
  );
}
