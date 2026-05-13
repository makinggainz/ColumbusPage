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

/* ── mock: Map Chat (chat bubble + text lines) ────────────────────── */
.cfc-mock-mapchat {
  display: flex;
  gap: 16px;
  height: 100%;
  align-items: center;
}
@media (min-width: 1024px) { .cfc-mock-mapchat { gap: 22px; } }
.cfc-mock-mapchat .cfc-bubble {
  flex: 0 0 36%;
  align-self: stretch;
  border-radius: 10px;
  background: #F0F1F4;
}
.cfc-mock-mapchat .cfc-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 11px;
}
@media (min-width: 1024px) { .cfc-mock-mapchat .cfc-lines { gap: 13px; } }
.cfc-mock-mapchat .cfc-line {
  height: 12px;
  border-radius: 4px;
  background: #F0F1F4;
}
.cfc-mock-mapchat .cfc-line:nth-child(2) { width: 92%; }
.cfc-mock-mapchat .cfc-line:nth-child(3) { width: 82%; }
.cfc-mock-mapchat .cfc-line:nth-child(4) { width: 76%; }
.cfc-mock-mapchat .cfc-line:nth-child(5) { width: 64%; }
.cfc-mock-mapchat .cfc-line:last-child { width: 46%; }

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

function Mock({ kind }: { kind: Feature["mock"] }) {
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
  if (kind === "site") {
    return (
      <div className="cfc-mock-site" aria-hidden>
        {Array.from({ length: 9 }).map((_, i) => (
          <div className="cfc-site-cell" key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="cfc-mock-mapchat" aria-hidden>
      <div className="cfc-bubble" />
      <div className="cfc-lines">
        <div className="cfc-line" />
        <div className="cfc-line" />
        <div className="cfc-line" />
        <div className="cfc-line" />
        <div className="cfc-line" />
        <div className="cfc-line" />
      </div>
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
                    card={<Mock kind={f.mock} />}
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
