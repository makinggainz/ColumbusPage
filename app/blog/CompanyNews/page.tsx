import type { Metadata } from "next";
import { BlogIndexShell } from "@/components/blog/BlogIndexShell";

export const metadata: Metadata = {
  title: "Company news | Columbus Blog",
  description: "Company news, vision, and roadmap updates from Columbus Earth.",
};

export default function CompanyNewsPage() {
  return <BlogIndexShell activeFilter="COMPANY NEWS" />;
}
