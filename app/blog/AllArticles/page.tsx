import type { Metadata } from "next";
import { BlogIndexShell } from "@/components/blog/BlogIndexShell";

export const metadata: Metadata = {
  title: "All articles | Columbus Blog",
  description: "All research notes, product releases, and company updates from Columbus Earth.",
};

export default function AllArticlesPage() {
  return <BlogIndexShell activeFilter="ALL" />;
}
