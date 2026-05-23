"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { PageFrame } from "./PageFrame";
import { Footer } from "./Footer";

/* Blog category pages that share the standard frame; everything else
   under /blog/<x> is treated as an article (full-bleed, no PageFrame,
   no reveal footer). */
const BLOG_CATEGORY_SEGMENTS = new Set([
  "AllArticles",
  "CompanyNews",
  "Engineering",
  "Product",
]);

function isArticlePath(pathname: string): boolean {
  if (!pathname.startsWith("/blog/")) return false;
  const segment = pathname.slice("/blog/".length).split("/")[0] ?? "";
  if (!segment) return false;
  return !BLOG_CATEGORY_SEGMENTS.has(segment);
}

export function RootShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const article = isArticlePath(pathname);

  // Article pages run full-bleed: the PageFrame card is bypassed, so
  // the frame CSS vars need to be pinned to 0 (MistxNav's `top` and
  // top-corner radii read from them with 30px / 20px fallbacks that
  // would otherwise leave the navbar inset 30px from the top edge).
  useEffect(() => {
    const root = document.documentElement;
    if (article) {
      root.style.setProperty("--frame-margin", "0px");
      root.style.setProperty("--frame-radius", "0px");
      root.style.setProperty("--frame-border-width", "0px");
      root.style.setProperty("--footer-reveal-height", "0px");
    } else {
      root.style.removeProperty("--frame-margin");
      root.style.removeProperty("--frame-radius");
      root.style.removeProperty("--frame-border-width");
      root.style.removeProperty("--footer-reveal-height");
    }
  }, [article]);

  if (article) {
    return <>{children}</>;
  }
  return (
    <>
      <Footer
        reveal
        theme="light"
        bg="#FFFFFF"
        bgImage="/footerbackgroundimg2.png"
      />
      <PageFrame>{children}</PageFrame>
    </>
  );
}
