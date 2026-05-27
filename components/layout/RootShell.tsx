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

/* Real routes that exist in app/. Anything outside this list (and not an
   article path) is the 404 page being rendered by app/not-found.tsx,
   which needs to bypass the white PageFrame card so its full-bleed
   UnderwaterScene animation is actually visible. (Redirect sources like
   /enterprise → /products/business resolve before render, so pathname
   at render time is always a destination on this list or genuinely
   unmatched.) */
const KNOWN_ROUTE_PATTERNS: RegExp[] = [
  /^\/$/,
  /^\/blog(\/|$)/,
  /^\/company(\/|$)/,
  /^\/contact(\/|$)/,
  /^\/products\/business(\/|$)/,
  /^\/products\/consumer(\/|$)/,
  /^\/products\/maps-gpt(\/|$)/,
  /^\/research(\/|$)/,
];

function isKnownRoute(pathname: string): boolean {
  return KNOWN_ROUTE_PATTERNS.some((re) => re.test(pathname));
}

export function RootShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const article = isArticlePath(pathname);
  /* not-found.tsx fires for any path Next didn't match — usePathname()
     still returns that original path here, so we treat anything outside
     our route whitelist (and not an article) as the 404 page. */
  const notFound = !article && !isKnownRoute(pathname);
  const fullBleed = article || notFound;

  // Full-bleed pages (articles + 404) bypass the PageFrame card, so the
  // frame CSS vars need to be pinned to 0 (MistxNav's `top` and top-corner
  // radii read from them with 9px / 35px fallbacks that would otherwise
  // leave the navbar inset from the top edge).
  useEffect(() => {
    const root = document.documentElement;
    if (fullBleed) {
      root.style.setProperty("--frame-margin", "0px");
      root.style.setProperty("--frame-radius", "0px");
      root.style.setProperty("--footer-reveal-height", "0px");
    } else {
      root.style.removeProperty("--frame-margin");
      root.style.removeProperty("--frame-radius");
      root.style.removeProperty("--footer-reveal-height");
    }
  }, [fullBleed]);

  if (fullBleed) {
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
