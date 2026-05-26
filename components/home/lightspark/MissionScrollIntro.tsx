"use client";

/**
 * Mission / vision section — mirrors the scroll-driven word-reveal
 * pattern used by TextScrollIntro and ElioTextScrollIntro (Framer
 * Motion useScroll + per-word useTransform opacity 0.15 → 1).
 *
 * Background: minimalistCity watermark applied via the exact same
 * masked + dimmed pseudo-layer treatment that ColumbusBackgroundMB
 * carries on TextScrollIntro (the "We're all about maps" / Columbus
 * intro background pattern):
 *   - absolute-positioned div at -z-10 so the foreground text isn't dimmed
 *   - background-size: 120vw 70vw (extends past the viewport's left + right)
 *   - opacity: 0.5
 *   - linear-gradient mask: transparent → 15% → 85% → transparent so the
 *     watermark melts seamlessly into the page above and below
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

const COPY =
  "We are building a thinking planet — a computer brain that reasons across the vastness of geospatial data. A Universal Geospatial Model. The most powerful map platform ever built.";

export function MissionScrollIntro() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    /* Tighter end offset (0.5 vs 0.3) — the word-reveal reaches full
       opacity over a shorter scroll distance, so the text fills faster. */
    offset: ["start 0.85", "end 0.5"],
  });

  const words = COPY.split(" ");
  const windowSize = 2 / words.length;

  return (
    <section
      className="section relative isolate"
      style={{
        /* Extra height for this section vs the base .section padding so
           the minimalistCity watermark renders taller and the band has
           more breathing room around the scroll-reveal paragraph. */
        minHeight: "min(85vh, 820px)",
        paddingTop: 160,
        paddingBottom: 160,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Watermark layer — 75% opacity, no top/bottom fade. The image
          source is now an <Image> child (was a CSS background-image of
          a 843 KB PNG) so the optimizer can ship an AVIF/WebP variant.
          objectFit:fill mirrors the original `background-size: 100% 100%`
          stretch — guarantees full width AND no top/bottom crop on
          shorter sections. The minimalistCity skyline is a flat
          horizontal scene so the vertical squish is visually invisible. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
      >
        <ImageWithFallback
          src="/minimalistCity.png"
          alt=""
          fill
          sizes="100vw"
          quality={75}
          style={{ objectFit: "fill" }}
        />
      </div>

      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          {/* Exception to the typography system: this scroll-reveal lead
              paragraph keeps the three-tier responsive sizing (24/30/36px)
              + leading-snug already documented on the Columbus and Elio
              intro paragraphs. */}
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

export default MissionScrollIntro;
