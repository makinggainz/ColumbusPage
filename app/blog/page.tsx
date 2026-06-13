import type { Metadata } from "next";
import { BlogIndexShell } from "@/components/blog/BlogIndexShell";

export const metadata: Metadata = {
  title: { absolute: "Blogs / Columbus Earth" },
  description:
    "Research notes, releases, and papers from the Columbus Earth team on geospatial intelligence and AI for maps.",
  openGraph: {
    title: "News, Travel Guides, Tech Blogs / Columbus Earth",
    description:
      "Research notes, releases, and papers from the Columbus Earth team on geospatial intelligence and AI for maps.",
    url: "https://columbus.earth/blog",
  },
};

export default function BlogIndexPage() {
  return <BlogIndexShell activeFilter="ALL" />;
}
