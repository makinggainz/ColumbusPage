import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: { absolute: "Columbus Pro / All-in-one GIS, Exploration, Discovery with AI" },
  description:
    "Columbus Pro is an AI location-intelligence platform built for site selection, due diligence, and location research. Ask the map, generate research reports, and access a live data catalogue.",
  openGraph: {
    title:
      "Columbus Pro is a new Agentic GIS for Business / Built with frontier Geospatial Intelligence to make exploration and discovery easier / Location and geographic intelligence AI",
    description:
      "Columbus Pro is an AI location-intelligence platform built for site selection, due diligence, and location research. Ask the map, generate research reports, and access a live data catalogue.",
    url: "https://columbus.earth/products/business",
  },
};

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Columbus Pro",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description:
            "Columbus Pro is an agentic GIS platform built for site selection, due diligence, and location research. Ask the map, generate research reports, and access a live data catalogue — for real estate, urban infrastructure, geomarketing, and more.",
          url: "https://columbus.earth/products/business",
          offers: {
            "@type": "Offer",
            availability: "https://schema.org/PreOrder",
            url: "https://columbus.earth/products/business",
          },
          publisher: { "@id": "https://columbus.earth/#organization" },
        }}
      />
      {children}
    </>
  );
}
