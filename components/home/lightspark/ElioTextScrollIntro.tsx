"use client";

/**
 * Elio super-section intro — mirrors TextScrollIntro structurally.
 *
 * Centred Elio logo + wordmark + scroll-reveal Elio-flavoured paragraph.
 * Uses the same scroll-driven word-reveal animation (Framer Motion
 * useScroll + per-word useTransform) and the same documented exception
 * for the responsive paragraph sizing (24/30/36px three-tier) that
 * Columbus's TextScrollIntro carries.
 *
 * No logo filter: `/MapsGPT-logo.png` (the project's Elio stand-in,
 * also used by OurProductsSection's Elio cell) is already colour-correct.
 * Columbus's navy recolour filter does not apply here.
 */

import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const COPY =
  "A smarter, more social map for every spot on your list. Find your next anything — ranked by the things that actually matter: vibe, crowd, value, the time of day.";

export function ElioTextScrollIntro() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.3"],
  });

  const words = COPY.split(" ");
  const windowSize = 2 / words.length;

  return (
    <section className="section">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 flex items-center justify-center gap-3 lg:mb-12 lg:gap-4">
            <Image
              src="/MapsGPT-logo.png"
              alt="Elio logo"
              width={72}
              height={72}
              className="size-14 object-contain lg:size-16"
            />
            <h2 className="h2 tracking-tight text-ink">Elio</h2>
          </div>

          {/* Exception to the typography system: this scroll-reveal lead
              paragraph keeps its original three-tier responsive sizing
              (24/30/36px) and leading-snug. Same grandfathered exception
              as Columbus's TextScrollIntro. */}
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
      <motion.span className="inline-block" style={reduced ? undefined : { opacity }}>
        {word}
      </motion.span>
      <span> </span>
    </>
  );
}

export default ElioTextScrollIntro;
