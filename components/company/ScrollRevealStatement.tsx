"use client";

/**
 * Scroll-driven word-reveal statement.
 *
 * As the paragraph scrolls through the viewport its words fill in one
 * after another (the homepage `MissionScrollIntro` mechanic — Framer
 * Motion useScroll + per-word useTransform), then — once it has been
 * read at centre — they un-fill again as it scrolls away, so focus is
 * handed to whatever statement fills in next.
 *
 * Lifecycle over the element's scroll journey (0 = entering from the
 * bottom, 0.5 = exactly centred, 1 = leaving past the top):
 *   0 → FILL_END           words fill in, one after another
 *   FILL_END → UNFILL_START statement holds fully lit (brackets centre)
 *   UNFILL_START → 1        words un-fill, one after another
 *
 * Typography matches the homepage component verbatim — the documented
 * 24 / 30 / 36px exception to the type scale.
 */

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

/* Opacity a word rests at before it has filled / after it has un-filled. */
const DIM = 0.15;
/* Word-fill completes by this point in the scroll journey — just before
   the statement reaches centre, so it is fully lit while centred. */
const FILL_END = 0.46;
/* Un-fill begins here — just after centre. The statement therefore holds
   fully lit across FILL_END…UNFILL_START, which brackets the 0.5 centre. */
const UNFILL_START = 0.56;
/* Width (in progress units) of a single word's fade ramp. */
const RAMP = 0.14;

export function ScrollRevealStatement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    /* Symmetric offsets → progress 0.5 is the element exactly centred. */
    offset: ["start 0.85", "end 0.15"],
  });

  const words = text.split(" ");
  const lastIndex = Math.max(1, words.length - 1);

  return (
    <p
      ref={ref}
      className="mx-auto max-w-3xl text-center text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight leading-snug text-ink"
    >
      {words.map((word, i) => (
        <Word
          key={`${i}-${word}`}
          word={word}
          frac={i / lastIndex}
          progress={scrollYProgress}
          reduced={Boolean(reduced)}
        />
      ))}
    </p>
  );
}

function Word({
  word,
  frac,
  progress,
  reduced,
}: {
  /** The word's text. */
  word: string;
  /** 0…1 position of this word within the sentence. */
  frac: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  // Fill ramps are spread across [0, FILL_END]; un-fill ramps across
  // [UNFILL_START, 1] — both in word order, so the top of the paragraph
  // (which enters/leaves the viewport first) fills and un-fills first.
  const fillStart = frac * (FILL_END - RAMP);
  const fillEnd = fillStart + RAMP;
  const unfillStart = UNFILL_START + frac * (1 - RAMP - UNFILL_START);
  const unfillEnd = unfillStart + RAMP;

  const opacity = useTransform(
    progress,
    [fillStart, fillEnd, unfillStart, unfillEnd],
    [DIM, 1, 1, DIM],
  );

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
