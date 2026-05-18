"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

/**
 * Scroll-driven highlight statement (Our Mission / Our Vision).
 *
 * The body of the statement sits permanently in the dim resting state —
 * no fill-in. Only the `important` ("focus") words animate: they fade up
 * from dim to full, one after another, as the section scrolls down — so
 * scrolling progressively reveals the key phrases against the quiet rest.
 *
 * `prefers-reduced-motion` opts out — every word renders fully lit so the
 * statement stays readable.
 */

/** Opacity of the non-focus body text, and the focus words' start state. */
const DIM = 0.15;
/** By this point in the scroll journey every focus word has appeared. */
const APPEAR_END = 0.6;
/** Width (in progress units) of a single word's fade ramp. */
const RAMP = 0.14;

export type StatementSegment = { text: string; important?: boolean };

type Token = { word: string; important: boolean };

/** Flatten segments to words, each carrying its segment's `important`. */
function tokenize(segments: StatementSegment[]): Token[] {
  const tokens: Token[] = [];
  for (const seg of segments) {
    for (const word of seg.text.trim().split(/\s+/)) {
      if (word) tokens.push({ word, important: Boolean(seg.important) });
    }
  }
  return tokens;
}

export function ScrollHighlightStatement({
  segments,
}: {
  segments: StatementSegment[];
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.15"],
  });

  const tokens = tokenize(segments);
  const lastIndex = Math.max(1, tokens.length - 1);

  return (
    <p
      ref={ref}
      className="mx-auto max-w-3xl text-center text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight leading-snug text-ink"
    >
      {tokens.map((token, i) => (
        <Word
          key={`${i}-${token.word}`}
          token={token}
          frac={i / lastIndex}
          progress={scrollYProgress}
          reduced={Boolean(reduced)}
        />
      ))}
    </p>
  );
}

function Word({
  token,
  frac,
  progress,
  reduced,
}: {
  token: Token;
  /** 0…1 position of this word within the statement. */
  frac: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  // Focus words fade in on a ramp staggered by their position, so they
  // appear in reading order as the section scrolls down.
  const start = frac * (APPEAR_END - RAMP);
  const end = start + RAMP;
  const opacity = useTransform(progress, [start, end], [DIM, 1]);

  let content;
  if (reduced) {
    // No animation — render fully lit so the statement stays readable.
    content = <span className="inline-block">{token.word}</span>;
  } else if (token.important) {
    // Focus word — fades up from dim as you scroll.
    content = (
      <motion.span className="inline-block" style={{ opacity }}>
        {token.word}
      </motion.span>
    );
  } else {
    // Body text — held quietly in the dim resting state.
    content = (
      <span className="inline-block" style={{ opacity: DIM }}>
        {token.word}
      </span>
    );
  }

  return (
    <>
      {content}
      <span> </span>
    </>
  );
}

export default ScrollHighlightStatement;
