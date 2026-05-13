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
import { useRef } from "react";

const COPY =
  "Our simple APIs let you query, generate, and reason over any location on Earth — buildings, terrain, traffic, climate. Columbus Pro, MapsGPT, and the Large Geospatial Model streamline how your team turns the physical world into decisions.";

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
    <section className="section">
      <div className="container-site">
        <p
          ref={ref}
          className="mx-auto max-w-3xl text-center text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight leading-snug text-ink"
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
