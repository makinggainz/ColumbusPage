"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GridSection } from "../home/ContentGrid";
import { useMediaWarm } from "@/components/ui/MediaPrefetcher";
// Static imports → AVIF + blur-up for the heavy decorative line-art.
import b3Left from "@/public/businessB3/left.png";
import b3Right from "@/public/businessB3/right.png";

export default function SolutionShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const warm = useMediaWarm();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{
        "--grid-line": "var(--ent-border-dark-grid)",
        backgroundColor: "transparent",
      } as React.CSSProperties}
    >
      {/* B3 line-art — a faint hand-drawn galleon hugs the lower-left of
          the screen and a harbour town the lower-right, both sitting
          behind the heading. Scoped to B3 (B2 above stays plain white).

          Container z-index is -10 so the line-art paints UNDERNEATH the
          in-flow pain-point cards above (which live in the same
          `z-30` page wrapper). The right harbour-town is sized large
          enough (`w-[42%] max-w-160`) that, anchored at the bottom-right
          of B3, it overflows upward into the pain-cards row and reads as
          a backdrop behind those statements rather than a decoration
          floating in front of them. The heading stays on top via
          GridSection's `z-index: 1`. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[22%] max-w-76 aspect-1378/1260">
          <Image
            src={b3Left}
            alt=""
            fill
            sizes="22vw"
            placeholder="blur"
            loading={warm ? "eager" : "lazy"}
            fetchPriority={warm ? "low" : undefined}
            className="object-contain object-top-left"
          />
        </div>
        <div className="absolute -bottom-12.5 right-0 w-[18%] max-w-xs aspect-1604/1296">
          <Image
            src={b3Right}
            alt=""
            fill
            sizes="18vw"
            placeholder="blur"
            loading={warm ? "eager" : "lazy"}
            fetchPriority={warm ? "low" : undefined}
            className="object-contain object-bottom-right"
          />
        </div>
      </div>

      <GridSection
        style={{
          backgroundColor: "transparent",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header row — this block is the title of the merged B3·C section.
            paddingTop is the section's top padding (--ent-section-lg);
            paddingBottom is the heading→content gap to ComparisonSection
            below (--ent-space-16), not a full section gap. */}
        <div
          className="flex flex-col items-center text-center px-6 md:px-10"
          style={{ paddingTop: "var(--ent-section-lg)", paddingBottom: "var(--ent-space-16)" }}
        >
          <h2
            className="text-ink leading-[1.1] text-[28px] md:text-[36px] lg:text-[44px]"
            style={{ fontWeight: 500, letterSpacing: "-0.02em", maxWidth: 720 }}
          >
            It&rsquo;s time for a more powerful and intuitive GIS
          </h2>
        </div>
      </GridSection>
    </div>
  );
}
