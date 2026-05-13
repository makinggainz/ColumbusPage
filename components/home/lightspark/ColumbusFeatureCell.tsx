"use client";

/**
 * Columbus features cell — three feature rows inside the same grid
 * wrapper as OurProductsSection.
 *
 * Each row uses <ProductCell variant="split">:
 *   - Left half: feature name + description + "Learn more"
 *   - Right half: a glow-plated white card containing a unique mock
 *     (chat-bubble for Map Chat; list/table for Data Digestion;
 *     parcel grid for Site Selection and Audits)
 *
 * This component owns the outer hairline grid + fade overlays + the
 * per-feature mocks. The cell visuals themselves (glow, plate, card,
 * typography, geometry) all live in ProductCell.
 */

import { ProductCell } from "@/components/home/ProductCell";

// Recolour filter (mirrors MistxNav) so the Columbus mark renders in the
// same navy-blue brand colour used throughout the site.
const COLUMBUS_LOGO_FILTER =
  "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)";

interface Feature {
  key: string;
  name: string;
  desc: string;
  mock: "mapchat" | "data" | "site";
}

// All three rows share the sky-400 glow used by the Columbus cell in
// OurProductsSection (`.ops-cell--columbus`) — #38BDF8.
const COLUMBUS_GLOW = "56, 189, 248";

const FEATURES: Feature[] = [
  {
    key: "map-chat",
    name: "Map Chat",
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    mock: "mapchat",
  },
  {
    key: "data-digestion",
    name: "Data Digestion",
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    mock: "data",
  },
  {
    key: "site-selection",
    name: "Site Selection and Audits",
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    mock: "site",
  },
];

const CSS = `
/* container — matches OurProductsSection's content bounds
   (max-width 1287px; 20px gutters on mobile, auto-centred from md). */
.cfc-container {
  max-width: 1287px;
  margin-left: 20px;
  margin-right: 20px;
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .cfc-container { margin-left: auto; margin-right: auto; }
}

/* ── wrapper: matches OurProductsSection's grid + fillers + fades ── */
.cfc-grid {
  position: relative;
  width: 100%;
  margin-inline: auto;
  border-left: 1px solid var(--color-gridline);
}
.cfc-grid-inner { display: grid; grid-template-columns: 1fr; }

.cfc-cell,
.cfc-filler {
  border-bottom: 1px solid var(--color-gridline);
  border-right: 1px solid var(--color-gridline);
}
/* filler rows above and below the cell — their height controls how
   far the vertical hairlines (grid border-left + cell border-right)
   extend past the cell at top and bottom. The 70px fade overlay
   dissolves the outermost end of the line into the page. */
.cfc-filler { display: none; min-height: 112px; }
@media (min-width: 640px) { .cfc-filler { display: block; } }

.cfc-cell {
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
}

.cfc-fade { pointer-events: none; position: absolute; left: -1px; right: -1px; height: 70px; z-index: 4; }
.cfc-fade--top    { top: 0;    background-image: linear-gradient(#fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }
.cfc-fade--bottom { bottom: 0; background-image: linear-gradient(to top, #fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }

/* ── stacked feature rows (each row is a ProductCell variant="split") ── */
.cfc-rows { display: flex; flex-direction: column; }
.cfc-row:not(:first-of-type) {
  border-top: 1px solid var(--color-gridline);
}

/* Override ProductCell's default 1fr 1fr split — features need a wider
   visual column to host the image-backed panels (Map Chat, etc.). The
   text column shrinks to 1/4 of the row; the visual column expands to
   3/4 so the bg div sits ~1.5× wider with no overlap into the text. */
@media (min-width: 768px) {
  .cfc-row.pc-cell--split {
    grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
  }
}

/* ── visual: Map Chat — image-backed bg div + chat card overlay ────
   Border-radius 7px matches the navbar CTA buttons. At md+ the bg div
   is 50% wider than its original inset width and extends LEFTWARD into
   the row's text column (right anchor preserved). On mobile (stacked
   layout) it stays inside .pc-visual since there's no left column to
   extend into. The radial fade overlay was removed — the map image
   reads as-is across the panel. */
/* Colored plate sitting BEHIND the map bg div — peeks 7-8px outside
   the bg's edges on all sides to read as a thin colored "frame",
   matching the .pc-card-bg pattern used around the white skeleton
   cards in OurProductsSection. Sky-400 at 18% alpha is the same value
   the Columbus cell uses in OPS for its plate. */
.cfc-mapchat-bg-plate {
  position: absolute;
  inset: 17px;
  border: 1px solid #ffffff;
  border-radius: 11px;
  background: rgba(56, 189, 248, 0.18);
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .cfc-mapchat-bg-plate { inset: 29px; }
}
@media (min-width: 1024px) {
  .cfc-mapchat-bg-plate { inset: 36px; }
}

/* Bg div fills its column with a normal inset. The "50% wider" feel
   comes from CFC's grid override below (1fr → 3fr right-column) — the
   bg div doesn't need to extend past .pc-visual, so no overlap with
   the text column. */
.cfc-mapchat-bg {
  position: absolute;
  inset: 24px;
  border-radius: 7px;
  overflow: hidden;
  background-color: #ffffff;
  background-image: url('/MapChatbackgroundimg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
@media (min-width: 768px) {
  .cfc-mapchat-bg { inset: 36px; }
}
@media (min-width: 1024px) {
  .cfc-mapchat-bg { inset: 44px; }
}

/* white chat card overlaid on the map. At md+ the bg is now ~1.5× wider
   (driven by the grid override below). The card retains its original
   pixel gap from the bg's left edge (14% / 1.5 ≈ 9.333%) and its
   original pixel width (72% / 1.5 = 48%), so its gap from the bg's
   right edge naturally grows to 100% − 9.333% − 48% ≈ 42.667%. */
.cfc-mapchat-card {
  position: absolute;
  top: 8%;
  bottom: 8%;
  left: 14%;
  right: 14%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 18px 14px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(11, 27, 43, 0.04), 0 6px 18px rgba(11, 27, 43, 0.06);
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .cfc-mapchat-card {
    left: 9.333%;
    right: 42.667%;
  }
}
@media (min-width: 1024px) {
  .cfc-mapchat-card { padding: 20px 22px 16px; gap: 18px; }
}

/* past user message — gray bubble, right-aligned */
.cfc-mapchat-msg-user {
  align-self: flex-end;
  max-width: 92%;
  padding: 12px 14px;
  background: #F0F1F4;
  border-radius: 12px;
  font-size: var(--typography--p-m);
  line-height: 1.4;
  color: var(--color-ink, #0B1B2B);
}

/* assistant status row — small icon + stacked text */
.cfc-mapchat-status-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.cfc-mapchat-status-icon {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  flex: 0 0 auto;
  object-fit: contain;
}
.cfc-mapchat-status-stack {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.cfc-mapchat-status {
  font-size: var(--typography--p-m);
  line-height: 1.3;
  font-weight: 500;
  color: var(--color-muted, #6F7790);
}
.cfc-mapchat-substatus {
  font-size: var(--typography--p-m);
  line-height: 1.3;
  color: var(--color-muted, #6F7790);
}

/* active input area at the bottom — plain text + stop button */
.cfc-mapchat-input {
  margin-top: auto;
  display: flex;
  align-items: flex-end;
  gap: 12px;
}
.cfc-mapchat-input-text {
  flex: 1;
  margin: 0;
  font-size: var(--typography--p-m);
  line-height: 1.4;
  color: var(--color-ink, #0B1B2B);
}
.cfc-mapchat-stop {
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: #E7E9EF;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.cfc-mapchat-stop-icon {
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: var(--color-ink, #0B1B2B);
}

/* ── mock: Data Digestion (header bar + list rows) ────────────────── */
.cfc-mock-data {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
}
.cfc-mock-data .cfc-data-header {
  height: 18px;
  width: 38%;
  border-radius: 4px;
  background: #E7E9EF;
}
.cfc-mock-data .cfc-data-rows {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
}
.cfc-mock-data .cfc-data-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.cfc-mock-data .cfc-data-dot {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #F0F1F4;
  flex: 0 0 auto;
}
.cfc-mock-data .cfc-data-name {
  flex: 1;
  height: 10px;
  border-radius: 4px;
  background: #F0F1F4;
}
.cfc-mock-data .cfc-data-row:nth-child(1) .cfc-data-name { width: 64%; max-width: 64%; flex: 0 0 64%; }
.cfc-mock-data .cfc-data-row:nth-child(2) .cfc-data-name { width: 78%; max-width: 78%; flex: 0 0 78%; }
.cfc-mock-data .cfc-data-row:nth-child(3) .cfc-data-name { width: 56%; max-width: 56%; flex: 0 0 56%; }
.cfc-mock-data .cfc-data-row:nth-child(4) .cfc-data-name { width: 70%; max-width: 70%; flex: 0 0 70%; }
.cfc-mock-data .cfc-data-tag {
  width: 38px;
  height: 16px;
  border-radius: 6px;
  background: #E7E9EF;
  flex: 0 0 auto;
}

/* ── mock: Site Selection and Audits (3×3 parcel grid) ────────────── */
.cfc-mock-site {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 8px;
  height: 100%;
}
@media (min-width: 1024px) { .cfc-mock-site { gap: 10px; } }
.cfc-mock-site .cfc-site-cell {
  border-radius: 8px;
  background: #F0F1F4;
}
.cfc-mock-site .cfc-site-cell:nth-child(2),
.cfc-mock-site .cfc-site-cell:nth-child(6) {
  background: #E7E9EF;
  outline: 1.5px solid var(--color-brand);
  outline-offset: -1.5px;
}
.cfc-mock-site .cfc-site-cell:nth-child(8) {
  background: rgba(20, 81, 232, 0.10);
}
`;

/**
 * Map Chat visual — rounded image-backed panel with a chat-card overlay.
 *
 *   - .cfc-mapchat-bg : rounded rectangle (7px, matches navbar CTA) holding
 *     the Madrid map image as a background. A radial-gradient overlay on
 *     top of the image washes it toward white in the top-left, leaving the
 *     bottom-right as the visible "centre" of the radial.
 *   - .cfc-mapchat-card : white chat card over the map, biased left so the
 *     map keeps reading on the right edge. Contains a past user query
 *     (gray bubble), Columbus's investigating status, and an active input
 *     row with a stop button.
 */
function MapChatVisual() {
  return (
    <>
      {/* Colored plate peeking 7-8px outside the bg div's edges to give
         the map panel a "framed" border effect, matching the OPS cells. */}
      <div className="cfc-mapchat-bg-plate" aria-hidden />
      <div className="cfc-mapchat-bg" aria-hidden>
        <div className="cfc-mapchat-card">
        <div className="cfc-mapchat-msg-user">
          Show me parcels between 2,500–4,000 sqm where the surrounding luxury retail
          density is high but office vacancy is below 8%. I&rsquo;m developing a
          mixed-use building in Madrid with ground-floor luxury retail, 4 floors of
          premium office, and 6 floors of branded residences
        </div>
        <div className="cfc-mapchat-status-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logobueno.png"
            alt=""
            className="cfc-mapchat-status-icon"
            style={{ filter: COLUMBUS_LOGO_FILTER }}
          />
          <div className="cfc-mapchat-status-stack">
            <div className="cfc-mapchat-status">Columbus is investigating</div>
            <div className="cfc-mapchat-substatus">Considering demographics of Miami</div>
          </div>
        </div>
        <div className="cfc-mapchat-input">
          <p className="cfc-mapchat-input-text">
            Now only show me parcels where the asking price is under €12,000/sqm and
            within 400m of a Metro stop on Line 2 or Line 4.
          </p>
          <button className="cfc-mapchat-stop" type="button" aria-label="Stop">
            <span className="cfc-mapchat-stop-icon" />
          </button>
        </div>
        </div>
      </div>
    </>
  );
}

/**
 * Placeholder skeleton mocks for features that haven't been built out yet
 * (Data Digestion, Site Selection). Map Chat now uses MapChatVisual via
 * the `visual` prop instead.
 */
function Mock({ kind }: { kind: "data" | "site" }) {
  if (kind === "data") {
    return (
      <div className="cfc-mock-data" aria-hidden>
        <div className="cfc-data-header" />
        <div className="cfc-data-rows">
          {[0, 1, 2, 3].map((i) => (
            <div className="cfc-data-row" key={i}>
              <div className="cfc-data-dot" />
              <div className="cfc-data-name" />
              <div className="cfc-data-tag" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="cfc-mock-site" aria-hidden>
      {Array.from({ length: 9 }).map((_, i) => (
        <div className="cfc-site-cell" key={i} />
      ))}
    </div>
  );
}

export function ColumbusFeatureCell() {
  return (
    <section className="section">
      <style>{CSS}</style>
      <div className="cfc-container">
        <div className="cfc-grid">
          <div className="cfc-grid-inner">
            <div className="cfc-filler" aria-hidden />

            <div className="cfc-cell">
              <div className="cfc-rows">
                {FEATURES.map((f) => (
                  <ProductCell
                    key={f.key}
                    className="cfc-row"
                    variant="split"
                    name={f.name}
                    desc={f.desc}
                    href="#"
                    linkText="Learn more →"
                    glow={COLUMBUS_GLOW}
                    {...(f.key === "map-chat"
                      ? { visual: <MapChatVisual /> }
                      : { card: <Mock kind={f.mock as "data" | "site"} /> })}
                  />
                ))}
              </div>
            </div>

            <div className="cfc-filler" aria-hidden />
          </div>

          <div className="cfc-fade cfc-fade--top" aria-hidden />
          <div className="cfc-fade cfc-fade--bottom" aria-hidden />
        </div>
      </div>
    </section>
  );
}

export default ColumbusFeatureCell;
