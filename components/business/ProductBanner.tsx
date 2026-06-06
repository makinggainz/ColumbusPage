"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useMediaWarm } from "@/components/ui/MediaPrefetcher";
import businessArtBG from "@/public/BusinessPgMedia/businessArtBGEnhance.png";

export default function ProductBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const warm = useMediaWarm();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ marginTop: 100 }}
    >
      {/* Art backdrop, anchored to the section's bottom edge. Its height is
          derived from the image's native 1881×836 ratio against the full
          section width, so when the rendered image is taller than the
          section the top spills *up* past the section edge instead of being
          clipped — it bleeds into the white ComparisonSection above. No
          overflow-hidden on the section so the spill stays visible. */}
      {/* Art backdrop — migrated from CSS background-image (1.1 MB PNG)
          to next/image so the optimizer can ship an AVIF/WebP variant.
          objectFit:fill mirrors the original `background-size: 100% 100%`
          stretch so the natural 1881×836 ratio + bottom-anchored bleed
          stay identical. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 overflow-hidden"
        style={{ aspectRatio: "1881 / 836" }}
      >
        <ImageWithFallback
          src={businessArtBG}
          alt=""
          fill
          sizes="100vw"
          quality={80}
          placeholder="blur"
          loading={warm ? "eager" : "lazy"}
          fetchPriority={warm ? "low" : undefined}
          style={{ objectFit: "fill" }}
        />
      </div>
      <div
        className="relative z-10 flex flex-col items-center justify-center px-5 md:px-10"
        style={{
          paddingTop: "clamp(120px, 15vw, 192px)",
          paddingBottom: "clamp(120px, 15vw, 192px)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <h2
          className="text-center leading-[1.1] text-[28px] md:text-[36px] lg:text-[44px]"
          style={{
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "var(--ent-text-primary)",
          }}
        >
          <strong style={{ color: "#0A1342" }}>Columbus Pro</strong>
          {" — "}
          GIS made effortless
        </h2>

        <Link
          href="/contact?tab=columbus-pro"
          className="group mt-10 flex items-center gap-3 leading-none whitespace-nowrap rounded-button-md hover:opacity-90 transition-all duration-300"
          style={{ fontSize: 15, fontWeight: 500, height: 36, paddingLeft: 20, paddingRight: 16, backgroundColor: "var(--ent-btn-dark)", color: "white" }}
        >
          <span className="transition-colors duration-300 group-hover:text-(--ent-accent)">Try Demo</span>
          <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="14" viewBox="0 0 9 13" fill="none" aria-hidden>
            <circle cx="7.22" cy="6.589" r="1.28" fill="var(--ent-accent)" />
            <circle cx="4.658" cy="4.018" r="1.28" fill="var(--ent-accent)" />
            <circle cx="2.099" cy="1.46" r="1.28" fill="var(--ent-accent)" />
            <circle cx="4.658" cy="9.151" r="1.28" fill="var(--ent-accent)" />
            <circle cx="2.099" cy="11.718" r="1.28" fill="var(--ent-accent)" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
