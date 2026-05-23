"use client";

/**
 * Elio features — mirrors ColumbusFeatureCell's hairline-grid wrapper
 * with three split-variant ProductCell rows. Sky-400 glow throughout
 * (same colour as the Columbus rows) so the visual palette stays unified.
 *
 * Three rows from Mistx-Elio's tabbed feature section (Roll the Dice
 * dropped per the approved plan):
 *   - Ranked Spots      → ranked-list mock
 *   - Shared Itineraries → pin-route mock
 *   - Search by Character → search-bar + keyword-chips mock
 *
 * Mocks follow ColumbusFeatureCell's abstract-skeleton aesthetic:
 * greyscale `#F0F1F4` / `#E7E9EF` blocks with one brand-blue accent each.
 */

import { ProductCell } from "@/components/home/ProductCell";

interface Feature {
  key: string;
  name: string;
  desc: string;
  mock: "ranked" | "itinerary" | "search";
}

// Same sky-400 glow used by the Columbus cells (#38BDF8).
const ELIO_GLOW = "56, 189, 248";

const FEATURES: Feature[] = [
  {
    key: "ranked-spots",
    name: "Ranked spots, curated for you.",
    desc:
      "Every place ranked by the things that actually matter — vibe, crowd, value, the time of day. The best of any city, ordered the way locals would.",
    mock: "ranked",
  },
  {
    key: "shared-itineraries",
    name: "Itineraries you build together.",
    desc:
      "Invite your crew, drop pins, swap notes. A shared trip plan that updates in real time — without the group-chat chaos.",
    mock: "itinerary",
  },
  {
    key: "search-character",
    name: "Find a place that matches your mood.",
    desc:
      'Search by character, not category. Tell Elio you want "quiet, candle-lit, walking distance" and you\'ll get a shortlist that actually fits.',
    mock: "search",
  },
];

const CSS = `
.efc-container {
  max-width: 1287px;
  margin-left: 20px;
  margin-right: 20px;
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .efc-container { margin-left: auto; margin-right: auto; }
}

.efc-grid {
  position: relative;
  width: 100%;
  margin-inline: auto;
  border-left: 1px solid var(--color-gridline);
}
.efc-grid-inner { display: grid; grid-template-columns: 1fr; }

.efc-cell,
.efc-filler {
  border-bottom: 1px solid var(--color-gridline);
  border-right: 1px solid var(--color-gridline);
}
.efc-filler { display: none; min-height: 64px; }
@media (min-width: 640px) { .efc-filler { display: block; } }

.efc-cell {
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
}

.efc-fade { pointer-events: none; position: absolute; left: -1px; right: -1px; height: 70px; z-index: 4; }
.efc-fade--top    { top: 0;    background-image: linear-gradient(#fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }
.efc-fade--bottom { bottom: 0; background-image: linear-gradient(to top, #fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }

.efc-rows { display: flex; flex-direction: column; }
.efc-row:not(:first-of-type) {
  border-top: 1px solid var(--color-gridline);
}

/* ── mock: Ranked Spots (numbered list with score chips) ────────────── */
.efc-mock-ranked {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  justify-content: center;
}
.efc-mock-ranked .efc-rank-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.efc-mock-ranked .efc-rank-num {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.18);
  flex: 0 0 auto;
}
.efc-mock-ranked .efc-rank-name {
  height: 10px;
  border-radius: 4px;
  background: #F0F1F4;
}
.efc-mock-ranked .efc-rank-row:nth-child(1) .efc-rank-name { flex: 0 0 68%; }
.efc-mock-ranked .efc-rank-row:nth-child(2) .efc-rank-name { flex: 0 0 82%; }
.efc-mock-ranked .efc-rank-row:nth-child(3) .efc-rank-name { flex: 0 0 58%; }
.efc-mock-ranked .efc-rank-row:nth-child(4) .efc-rank-name { flex: 0 0 74%; }
.efc-mock-ranked .efc-rank-row:nth-child(5) .efc-rank-name { flex: 0 0 50%; }
.efc-mock-ranked .efc-rank-score {
  width: 28px;
  height: 12px;
  border-radius: 4px;
  background: #E7E9EF;
  flex: 0 0 auto;
  margin-left: auto;
}

/* ── mock: Shared Itineraries (pin column + dotted route + stops) ───── */
.efc-mock-itinerary {
  display: flex;
  align-items: stretch;
  gap: 18px;
  height: 100%;
}
.efc-mock-itinerary .efc-pin-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 0;
}
.efc-mock-itinerary .efc-pin {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.22);
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.5);
  flex: 0 0 auto;
}
.efc-mock-itinerary .efc-pin-route {
  flex: 1;
  width: 2px;
  background-image: linear-gradient(to bottom, rgba(56, 189, 248, 0.5) 50%, transparent 50%);
  background-size: 2px 6px;
  min-height: 14px;
}
.efc-mock-itinerary .efc-stop-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 4px 0;
  gap: 8px;
}
.efc-mock-itinerary .efc-stop-line {
  height: 10px;
  border-radius: 4px;
  background: #F0F1F4;
}
.efc-mock-itinerary .efc-stop-line:nth-child(1) { width: 68%; }
.efc-mock-itinerary .efc-stop-line:nth-child(2) { width: 84%; }
.efc-mock-itinerary .efc-stop-line:nth-child(3) { width: 56%; }
.efc-mock-itinerary .efc-stop-line:nth-child(4) { width: 72%; }

/* ── mock: Search by Character (search bar + keyword chips) ─────────── */
.efc-mock-search {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  justify-content: center;
}
.efc-mock-search .efc-searchbar {
  height: 36px;
  border-radius: 8px;
  background: #F0F1F4;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 10px;
}
.efc-mock-search .efc-search-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #E7E9EF;
  flex: 0 0 auto;
}
.efc-mock-search .efc-search-text {
  flex: 1;
  height: 10px;
  border-radius: 4px;
  background: #E7E9EF;
  max-width: 60%;
}
.efc-mock-search .efc-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.efc-mock-search .efc-chip {
  height: 22px;
  border-radius: 999px;
  background: #F0F1F4;
}
.efc-mock-search .efc-chip:nth-child(1) { width: 70px; }
.efc-mock-search .efc-chip:nth-child(2) { width: 88px; }
.efc-mock-search .efc-chip:nth-child(3) { width: 60px; background: rgba(56, 189, 248, 0.16); }
.efc-mock-search .efc-chip:nth-child(4) { width: 92px; }
`;

function Mock({ kind }: { kind: Feature["mock"] }) {
  if (kind === "ranked") {
    return (
      <div className="efc-mock-ranked" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <div className="efc-rank-row" key={i}>
            <div className="efc-rank-num" />
            <div className="efc-rank-name" />
            <div className="efc-rank-score" />
          </div>
        ))}
      </div>
    );
  }
  if (kind === "itinerary") {
    return (
      <div className="efc-mock-itinerary" aria-hidden>
        <div className="efc-pin-col">
          <div className="efc-pin" />
          <div className="efc-pin-route" />
          <div className="efc-pin" />
          <div className="efc-pin-route" />
          <div className="efc-pin" />
          <div className="efc-pin-route" />
          <div className="efc-pin" />
        </div>
        <div className="efc-stop-list">
          <div className="efc-stop-line" />
          <div className="efc-stop-line" />
          <div className="efc-stop-line" />
          <div className="efc-stop-line" />
        </div>
      </div>
    );
  }
  // search
  return (
    <div className="efc-mock-search" aria-hidden>
      <div className="efc-searchbar">
        <div className="efc-search-dot" />
        <div className="efc-search-text" />
      </div>
      <div className="efc-chips">
        <div className="efc-chip" />
        <div className="efc-chip" />
        <div className="efc-chip" />
        <div className="efc-chip" />
      </div>
    </div>
  );
}

export function ElioFeatureCell() {
  return (
    <section className="section">
      <style>{CSS}</style>
      <div className="efc-container">
        <div className="efc-grid">
          <div className="efc-grid-inner">
            <div className="efc-filler" aria-hidden />

            <div className="efc-cell">
              <div className="efc-rows">
                {FEATURES.map((f) => (
                  <ProductCell
                    key={f.key}
                    className="efc-row"
                    variant="split"
                    name={f.name}
                    desc={f.desc}
                    href="#"
                    linkText="Learn more →"
                    glow={ELIO_GLOW}
                    card={<Mock kind={f.mock} />}
                  />
                ))}
              </div>
            </div>

            <div className="efc-filler" aria-hidden />
          </div>

          <div className="efc-fade efc-fade--top" aria-hidden />
          <div className="efc-fade efc-fade--bottom" aria-hidden />
        </div>
      </div>
    </section>
  );
}

export default ElioFeatureCell;
