import type { Metadata } from "next";
import { BlogIndexShell } from "@/components/blog/BlogIndexShell";

export const metadata: Metadata = {
  title: "Product | Columbus Blog",
  description: "Product updates and release notes from the Columbus Earth team.",
};

export default function ProductPage() {
  return <BlogIndexShell activeFilter="PRODUCT" />;
}
