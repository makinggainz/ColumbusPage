"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import MapChatPlatform from "./MapChatPlatform";
import { ScaleToFit } from "../technology/redesign/ScaleToFit";
import { useMediaWarm } from "@/components/ui/MediaPrefetcher";

export default function ChatSection() {
  const warm = useMediaWarm();
  return (
    <section
      className="relative w-full overflow-hidden flex flex-col items-center pt-24 md:pt-40 lg:pt-[280px]"
      style={{ backgroundColor: "var(--ent-bg-dark-alt)" }}
    >
      {/* Background image — reuses the SAME hero photo the business hero loads
          (/ColumbusBackgroundV2Enhanced.png). Matching the hero's src + sizes +
          quality makes this request the identical next/image optimizer URL, so
          it's a cache hit (the hero already fetched it eagerly as the LCP) — no
          extra download. Anchored at "center 30%" so the focal band sits in the
          lower half of the section, behind the monitor mockup. The fallback
          gradient mirrors the hero's loading/error surface. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <ImageWithFallback
          src="/ColumbusBackgroundV2Enhanced.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          quality={80}
          loading={warm ? "eager" : "lazy"}
          fetchPriority={warm ? "low" : undefined}
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
          fallbackStyle={{ background: "linear-gradient(180deg, #1C99E8 0%, #0371CB 100%)" }}
        />
      </div>
      {/* Dark scrim — same gradient as BusinessHero: black at the top for
          text contrast, fading to transparent before the bottom edge so
          the photo meets the monitor band cleanly. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.28) 38%, rgba(0,0,0,0.12) 62%, rgba(0,0,0,0) 86%)",
          zIndex: 0,
        }}
        aria-hidden
      />

      {/* Heading */}
      <h2
        className="relative z-10 font-medium text-center text-[28px] md:text-[36px] lg:text-[44px] leading-[1.1] tracking-[-0.02em] text-white px-6"
      >
        Chat with us now about Columbus Pro
      </h2>

      {/* Button */}
      <Link
        href="/contact?tab=columbus-pro"
        onClick={() => track.demoRequested("business")}
        className="relative z-10 group mt-8 flex items-center gap-3 leading-none whitespace-nowrap rounded-button-md hover:opacity-90 transition-all duration-300 cursor-pointer"
        style={{ fontSize: 15, fontWeight: 500, height: 36, paddingLeft: 20, paddingRight: 16, backgroundColor: "var(--ent-btn-dark)", color: "white" }}
      >
        <span className="transition-colors duration-300 group-hover:text-(--ent-accent)">Talk to Founders</span>
        <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="var(--ent-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 1l5 5-5 5" />
        </svg>
      </Link>

      {/* Chat screen — extends below section, clipped by section overflow:hidden.
          `.ent-content-bounds` (calc(100% - 2.5rem) + mx-auto) drives both the
          gutter and the 1287px cap, and feeds ScaleToFit's width measurement —
          identical to how `.biz-hero-scale` works in the hero. */}
      <div
        className="relative z-10 flex justify-center w-full mt-10 md:mt-16 lg:mt-20"
      >
        <div className="ent-content-bounds" style={{ position: "relative", marginBottom: "-20%" }}>
          {/* Conversational chat screen — the same MapChatPlatform card shown
              at the top of the business hero, given the hero's identical
              responsive treatment: ScaleToFit renders it at a fixed 1287px
              design width and uniformly transform:scale()s it down on narrower
              screens (passthrough at ≥1287). The card miniaturizes as one rigid
              unit, matching the hero (see BusinessHero.tsx + .biz-hero-scale).
              The card's bottom corners overlap the -20% bleed and are clipped by
              the section's overflow:hidden, same as the old monitor mockup. */}
          <ScaleToFit designWidth={1287} className="biz-hero-scale">
            <MapChatPlatform />
          </ScaleToFit>
        </div>
      </div>
    </section>
  );
}
