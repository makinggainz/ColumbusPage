import type { Metadata } from "next";
import { BlogIndexShell } from "@/components/blog/BlogIndexShell";

export const metadata: Metadata = {
  title: "Engineering | Columbus Blog",
  description: "Engineering and research notes from the Columbus Earth team.",
};

export default function EngineeringPage() {
  return <BlogIndexShell activeFilter="ENGINEERING" />;
}
