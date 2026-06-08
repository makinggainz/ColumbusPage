import type { Metadata } from "next";
import { TechnologyPage } from "@/components/technology/TechnologyPage";
import { MediaPrefetcher } from "@/components/ui/MediaPrefetcher";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Research — Large Geospatial Model",
  description:
    "Columbus Earth is building a brain for the earth — the Large Geospatial Model. An interactive thesis on frontier geospatial intelligence.",
  openGraph: {
    title: "Research — Large Geospatial Model | Columbus Earth",
    description:
      "Columbus Earth is building a brain for the earth — the Large Geospatial Model. An interactive thesis on frontier geospatial intelligence.",
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
    </>
  );
}
