import type { Metadata } from "next";
import { BlogIndexShell } from "@/components/blog/BlogIndexShell";

export const metadata: Metadata = {
  title: "Blog | Columbus",
  description: "Research notes, releases, and papers from the Columbus Earth team.",
};

export default function BlogIndexPage() {
  return <BlogIndexShell activeFilter="ALL" />;
}
