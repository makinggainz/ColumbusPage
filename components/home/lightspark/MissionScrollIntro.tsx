"use client";

/**
 * Mission / vision section — mirrors the scroll-driven word-reveal
 * pattern used by TextScrollIntro and ElioTextScrollIntro (Framer
 * Motion useScroll + per-word useTransform opacity 0.15 → 1).
 */

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useMediaWarm } from "@/components/ui/MediaPrefetcher";
// Static import → AVIF + real blur-up placeholder.
import minimalistCity from "@/public/minimalistCityEnhanced.png";

/* Two-line copy — visual paragraph break between the two sentences. The
   word-reveal timing is continuous across both: indices are computed off
   the combined word count so the second line keeps fading in as part of
   the same scroll progression. */
const COPY_A =
  "We’re building a thinking earth: an AI that reasons across the vastness of geospatial data.";
const COPY_B =
  "We deliver this through simple and powerful products for humanity.";

export function MissionScrollIntro() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const warm = useMediaWarm();
  const { scrollYProgress } = useScroll({
    target: ref,
    /* Tighter end offset (0.5 vs 0.3) — the word-reveal reaches full
       opacity over a shorter scroll distance, so the text fills faster. */
    offset: ["start 0.85", "end 0.5"],
  });

  const wordsA = COPY_A.split(" ");
  const wordsB = COPY_B.split(" ");
  const totalWords = wordsA.length + wordsB.length;
  const windowSize = 2 / totalWords;

  return (
    <section
      className="section relative isolate"
      style={{
        minHeight: "min(85vh, 820px)",
        paddingTop: 160,
        paddingBottom: 160,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Watermark layer — 75% opacity, no top/bottom fade. The image
          source is an <Image> child (was a CSS background-image of a
          843 KB PNG) so the optimizer can ship an AVIF/WebP variant.
          object-fit on the image is set via .mission-watermark-img:
            • Desktop: `fill` mirrors the original
              `background-size: 100% 100%` stretch — guarantees full width
              + no top/bottom crop on shorter sections, and the flat
              horizontal skyline hides the vertical squish.
            • Mobile (≤640px): the section is tall + narrow, so `fill`
              would visibly stretch the skyline. Switch to `cover` — the
              image keeps its aspect ratio and any overflow simply bleeds
              past the (overflow-hidden) section edges, never deformed. */}
      <style>{`
        .mission-watermark-img { object-fit: fill; }
        @media (max-width: 640px) {
          .mission-watermark-img { object-fit: cover; }
        }
      `}</style>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
      >
        <ImageWithFallback
          className="mission-watermark-img"
          src={minimalistCity}
          alt=""
          fill
          sizes="100vw"
          quality={75}
          placeholder="blur"
          loading={warm ? "eager" : "lazy"}
          fetchPriority={warm ? "low" : undefined}
        />
      </div>

      <div className="content-bounds">
        <div className="mx-auto max-w-3xl">
          {/* Exception to the typography system: this scroll-reveal lead
              paragraph keeps the three-tier responsive sizing (24/30/36px)
              + leading-snug already documented on the Columbus and Elio
              intro paragraphs. */}
          <p
            ref={ref}
            className="text-center text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight leading-snug text-ink"
          >
            {wordsA.map((word, i) => {
              const start = Math.max(0, i / totalWords - windowSize * 0.25);
              const end = Math.min(1, start + windowSize);
              return (
                <Word
                  key={`a-${i}-${word}`}
                  word={word}
                  start={start}
                  end={end}
                  progress={scrollYProgress}
                  reduced={Boolean(reduced)}
                />
              );
            })}
            <br />
            <br />
            {wordsB.map((word, i) => {
              const globalI = wordsA.length + i;
              const start = Math.max(0, globalI / totalWords - windowSize * 0.25);
              const end = Math.min(1, start + windowSize);
              return (
                <Word
                  key={`b-${i}-${word}`}
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

export default MissionScrollIntro;
