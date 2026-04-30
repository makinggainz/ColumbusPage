"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import styles from "../technology.module.css";

type Tile = { kicker: string; title: string; prompt: string };

const TILES: Tile[] = [
  {
    kicker: "Columbus GenLayer",
    title: "Solar roof possibility",
    prompt: "rank the possibility of solar roof panel installation in this neighborhood",
  },
  {
    kicker: "Columbus GenLayer",
    title: "Resident Vibes",
    prompt: "rank residential community vibrancy across this area",
  },
  {
    kicker: "Columbus GenLayer",
    title: "Safety Score",
    prompt: "highlight low-incident streets and high-visibility safety zones",
  },
];

// Total scroll distance is 70vh sticky pin + 200vh of travel = 270vh.
// The pin is centered in the viewport (CSS top: 15vh on .genLayersStickyInner),
// so raw = 0 when outerRect.top hits 15vh (sticky starts) and raw = 1 when
// outerRect.top hits -185vh (sticky releases — outer.bottom reaches inner
// bottom at 85vh from viewport top). Travel distance is 200vh.
//
// Tile-state buckets across the 0..1 progress range:
//   [0,    0.46) tile 1 active (intro overlay covers it for the first
//                ~20% — tile 1 is already in its expanded layout
//                underneath, so when the intro fades there's no
//                "expand from collapsed" transition).
//   [0.46, 0.73) tile 2
//   [0.73, 1.00] tile 3
const TRAVEL_VH = 2;
const STICKY_TOP_VH = 0.15;

// Tile-bucket boundaries inside the 0..1 raw progress space — must match
// the activeTile thresholds below.
const TILE_BUCKETS: Array<{ start: number; end: number }> = [
  { start: 0, end: 0.46 },
  { start: 0.46, end: 0.73 },
  { start: 0.73, end: 1 },
];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// SVG overlays drawn over each tile's satellite image during the analyse
// animation. Coordinates are in a 0..100 × 0..67 viewBox (matches the
// images' ~3:2 aspect ratio) and are positioned as approximations of the
// real-world features visible in HK Map.png / HK Map2.png. They can be
// nudged later for tighter alignment.

// Roof positions — many small rectangles spread densely across the
// residential aerial. Generated programmatically with deterministic
// jitter so each row/column staggers slightly and the overall pattern
// reads as a packed neighbourhood.
const ROOF_RECTS: Array<{ x: number; y: number; w: number; h: number }> = (() => {
  const rects: Array<{ x: number; y: number; w: number; h: number }> = [];
  const cols = 14;
  const rows = 10;
  // Pseudo-random in [-1, 1] from a deterministic hash so the layout is
  // stable but doesn't read as a perfect grid.
  const rand = (r: number, c: number) => {
    const v = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
    return (v - Math.floor(v)) * 2 - 1;
  };
  const colSpan = 100 / (cols + 1);
  const rowSpan = 67 / (rows + 1);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = (c + 1) * colSpan + rand(r, c) * 1.4;
      const cy = (r + 1) * rowSpan + rand(r + 100, c + 100) * 0.9;
      const w = 2 + rand(r + 7, c + 11) * 0.4;
      const h = 1.3 + rand(r + 13, c + 19) * 0.25;
      rects.push({ x: cx - w / 2, y: cy - h / 2, w, h });
    }
  }
  return rects;
})();

// Street polylines — approximate boulevard + side-street paths visible
// in HK Map2.png. All coordinates stay inside the SVG viewBox
// (0 0 100 67) so no path overflows the image bounds.
const STREET_PATHS: string[] = [
  // Major boulevards / diagonals.
  "M 0 36 L 48 32 L 60 28 L 100 22",
  "M 35 0 L 50 33 L 60 67",
  "M 50 0 L 65 67",
  "M 18 0 L 30 67",
  "M 60 25 L 95 50",
  "M 0 0 L 38 48",
  "M 0 60 L 100 60",
  // Secondary cross-streets.
  "M 0 14 L 100 12",
  "M 0 22 L 60 20",
  "M 0 48 L 100 44",
  "M 0 56 L 100 52",
  "M 70 0 L 80 67",
  "M 8 0 L 14 67",
  "M 42 0 L 55 67",
  "M 82 0 L 92 67",
  "M 25 18 L 70 22",
  "M 30 55 L 90 55",
];

function TileOverlay({
  index,
  refSetter,
}: {
  index: number;
  refSetter: (el: SVGSVGElement | null) => void;
}) {
  return (
    <svg
      ref={refSetter}
      className={styles.genLayersTileOverlay}
      viewBox="0 0 100 67"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {index === 2
        ? STREET_PATHS.map((d, i) => (
            <path key={i} d={d} className={styles.genLayersTileStreet} />
          ))
        : ROOF_RECTS.map((r, i) => (
            <rect
              key={i}
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              className={
                index === 0
                  ? // Solar: alternate red (low potential) and blue (high)
                    i % 2 === 0
                    ? styles.genLayersTileRoofA
                    : styles.genLayersTileRoofB
                  : // Vibes: rotate through three vibe colors
                    i % 3 === 0
                    ? styles.genLayersTileVibeA
                    : i % 3 === 1
                      ? styles.genLayersTileVibeB
                      : styles.genLayersTileVibeC
              }
            />
          ))}
    </svg>
  );
}

export function GenLayersSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  // Refs for the elements whose styles we update on every scroll frame.
  // Bypasses React state/re-renders so the visuals track scroll instantly.
  const progressFillRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const tileRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const tileOverlayRefs = useRef<Array<SVGSVGElement | null>>([null, null, null]);
  // tilePromptRefs → top-left prompt box (appears first, before overlay).
  // tileTextRefs   → bottom-center kicker + title (appears after overlay).
  const tilePromptRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const tileTextRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const introRef = useRef<HTMLDivElement | null>(null);
  const tilesRowRef = useRef<HTMLDivElement | null>(null);
  // 0/1/2 = active tile. Tile 1 is active from the start so its analyse
  // animation starts running as soon as the user enters the section.
  const [activeTile, setActiveTile] = useState(0);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    let rafId = 0;
    let lastTile = 0;
    let lastRaw = 0;
    let direction: "forward" | "backward" = "forward";
    let snapTimeout = 0;
    let isSnapping = false;
    let snapResetTimeout = 0;

    const update = () => {
      rafId = 0;
      const rect = node.getBoundingClientRect();
      const stickyTopPx = window.innerHeight * STICKY_TOP_VH;
      const extraPx = window.innerHeight * TRAVEL_VH;
      // raw = 0 when outer.top hits the sticky offset (sticky starts).
      // raw = 1 after travel distance (sticky releases).
      const raw = Math.max(0, Math.min(1, (stickyTopPx - rect.top) / extraPx));

      // Track scroll direction for the intro → tile 1 snap below.
      if (raw !== lastRaw) {
        direction = raw > lastRaw ? "forward" : "backward";
        lastRaw = raw;
      }

      // (Per-tile progress segments are filled inside the loop below — each
      //  segment's width = its tile's local progress.)

      // Intro overlay — heavy-blur veil + headline + scroll hint, visible
      // only at the very start of the section. Fully opaque until raw=0.10,
      // fades to 0 by raw=0.20. Driven directly via DOM ref so it keeps
      // perfect cadence with scroll without React re-renders.
      const introOpacity = clamp01(1 - (raw - 0.1) / 0.1);
      if (introRef.current) {
        introRef.current.style.opacity = introOpacity.toString();
      }

      // Inactive-tile dark veil — held at 0 while the intro is fully
      // opaque, fades back to 100% by the time the intro is gone, so
      // the slivers behind the intro don't poison the bright frosted
      // backdrop with dark patches.
      if (tilesRowRef.current) {
        tilesRowRef.current.style.setProperty(
          "--inactive-veil-opacity",
          (1 - introOpacity).toString(),
        );
      }

      // Per-tile analyse animation — four phases per tile:
      //   [0,    0.20) — clean satellite imagery, nothing visible
      //   [0.20, 0.35) — prompt (top-left) fades in
      //   [0.35, 0.50) — SVG overlay (roof/street shapes) fades in
      //   [0.50, 1.0]  — kicker + title (bottom-center) + bottom blur fade in
      // Once a tile is past its bucket (raw >= bucket.end) its visuals
      // freeze at their final state so collapsed tiles still read as
      // "analysed" (just darkened via .genLayersTileInactive::after).
      for (let i = 0; i < TILE_BUCKETS.length; i++) {
        const bucket = TILE_BUCKETS[i];
        const isInBucket = raw >= bucket.start && raw < bucket.end;
        const local =
          raw >= bucket.end
            ? 1
            : isInBucket
              ? (raw - bucket.start) / (bucket.end - bucket.start)
              : 0;

        // Phase B — prompt text (top-left) flips 0→1 at local=0.20.
        // CSS transition on .genLayersTilePromptBox handles the fade.
        const showPrompt = isInBucket && local >= 0.20 ? 1 : 0;
        const promptEl = tilePromptRefs.current[i];
        if (promptEl) {
          promptEl.style.opacity = showPrompt.toString();
        }

        // Phase C — SVG overlay reveals each child shape one-by-one across
        // local 0.35 → 0.48. Stagger: the span is divided across all
        // children with each shape doing its own short opacity fade, giving
        // a "house-by-house" or "street-by-street" reveal.
        const overlayEl = tileOverlayRefs.current[i];
        if (overlayEl) {
          overlayEl.style.opacity = "1";
          const children = overlayEl.children;
          const N = children.length;
          const animStart = 0.35;
          const animEnd = 0.48;
          const fadeDuration = 0.02;
          const stride =
            N > 1 ? (animEnd - animStart - fadeDuration) / (N - 1) : 0;
          for (let j = 0; j < N; j++) {
            const start = animStart + j * stride;
            const op = clamp01((local - start) / fadeDuration);
            (children[j] as SVGElement).style.opacity = op.toString();
          }
        }

        // Per-tile progress segment — width tracks `local` directly.
        const segEl = progressFillRefs.current[i];
        if (segEl) {
          segEl.style.width = `${(local * 100).toFixed(2)}%`;
        }

        // Phase D — kicker + title (bottom-center) flip 0→1 at local=0.50.
        // CSS transition on .genLayersTileText handles the fade.
        // The bottom blur (--text-blur-opacity) tracks the same threshold
        // so the frosted strip fades in alongside the title.
        const showTitle = isInBucket && local >= 0.50 ? 1 : 0;
        const textEl = tileTextRefs.current[i];
        if (textEl) {
          textEl.style.opacity = showTitle.toString();
        }

        const tileEl = tileRefs.current[i];
        if (tileEl) {
          tileEl.style.setProperty("--text-blur-opacity", showTitle.toString());
        }
      }

      // Active tile only changes at threshold crossings — gate the React
      // state update so we don't trigger pointless re-renders every frame.
      let next = 0;
      if (raw >= 0.73) next = 2;
      else if (raw >= 0.46) next = 1;
      if (next !== lastTile) {
        lastTile = next;
        setActiveTile(next);
      }
    };

    // Auto-complete the intro → tile-1 transition: when the user pauses
    // scrolling with raw landing inside [0.10, 0.20] (the cross-fade zone)
    // and they were moving forward, smooth-scroll past the transition so
    // they don't get stuck mid-fade. Only triggers forward; reverse-scroll
    // through the same range stays continuous.
    const maybeSnap = () => {
      if (isSnapping) return;
      const rect = node.getBoundingClientRect();
      const stickyTopPx = window.innerHeight * STICKY_TOP_VH;
      const extraPx = window.innerHeight * TRAVEL_VH;
      const raw = (stickyTopPx - rect.top) / extraPx;
      if (raw > 0.10 && raw < 0.20 && direction === "forward") {
        const targetRaw = 0.22;
        const targetRectTop = stickyTopPx - targetRaw * extraPx;
        const deltaY = rect.top - targetRectTop;
        isSnapping = true;
        window.scrollTo({ top: window.scrollY + deltaY, behavior: "smooth" });
        // Release the snap lock once the smooth-scroll has had time to
        // finish (CSS smooth-scroll on html ≈ 300–500ms).
        if (snapResetTimeout) window.clearTimeout(snapResetTimeout);
        snapResetTimeout = window.setTimeout(() => {
          isSnapping = false;
        }, 800);
      }
    };

    const onScroll = () => {
      if (rafId === 0) {
        rafId = window.requestAnimationFrame(update);
      }
      if (snapTimeout) window.clearTimeout(snapTimeout);
      snapTimeout = window.setTimeout(maybeSnap, 150);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
      if (snapTimeout) window.clearTimeout(snapTimeout);
      if (snapResetTimeout) window.clearTimeout(snapResetTimeout);
    };
  }, []);

  return (
    <div
      id="gen-layers-band"
      className={`${styles.genLayersBand} ${styles.darkSurface}`}
    >
      <div className={styles.genLayersInner}>
        {/* Starburst + "Gen Layers" label sitting over the long left arm */}
        <div className={styles.genLayersHead}>
          <div className={styles.genLayersHeadStarburst}>
            <Image
              src="/TechnologyPageImages/VoyagerGraphic.png"
              alt=""
              fill
              sizes="100vw"
              style={{ objectFit: "contain", objectPosition: "right center" }}
              priority={false}
            />
          </div>
          <span className={styles.genLayersHeadLabel}>Gen Layers</span>
        </div>

        {/* Sticky-scroll experience — outer wrapper is 4 viewports tall;
            the inner panel pins to the top for the duration of the scroll,
            and tile state is driven entirely by scroll progress. */}
        <div ref={sectionRef} className={styles.genLayersStickyOuter}>
          <div className={styles.genLayersStickyInner}>
            <div
              ref={tilesRowRef}
              className={[
                styles.genLayersTilesRow,
                activeTile === 0 ? styles.genLayersTilesRowState1 : "",
                activeTile === 1 ? styles.genLayersTilesRowState2 : "",
                activeTile === 2 ? styles.genLayersTilesRowState3 : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {TILES.map((tile, i) => {
                const isActive = i === activeTile;
                const isInactive = activeTile >= 0 && !isActive;
                return (
                  <div
                    key={tile.title}
                    ref={(el) => {
                      tileRefs.current[i] = el;
                    }}
                    className={[
                      styles.genLayersTile,
                      isActive ? styles.genLayersTileActive : "",
                      isInactive ? styles.genLayersTileInactive : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {/* SVG overlay drawn over the tile's satellite image —
                        roof shapes for tiles 1 & 2 (HK Map.png), street
                        paths for tile 3 (HK Map2.png). Opacity is driven
                        each frame from tileOverlayRefs in the rAF tick. */}
                    <TileOverlay
                      index={i}
                      refSetter={(el) => {
                        tileOverlayRefs.current[i] = el;
                      }}
                    />

                    {/* Phase B — prompt + label, top-left, fades in first
                        before the SVG overlay. Driven by tilePromptRefs. */}
                    <div
                      ref={(el) => {
                        tilePromptRefs.current[i] = el;
                      }}
                      className={styles.genLayersTilePromptBox}
                    >
                      <span className={styles.genLayersTilePromptLabel}>Prompt:</span>
                      <span className={styles.genLayersTilePrompt}>
                        &ldquo;{tile.prompt}&rdquo;
                      </span>
                    </div>

                    {/* Phase D — kicker + title, bottom-center, fades in
                        after the SVG overlay finishes. Driven by tileTextRefs. */}
                    <div
                      ref={(el) => {
                        tileTextRefs.current[i] = el;
                      }}
                      className={styles.genLayersTileText}
                    >
                      <span className={styles.genLayersTileKicker}>{tile.kicker}</span>
                      <span className={styles.genLayersTileTitle}>{tile.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Intro overlay — heavy backdrop-blur veil + headline +
                scroll hint, covers the tiles at the very start of the
                section. Opacity is driven directly each frame via
                introRef in the rAF tick. */}
            <div
              ref={introRef}
              className={styles.genLayersIntro}
              aria-hidden
            >
              <h3 className={styles.genLayersHeadline}>
                Columbus-01 can dynamically creating geodata layers, without
                complex and expensive surveying.
              </h3>
              <span className={styles.genLayersScrollHint}>
                <svg width="16" height="22" viewBox="0 0 18 26" fill="none" aria-hidden>
                  <path
                    d="M9 1V22M1 15l8 8 8-8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Scroll to see the magic
              </span>
            </div>
          </div>

          {/* Progress bar — three pill-shaped segments, one per tile,
              sticky-pinned below the panel. Each segment's fill width is
              written directly each rAF tick (see useEffect) so the bar
              tracks scroll without React re-renders. */}
          <div className={styles.genLayersProgressBar} aria-hidden>
            {[0, 1, 2].map((i) => (
              <div key={i} className={styles.genLayersProgressSegment}>
                <div
                  ref={(el) => {
                    progressFillRefs.current[i] = el;
                  }}
                  className={styles.genLayersProgressSegmentFill}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Glass CTA — MapsGPT page style */}
        <div className={styles.genLayersExploreWrap}>
          <a href="/use-cases" className={styles.genLayersExploreBtn}>
            <span>Explore more maps we&apos;ve made</span>
            <svg width="10" height="18" viewBox="0 0 7 12" fill="none" aria-hidden>
              <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

      </div>
    </div>
  );
}
