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
 * The statement starts fully lit. As the section scrolls down, the
 * non-focus body words fade out — one after another — to a gently dimmed
 * state, while the `important` ("focus") words hold at full opacity, so
 * the key phrases are left standing out against the quieted rest.
 *
 * `prefers-reduced-motion` opts out — every word stays fully lit. So does
 * the `static` prop: the scroll-fade is a signature effect, so it is used
 * once (Our Mission); Our Vision passes `static` and renders fully lit
 * with no scroll motion, so the page isn't animating two sections in a row.
 */

/** Opacity the non-focus body text fades down to (kept gentle — still
 *  clearly readable, just quieted). */
const DIM = 0.4;
/** Scroll progress at which the body text begins to fade — kept late so
 *  the statement stays fully readable as it enters and rises into view. */
const FADE_START = 0.42;
/** By this point in the scroll journey the body text has fully faded. */
const FADE_END = 0.72;
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
  static: isStatic = false,
}: {
  segments: StatementSegment[];
  /** Render fully lit with no scroll motion (used for Our Vision). */
  static?: boolean;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.15"],
  });

  const tokens = tokenize(segments);
  const lastIndex = Math.max(1, tokens.length - 1);
  // `static` and reduced-motion share one path: every word stays lit.
  const lit = isStatic || Boolean(reduced);

  return (
    <p
      ref={ref}
      className="mx-auto max-w-3xl text-balance text-center text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight leading-snug text-ink"
    >
      {tokens.map((token, i) => (
        <Word
          key={`${i}-${token.word}`}
          token={token}
          frac={i / lastIndex}
          progress={scrollYProgress}
          reduced={lit}
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
  // Body words fade out on a ramp staggered by their position across
  // [FADE_START, FADE_END], so the statement quiets down in reading order
  // — and only once it has been read.
  const start = FADE_START + frac * (FADE_END - FADE_START - RAMP);
  const end = start + RAMP;
  const opacity = useTransform(progress, [start, end], [1, DIM]);

  let content;
  if (reduced || token.important) {
    // Focus words (and reduced-motion) stay fully lit.
    content = <span className="inline-block">{token.word}</span>;
  } else {
    // Body text — full at the start, fades out as you scroll.
    content = (
      <motion.span className="inline-block" style={{ opacity }}>
        {token.word}
      </motion.span>
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
