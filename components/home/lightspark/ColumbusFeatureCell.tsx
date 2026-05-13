"use client";

/**
 * Columbus features cell — non-sticky, per-feature visuals.
 *
 * Three feature rows stacked inside a single cell. Each row pairs:
 *   - Left half: feature name + lorem-ipsum description + "Learn more"
 *   - Right half: a per-feature radial-glow panel with a *unique*
 *     skeleton mock that hints at what the feature does (chat-bubble
 *     pattern for Map Chat; list/table pattern for Data Digestion;
 *     parcel grid for Site Selection and Audits).
 *
 * No sticky-scroll, no IntersectionObserver, no activeIdx. Each row
 * is self-contained — it owns its glow colour and its visual mock at
 * all times. Rows are separated by a hairline divider so they read
 * as the same "panel family" as the three cells under "We're all
 * about maps".
 *
 * Wrapper preserved from earlier variants:
 *   .cfc-grid with `border-left` + .cfc-filler rows above and below +
 *   top/bottom fade overlays — so the vertical hairlines still extend
 *   past the cell and dissolve into the page surface.
 *
 * Per-feature glow colours are pastel rainbow at Tailwind ~300
 * lightness — same family as the sky-blue default on the 3-up cells.
 */

interface Feature {
  key: string;
  name: string;
  desc: string;
  /** rgb triplet (no `rgba()` wrap) — drives the row's radial-glow
   *  layer and the plate behind the white skeleton card. */
  glow: string;
  mock: "mapchat" | "data" | "site";
}

const FEATURES: Feature[] = [
  {
    key: "map-chat",
    name: "Map Chat",
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    glow: "253, 164, 175", // rose-300
    mock: "mapchat",
  },
  {
    key: "data-digestion",
    name: "Data Digestion",
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    glow: "252, 211, 77", // amber-300
    mock: "data",
  },
  {
    key: "site-selection",
    name: "Site Selection and Audits",
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    glow: "196, 181, 253", // violet-300
    mock: "site",
  },
];

const CSS = `
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
.cfc-filler { display: none; min-height: 64px; }
@media (min-width: 640px) { .cfc-filler { display: block; } }

.cfc-cell {
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
}

.cfc-fade { pointer-events: none; position: absolute; left: -1px; right: -1px; height: 70px; z-index: 4; }
.cfc-fade--top    { top: 0;    background-image: linear-gradient(#fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }
.cfc-fade--bottom { bottom: 0; background-image: linear-gradient(to top, #fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }

/* ── feature rows ─────────────────────────────────────────────────── */

.cfc-rows { display: flex; flex-direction: column; }

.cfc-row {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 440px;
}
.cfc-row + .cfc-row {
  border-top: 1px solid var(--color-gridline);
}
@media (min-width: 768px) {
  .cfc-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    min-height: 480px;
  }
}
@media (min-width: 1024px) {
  .cfc-row { min-height: 560px; }
}

/* left half — text */
.cfc-row-left {
  position: relative;
  z-index: 2;
  padding: 48px 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
@media (min-width: 768px) {
  .cfc-row-left { padding: 64px 36px; }
}
@media (min-width: 1024px) {
  .cfc-row-left { padding: 88px 44px; }
}

.cfc-row-name {
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--color-ink);
}
@media (min-width: 1024px) { .cfc-row-name { font-size: 32px; } }

.cfc-row-desc {
  margin: 16px 0 0;
  max-width: 36rem;
  font-size: 17px;
  line-height: 1.5;
  color: var(--color-muted);
}
@media (min-width: 1024px) { .cfc-row-desc { font-size: 19px; } }

.cfc-row-link {
  margin-top: 24px;
  align-self: flex-start;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-brand);
  text-decoration: none;
}
.cfc-row-link:hover { text-decoration: underline; }

/* right half — visual canvas with the row's glow + mock */
.cfc-row-visual {
  position: relative;
  overflow: hidden;
  min-height: 320px;
  /* radial glow set inline per-row */
}
@media (min-width: 768px) {
  .cfc-row-visual { min-height: 0; }
}

/* sky-blue plate behind the white card */
.cfc-card-bg {
  position: absolute;
  right: 24px;
  bottom: 24px;
  left: 24px;
  top: calc(20% - 7px);
  z-index: 1;
  border: 1px solid #ffffff;
  border-radius: 16px 0 0 0;
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .cfc-card-bg { right: 36px; bottom: 36px; left: 36px; top: calc(28% - 7px); }
}
@media (min-width: 1024px) {
  .cfc-card-bg { right: 44px; bottom: 44px; left: 44px; top: calc(26% - 8px); }
}

/* white card with skeleton mock — pinned bottom of right column */
.cfc-card {
  position: absolute;
  right: 24px;
  bottom: 24px;
  left: 24px;
  top: 20%;
  z-index: 2;
  background: #ffffff;
  border-radius: 12px 0 0 0;
  overflow: hidden;
  padding: 22px;
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .cfc-card { right: 36px; bottom: 36px; left: 36px; top: 28%; padding: 24px; }
}
@media (min-width: 1024px) {
  .cfc-card { right: 44px; bottom: 44px; left: 44px; top: 26%; padding: 28px; }
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
/* a couple of cells get a stronger highlight, hinting "selected parcels" */
.cfc-mock-site .cfc-site-cell:nth-child(2),
.cfc-mock-site .cfc-site-cell:nth-child(6) {
  background: #E7E9EF;
  outline: 1.5px solid var(--color-brand);
  outline-offset: -1.5px;
}
.cfc-mock-site .cfc-site-cell:nth-child(8) {
  background: rgba(20, 81, 232, 0.10); /* brand at 10% */
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
  // default: mapchat
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
      <div className="container-site">
        <div className="cfc-grid">
          <div className="cfc-grid-inner">
            <div className="cfc-filler" aria-hidden />

            <div className="cfc-cell">
              <div className="cfc-rows">
                {FEATURES.map((f) => (
                  <div className="cfc-row" key={f.key}>
                    <div className="cfc-row-left">
                      <h3 className="cfc-row-name">{f.name}</h3>
                      <p className="cfc-row-desc">{f.desc}</p>
                      <a className="cfc-row-link" href="#">
                        Learn more →
                      </a>
                    </div>

                    <div
                      className="cfc-row-visual"
                      style={{
                        backgroundImage: `radial-gradient(160% 130% at 100% 100%, rgba(${f.glow}, 0.28), rgba(${f.glow}, 0.10) 48%, transparent 76%), radial-gradient(95% 65% at 100% 100%, rgba(${f.glow}, 0.42), transparent 58%)`,
                      }}
                    >
                      <div
                        className="cfc-card-bg"
                        aria-hidden
                        style={{ backgroundColor: `rgba(${f.glow}, 0.275)` }}
                      />
                      <div className="cfc-card">
                        <Mock kind={f.mock} />
                      </div>
                    </div>
                  </div>
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
