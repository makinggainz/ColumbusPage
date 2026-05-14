"use client";

/**
 * Section 1 of the Lightspark-ported island.
 *
 * Scroll-driven word-reveal lead paragraph. Each word starts faded
 * (opacity 0.15, reads as a ghosted "shadow" on white) and fills to
 * full ink as the user scrolls through the section, in sequence.
 * Mirrors Lightspark's `TextScroll_textscroll__shadow` + per-word
 * `data-projection-id` animation pattern, rebuilt with Framer Motion
 * `useScroll` + per-word `useTransform`.
 *
 * Copy is rebranded to Columbus (geospatial / AI for the physical
 * world) per the approved plan; the original Lightspark text was
 * about cross-border money movement.
 */

import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

// Recolour filter matching MistxNav so the brand mark reads in the
// same navy blue everywhere it appears on the site.
const COLUMBUS_LOGO_FILTER =
  "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)";

// Copy reframed as a definition of the platform itself (rather than an
// API/product blurb). Leads with the noun phrase ("The agentic platform")
// — the "Columbus" brand title above the paragraph supplies the subject.
const COPY =
  "The agentic platform for the physical world. We let teams query, generate, and reason over any location on Earth — buildings, terrain, traffic, climate — turning raw geographic complexity into clear, grounded answers in plain English.";

export function TextScrollIntro() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  // Animation runs from when the paragraph crosses 85% of viewport
  // down to when its end crosses 30% — gives roughly a full screen of
  // scroll over which all words fill in.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.3"],
  });

  const words = COPY.split(" ");
  // Each word gets a small "active" window inside scrollYProgress.
  // Windows are overlapped (each spans 2/n of the total) so reveals
  // feel smooth rather than stepped.
  const windowSize = 2 / words.length;

  return (
    <section className="section relative isolate">
      {/* Watermark layer — split out from the section's inline background
          so we can fade the top + bottom into the page surface (via
          mask-image) and dial the whole image down to 50% opacity
          without affecting the foreground text. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: 'url("/ColumbusBackgroundMB.png")',
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          /* 120vw width pushes the watermark a touch past the viewport's
             left + right edges. Height set to 70vw — ~35% taller than
             the natural ~52vw at 100vw width (img is 1740×904). */
          backgroundSize: "120vw 70vw",
          opacity: 0.5,
          /* Linear fade: transparent at the top edge → opaque from 15%
             to 85% → transparent again at the bottom edge, so the
             watermark melts seamlessly into the page above and below. */
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
        }}
      />
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          {/* Brand title — logo to the left of the wordmark, centred
             above the scroll-reveal paragraph. */}
          <div className="mb-10 flex items-center justify-center gap-3 lg:mb-12 lg:gap-4">
            <Image
              src="/logobueno.png"
              alt="Columbus logo"
              width={72}
              height={72}
              className="size-14 object-contain lg:size-16"
              style={{ filter: COLUMBUS_LOGO_FILTER }}
            />
            <h2 className="h2 tracking-tight text-ink">
              Columbus
            </h2>
          </div>

          {/* Exception to the typography system: this scroll-reveal lead
              paragraph keeps its original three-tier responsive sizing
              (24/30/36px) and leading-snug. The design system's single
              991px cutoff loses the middle tier and the .h3 class uses
              the default heading line-height (106%), both of which hurt
              this animation. Treat as a one-off display paragraph. */}
          <p
            ref={ref}
            className="text-center text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight leading-snug text-ink"
          >
            {words.map((word, i) => {
              const start = Math.max(0, i / words.length - windowSize * 0.25);
              const end = Math.min(1, start + windowSize);
              return (
                <Word
                  key={`${i}-${word}`}
                  word={word}
                  start={start}
                  end={end}
                  progress={scrollYProgress}
                  reduced={Boolean(reduced)}
                />
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}

function Word({
  word,
  start,
  end,
  progress,
  reduced,
}: {
  word: string;
  start: number;
  end: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  return (
    <>
      <motion.span
        className="inline-block"
        style={reduced ? undefined : { opacity }}
      >
        {word}
      </motion.span>
      {/* preserve normal word spacing without breaking inline flow */}
      <span> </span>
    </>
  );
}

export default TextScrollIntro;
