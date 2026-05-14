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
    key: "data-catalogue",
    name: "Data Catalogue",
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

/* Map Chat + Data Catalogue rows both own their visual via the map
   image, so the row-level sky-blue radial glow ProductCell paints
   behind every split row is redundant — strip it on both so only the
   map image reads behind the chat card / data-catalogue card. */
.cfc-row--mapchat.pc-cell--split,
.cfc-row--datacat.pc-cell--split {
  background-image: none;
}

/* ── visual: Map Chat + Data Catalogue — image-backed bg div + card overlay ──
   Shared positioning and base. The per-row card (chat composer for Map
   Chat, product screenshot for Data Catalogue) renders as a SIBLING of
   the bg div (both positioned within .pc-visual), so resizing the bg
   div's bounding box doesn't shift the card's screen position. */
.cfc-mapchat-bg,
.cfc-datacat-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background-color: #ffffff;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

/* Map Chat: the Madrid-map background stops short of the text column
   on the left instead of fading into it. From md+ the bg div is inset
   from the visual column's left edge by 6%, so the cell's white surface
   shows between the text and the map's hard left edge. On mobile the
   visual column stacks below the text, so the map fills full-width. */
.cfc-mapchat-bg {
  background-image: url('/MapChatbackgroundimg.png');
}
@media (min-width: 768px) {
  .cfc-mapchat-bg { inset: 0 0 0 6%; }
}

/* Data Catalogue is MIRRORED relative to the other rows — the visual
   column sits on the LEFT, the text column on the RIGHT. The map bg
   therefore starts from the row's left edge and fades toward white on
   the RIGHT (where it now meets the text). The product-screenshot card
   pins to the bottom-LEFT of the visual column with a right-edge mask
   that dissolves it into that same cream/white gap before the text.
   The grid swap only fires at md+; on mobile the row stacks (text on
   top, visual below) so the swap is a no-op. */
@media (min-width: 768px) {
  .cfc-row--datacat.pc-cell--split {
    grid-template-columns: minmax(0, 3fr) minmax(0, 1fr);
  }
  /* grid-row: 1 on BOTH is required. The .pc-cell--split grid uses the
     default grid-auto-flow (row / sparse). With only grid-column set,
     .pc-cell-head (DOM-first) lands at (1, 2) and the cursor advances
     past column 2; .pc-visual (DOM-second) at grid-column: 1 then ends
     up at (2, 1) instead of (1, 1), creating a phantom second row that
     pushes the map + card below the text. Pinning both to row 1 keeps
     them side-by-side. */
  .cfc-row--datacat .pc-cell-head { grid-column: 2; grid-row: 1; }
  .cfc-row--datacat .pc-visual    { grid-column: 1; grid-row: 1; }
}

.cfc-datacat-bg {
  background-image:
    linear-gradient(to left, #ffffff 0%, rgba(255,255,255,0.85) 10%, rgba(255,255,255,0.45) 25%, rgba(255,255,255,0.12) 42%, transparent 55%),
    url('/MapChatbackgroundimg.png');
  background-size: cover, cover;
  background-position: center, center;
  background-repeat: no-repeat, no-repeat;
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
  /* Card left aligned with .cfc-datacat-card below (22% / 24% of
     .pc-visual). Right values are tuned so the card width stays the
     same as before the alignment shift:
       base: 72% width (was 14%/14%, now 22%/6%)
       md:   48% width (was 9.333%/42.667%, now 22%/30%)
       lg:   48% width (was 9.333%/42.667%, now 24%/28%) */
  left: 22%;
  right: 6%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 18px 14px;
  background: #ffffff;
  border: 1px solid var(--color-gridline);
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(11, 27, 43, 0.04), 0 6px 18px rgba(11, 27, 43, 0.06);
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .cfc-mapchat-card {
    left: 22%;
    right: 30%;
  }
}
@media (min-width: 1024px) {
  .cfc-mapchat-card {
    left: 24%;
    right: 28%;
    padding: 20px 22px 16px;
    gap: 18px;
  }
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
  gap: 8px;
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

/* active input area at the bottom — rounded input pill containing the
   text and a stop button, mirroring a real chat composer. */
.cfc-mapchat-input {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px 12px 16px;
  background: #ffffff;
  border: 1px solid var(--color-gridline);
  border-radius: 10px;
}
.cfc-mapchat-input-text {
  flex: 1;
  margin: 0;
  padding: 2px 0;
  font-size: var(--typography--p-m);
  line-height: 1.5;
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

/* ── visual: Data Catalogue — product image card with top-RIGHT framed
   plate. Mirrored relative to the other rows because the Data Catalogue
   row swaps visual to the LEFT side (see grid override above). The
   white card pins to the bottom-LEFT of .pc-visual (left + bottom flush
   with the column's edges, top-RIGHT corner rounded 12px), sitting on
   a slightly larger colored plate that peeks 7-8px out on the top and
   right as a thin "border" sliver. */
.cfc-datacat-plate {
  position: absolute;
  left: 0;
  bottom: 0;
  right: calc(22% - 7px);
  top: calc(12% - 7px);
  z-index: 1;
  background: rgba(56, 189, 248, 0.18);
  border: 1px solid #ffffff;
  border-radius: 0 16px 0 0;
  box-sizing: border-box;
}
@media (min-width: 1024px) {
  .cfc-datacat-plate { right: calc(24% - 8px); top: calc(12% - 8px); }
}

.cfc-datacat-card {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 22%;
  top: 12%;
  z-index: 2;
  background: #ffffff;
  border-radius: 0 12px 0 0;
  overflow: hidden;
  box-sizing: border-box;
  /* The card's right edge dissolves into the cream/white gap between
     it and the text column on its right. Solid from 0–75% of the card
     width, fading to transparent at 100%. */
  -webkit-mask-image: linear-gradient(to right, #000 0%, #000 75%, transparent 100%);
  mask-image: linear-gradient(to right, #000 0%, #000 75%, transparent 100%);
}
@media (min-width: 1024px) {
  .cfc-datacat-card { right: 24%; top: 12%; }
}

/* Image scales up to fill the card. object-position: top right anchors
   it to the card's top-right corner — matches the card's rounded
   top-right corner. */
.cfc-datacat-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top right;
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
      {/* Map background — sibling of the card (not parent), so the bg
          div's bounding box can be inset (e.g. stop short of the text
          column on the left) without shifting the card. */}
      <div className="cfc-mapchat-bg" aria-hidden />
      <div className="cfc-mapchat-card" aria-hidden>
        <div className="cfc-mapchat-msg-user">
          Find 2,500–4,000 sqm parcels in Madrid near dense luxury retail with
          office vacancy under 8%. Mixed-use: ground-floor retail, 4 floors office,
          6 floors branded residences.
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
            <div className="cfc-mapchat-substatus">Mapping luxury retail density across Salamanca and Chamberí</div>
            <div className="cfc-mapchat-substatus">Cross-referencing Q1 2026 office vacancy by district</div>
            <div className="cfc-mapchat-substatus">Filtering parcels with mixed-use zoning and 10-floor allowance</div>
            <div className="cfc-mapchat-substatus">Modeling branded residence demand near Castellana</div>
          </div>
        </div>
        <div className="cfc-mapchat-input">
          <p className="cfc-mapchat-input-text">
            Now filter to parcels under €12,000/sqm within 400m of Metro Line 2 or 4.
          </p>
          <button className="cfc-mapchat-stop" type="button" aria-label="Stop">
            <span className="cfc-mapchat-stop-icon" />
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * Data Catalogue visual — product screenshot pinned to the bottom-right
 * of the visual column, with a colored plate peeking 7-8px on the top
 * and left (the OPS .pc-card-bg pattern). Right and bottom edges sit
 * flush with .pc-visual's edges.
 */
function DataCatalogueVisual() {
  return (
    <>
      {/* Same map background + left-fading white wash as Map Chat row
          above. Renders behind .cfc-datacat-plate (z-index: 1) and
          .cfc-datacat-card (z-index: 2). */}
      <div className="cfc-datacat-bg" aria-hidden />
      <div className="cfc-datacat-plate" aria-hidden />
      <div className="cfc-datacat-card" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/dataCataSm.png"
          alt=""
          className="cfc-datacat-img"
        />
      </div>
    </>
  );
}

/**
 * Placeholder skeleton mock for Site Selection — kept as-is until that
 * feature gets its own visual treatment.
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
                    className={`cfc-row${
                      f.key === "map-chat"
                        ? " cfc-row--mapchat"
                        : f.key === "data-catalogue"
                        ? " cfc-row--datacat"
                        : ""
                    }`}
                    variant="split"
                    name={f.name}
                    desc={f.desc}
                    href="#"
                    linkText="Learn more →"
                    glow={COLUMBUS_GLOW}
                    {...(f.key === "map-chat"
                      ? { visual: <MapChatVisual /> }
                      : f.key === "data-catalogue"
                      ? { visual: <DataCatalogueVisual /> }
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
