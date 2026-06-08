"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import Link from "next/link";
import dynamic from "next/dynamic";
import { MistxNav } from "@/components/layout/MistxNav";

// Underwater scene — fixed full-screen canvas behind the content.
// Client-only (ssr:false) because it draws to a <canvas> on mount.
const UnderwaterScene = dynamic(
  () => import("@/components/home/UnderwaterScene"),
  { ssr: false },
);

/**
 * Dot-arrow glyph — the 5-circle SVG used by every CTA across the site
 * (navbar, hero pills, BlogSection cards, the company contact CTA).
 * Reused here so the "Back to shore" button carries the same CTA
 * iconography as the rest of the site.
 */
function ArrowDots({ className = "" }: { className?: string }) {
  return (
    <svg
      className={"size-3 shrink-0 " + className}
      width="24"
      viewBox="0 0 9 13"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7.22" cy="6.589" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="4.018" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="1.46" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="9.151" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="11.718" r="1.28" fill="currentColor" />
    </svg>
  );
}

export default function NotFound() {
  // Lock page scroll for the 404 route only. The global PageFrame card
  // carries a `margin-bottom: 100vh` footer-reveal gutter, which would
  // otherwise make this single-screen page scrollable. Pinning scroll at
  // 0 also keeps MistxNav transparent (its backdrop is driven by
  // `scrollY > 0`), so the navbar has no background here. Restored on
  // unmount so other routes scroll normally.
  useEffect(() => {
    track.pageNotFound(window.location.pathname);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  return (
    // data-hero-section lets MistxNav float transparently over the scene,
    // matching the hero treatment on the home / company / blog pages.
    <main className="relative min-h-screen" data-hero-section>
      {/* Underwater scene — fixed fullscreen background */}
      <UnderwaterScene />

      <MistxNav />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-8 text-center">
        {/* Decorative oversized numeral — Funnel Display, faint ink so it
            reads as a watermark behind the message. */}
        <p
          className="font-display font-light leading-none text-ink/15 text-[120px] md:text-[180px]"
          style={{ letterSpacing: "-0.04em" }}
        >
          404
        </p>
        <h1 className="h2 tracking-tight text-ink mt-4">Lost at sea.</h1>
        <p className="p-l text-muted mt-6 max-w-md">
          This page doesn&apos;t exist — but there&apos;s plenty more to
          explore.
        </p>
        {/* CTA — canonical content pill (rounded-full, bg-cta surface,
            dot-arrow glyph). Uses the design-system `text-accent` token
            (--color-accent #6094C1) so the glyph matches the navbar arrows
            exactly and tracks the single source of truth. */}
        <Link
          href="/"
          className="group mt-10 inline-flex items-center gap-2.5 rounded-full bg-cta px-7 py-3.5 text-sm leading-none text-white transition-colors hover:text-accent"
        >
          Back to shore
          <span className="inline-block transition-transform group-hover:translate-x-0.5">
            <ArrowDots className="text-accent" />
          </span>
        </Link>
      </div>
    </main>
  );
}
