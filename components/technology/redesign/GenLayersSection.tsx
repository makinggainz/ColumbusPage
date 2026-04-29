"use client";

import { useEffect, useRef, useState } from "react";

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
      preserveAspectRatio="none"
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
  const tileTextRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const introRef = useRef<HTMLDivElement | null>(null);
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
      if (introRef.current) {
        const introOpacity = clamp01(1 - (raw - 0.1) / 0.1);
        introRef.current.style.opacity = introOpacity.toString();
        introRef.current.style.pointerEvents = introOpacity > 0 ? "none" : "none";
      }

      // Per-tile analyse animation. Each tile's local progress is mapped
      // to three phases:
      //   [0, 0.30)    — clean satellite imagery, no overlays, no bottom blur
      //   [0.30, 0.45) — SVG overlay (roof/street shapes) fades in
      //   [0.45, 1.0]  — text + bottom blur fade in and stay
      // Once a tile is past its bucket (raw >= bucket.end) its visuals
      // freeze at the phase-C state so collapsed tiles still read as
      // "analysed" (just blurred via .genLayersTileInactive::after).
      for (let i = 0; i < TILE_BUCKETS.length; i++) {
        const bucket = TILE_BUCKETS[i];
        const isInBucket = raw >= bucket.start && raw < bucket.end;
        const local =
          raw >= bucket.end
            ? 1
            : isInBucket
              ? (raw - bucket.start) / (bucket.end - bucket.start)
              : 0;

        // SVG overlay reveals each child shape one-by-one across the
        // analyse-overlay phase (local 0.30 → 0.40). Stagger is fast: the
        // total span of 0.10 progress is divided across however many
        // children the SVG has, with each shape doing its own short
        // opacity fade. This produces a visible "house-by-house" reveal
        // on the roof tiles and a "street-by-street" reveal on the safety
        // tile. The wrapping SVG stays at opacity: 1 — only its children's
        // opacities are animated.
        const overlayEl = tileOverlayRefs.current[i];
        if (overlayEl) {
          overlayEl.style.opacity = "1";
          const children = overlayEl.children;
          const N = children.length;
          const animStart = 0.30;
          const animEnd = 0.40;
          const fadeDuration = 0.02;
          const stride =
            N > 1 ? (animEnd - animStart - fadeDuration) / (N - 1) : 0;
          for (let j = 0; j < N; j++) {
            const start = animStart + j * stride;
            const op = clamp01((local - start) / fadeDuration);
            (children[j] as SVGElement).style.opacity = op.toString();
          }
        }

        // Per-tile progress segment — width tracks the same `local` used
        // for the visuals: 0% before this tile is active, 100% once the
        // user has scrolled past it, smoothly interpolated while inside
        // its bucket.
        const segEl = progressFillRefs.current[i];
        if (segEl) {
          segEl.style.width = `${(local * 100).toFixed(2)}%`;
        }

        // Text + bottom blur are NOT scroll-driven. They flip 0 → 1 once
        // the SVG overlay finishes its scroll-driven fade-in (local >=
        // 0.45) on the currently active tile, and CSS transitions on
        // .genLayersTileText / .genLayersTile::before take care of the
        // animated reveal. Past or future tiles always read 0.
        const showText = isInBucket && local >= 0.45 ? 1 : 0;
        const textEl = tileTextRefs.current[i];
        if (textEl) {
          textEl.style.opacity = showText.toString();
        }

        const tileEl = tileRefs.current[i];
        if (tileEl) {
          tileEl.style.setProperty("--text-blur-opacity", showText.toString());
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
          <svg
            className={styles.genLayersHeadStarburst}
            viewBox="0 0 1600 220"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            {(() => {
              const cx = 1500;
              const cy = 110;
              const stroke = "rgba(255, 255, 255, 0.92)";
              type TickStyle = "even" | "end" | "none";
              type Arm = { angle: number; len: number; ticks: TickStyle };
              const arms: Arm[] = [
                { angle: 180.4, len: 1460, ticks: "end" },
                { angle: 187, len: 200, ticks: "even" },
                { angle: 226, len: 90, ticks: "even" },
                { angle: 252, len: 100, ticks: "none" },
                { angle: 267, len: 105, ticks: "none" },
                { angle: 282, len: 100, ticks: "none" },
                { angle: 317, len: 80, ticks: "end" },
                { angle: 350, len: 85, ticks: "even" },
                { angle: 4, len: 85, ticks: "even" },
                { angle: 31, len: 95, ticks: "even" },
                { angle: 66, len: 100, ticks: "even" },
                { angle: 90, len: 105, ticks: "even" },
                { angle: 113, len: 105, ticks: "none" },
                { angle: 147, len: 95, ticks: "even" },
              ];
              return arms.map((arm, i) => {
                const rad = (arm.angle * Math.PI) / 180;
                const x2 = cx + Math.cos(rad) * arm.len;
                const y2 = cy + Math.sin(rad) * arm.len;
                const perp = rad + Math.PI / 2;
                const tickHalf = 3.6;
                const buildTicks = () => {
                  if (arm.ticks === "none") return [] as number[];
                  const spacing = 9;
                  if (arm.ticks === "even") {
                    const out: number[] = [];
                    for (let d = 18; d <= arm.len - 14; d += spacing) out.push(d);
                    return out;
                  }
                  const count = Math.min(8, Math.floor(arm.len / 14));
                  return Array.from({ length: count }, (_, k) => arm.len - 14 - k * spacing);
                };
                const ticks = buildTicks();
                return (
                  <g key={i}>
                    <line
                      x1={cx}
                      y1={cy}
                      x2={x2}
                      y2={y2}
                      stroke={stroke}
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    {ticks.map((d, t) => {
                      const tx = cx + Math.cos(rad) * d;
                      const ty = cy + Math.sin(rad) * d;
                      return (
                        <line
                          key={t}
                          x1={tx - Math.cos(perp) * tickHalf}
                          y1={ty - Math.sin(perp) * tickHalf}
                          x2={tx + Math.cos(perp) * tickHalf}
                          y2={ty + Math.sin(perp) * tickHalf}
                          stroke={stroke}
                          strokeWidth="1"
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </g>
                );
              });
            })()}
          </svg>
          <span className={styles.genLayersHeadLabel}>Gen Layers</span>
        </div>

        {/* Sticky-scroll experience — outer wrapper is 4 viewports tall;
            the inner panel pins to the top for the duration of the scroll,
            and tile state is driven entirely by scroll progress. */}
        <div ref={sectionRef} className={styles.genLayersStickyOuter}>
          <div className={styles.genLayersStickyInner}>
            <div
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

                    {/* Tile text content — fades in last, after the
                        analysed image is visible. */}
                    <div
                      ref={(el) => {
                        tileTextRefs.current[i] = el;
                      }}
                      className={styles.genLayersTileText}
                    >
                      <span className={styles.genLayersTileKicker}>{tile.kicker}</span>
                      <span className={styles.genLayersTileTitle}>{tile.title}</span>
                      <span className={styles.genLayersTilePromptLabel}>Prompt:</span>
                      <span className={styles.genLayersTilePrompt}>
                        &ldquo;{tile.prompt}&rdquo;
                      </span>
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
