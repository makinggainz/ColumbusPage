"use client";

/**
 * Scroll-driven word-reveal statement.
 *
 * Each word fades from 0.15 → 1 opacity as the paragraph scrolls through
 * the viewport — the same mechanic the homepage `MissionScrollIntro`
 * ("We are building a thinking planet…") uses (Framer Motion
 * useScroll + per-word useTransform).
 *
 * Typography matches that homepage component verbatim — the documented
 * 24 / 30 / 36px exception to the type scale, medium weight, tight
 * tracking — so the company page's mission + vision statements read as
 * the same editorial moment as the homepage.
 */

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

export function ScrollRevealStatement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });

  const words = text.split(" ");
  const windowSize = 2 / words.length;

  return (
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
      <span> </span>
    </>
  );
}

export default ScrollRevealStatement;
