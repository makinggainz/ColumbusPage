"use client";

import { useScrollDepth } from "@/lib/useScrollDepth";

export function ScrollDepthTracker({ page }: { page: string }) {
  useScrollDepth(page);
  return null;
}
