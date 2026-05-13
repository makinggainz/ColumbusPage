"use client";

/**
 * Full-width Columbus product cell. Single-cell variant of the three
 * cells under "We're all about maps" (`components/home/OurProductsSection.tsx`).
 *
 * Structure mirrors that section exactly so the two read as
 * siblings:
 *
 *   .cfc-grid         (wrapper, border-left only)
 *     .cfc-grid-inner (CSS grid, single column)
 *       .cfc-filler   (empty hairline row above — border-bottom + border-right)
 *       .cfc-cell     (actual content — border-bottom + border-right)
 *       .cfc-filler   (empty hairline row below)
 *     .cfc-fade--top    (absolute overlay, dissolves the top gridlines)
 *     .cfc-fade--bottom (absolute overlay, dissolves the bottom gridlines)
 *
 * The vertical hairlines (left edge of .cfc-grid; right edge of the
 * cells/fillers via their border-right) extend through the filler
 * rows and fade into the page surface at the top and bottom — same
 * trick OurProductsSection uses.
 *
 * Differs from the 3-up cells:
 *   - Spans the full `.container-site` content bounds (1200px max).
 *   - Card-bg / skeleton card occupy the right ~half of the cell
 *     (instead of ~78%) — proportional adjustment for the wider
 *     canvas.
 *   - Slightly taller cell on lg (520 vs 480) so the wider canvas
 *     reads as a deliberate hero.
 */

import Image from "next/image";

const COLUMBUS_LOGO_FILTER =
  "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)";

const CSS = `
/* wrapper — supplies the left vertical hairline; cells supply right */
.cfc-grid {
  position: relative;
  width: 100%;
  margin-inline: auto;
  border-left: 1px solid var(--color-gridline);
}
.cfc-grid-inner { display: grid; grid-template-columns: 1fr; }

/* both fillers and the cell carry the right + bottom hairlines so
   the gridlines extend continuously top-to-bottom through the
   wrapper, just like .ops-cell / .ops-filler */
.cfc-cell,
.cfc-filler {
  border-bottom: 1px solid var(--color-gridline);
  border-right: 1px solid var(--color-gridline);
}
.cfc-filler { display: none; min-height: 64px; }
@media (min-width: 640px) { .cfc-filler { display: block; } }

/* actual content cell — soft sky-blue glow from the bottom-right,
   same gradient recipe as the 3-up cells (anchored at 100% 100% so
   it reads as bottom-right rather than centred) */
.cfc-cell {
  position: relative;
  overflow: hidden;
  min-height: 360px;
  background-color: #ffffff;
  background-image:
    radial-gradient(160% 130% at 100% 100%, rgba(125, 211, 252, 0.28), rgba(125, 211, 252, 0.10) 48%, transparent 76%),
    radial-gradient(95% 65% at 100% 100%, rgba(125, 211, 252, 0.42), transparent 58%);
}
@media (min-width: 640px) { .cfc-cell { min-height: 440px; } }
@media (min-width: 1024px) { .cfc-cell { min-height: 520px; } }

/* white fades top + bottom of the wrapper — cover the filler rows
   and dissolve the gridlines into the page surface */
.cfc-fade { pointer-events: none; position: absolute; left: -1px; right: -1px; height: 70px; z-index: 3; }
.cfc-fade--top    { top: 0;    background-image: linear-gradient(#fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }
.cfc-fade--bottom { bottom: 0; background-image: linear-gradient(to top, #fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }

/* text head — top-left, max ~half width so it doesn't run under the card */
.cfc-head {
  position: absolute;
  top: 0; left: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 28px;
  max-width: 90%;
  box-sizing: border-box;
}
@media (min-width: 768px) { .cfc-head { padding: 36px; max-width: 48%; } }
@media (min-width: 1024px) { .cfc-head { padding: 44px; } }

.cfc-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.cfc-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  flex: 0 0 auto;
  display: block;
}
@media (min-width: 1024px) { .cfc-logo { width: 40px; height: 40px; } }

.cfc-name {
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--color-ink);
}
@media (min-width: 1024px) { .cfc-name { font-size: 32px; } }

.cfc-desc {
  margin: 16px 0 0;
  font-size: 17px;
  line-height: 1.45;
  color: var(--color-ink);
}
@media (min-width: 1024px) { .cfc-desc { font-size: 19px; } }

.cfc-link {
  margin-top: 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-brand);
  text-decoration: none;
  transition: opacity 150ms ease;
}
.cfc-link:hover { text-decoration: underline; }

/* sky-blue plate behind the white card — peeks 7-8px along the top
   and left edges, square right + bottom so it sits flush */
.cfc-card-bg {
  position: absolute;
  right: 0; bottom: 0;
  left: calc(50% - 7px); top: calc(38% - 7px);
  z-index: 1;
  background: rgba(125, 211, 252, 0.275);
  border: 1px solid #ffffff;
  border-radius: 16px 0 0 0;
  box-sizing: border-box;
  display: none;
}
@media (min-width: 768px) { .cfc-card-bg { display: block; left: calc(52% - 7px); top: calc(36% - 7px); } }
@media (min-width: 1024px) { .cfc-card-bg { left: calc(54% - 8px); top: calc(34% - 8px); } }

/* white card pinned bottom-right with skeleton UI mock */
.cfc-card {
  position: absolute;
  right: 0; bottom: 0;
  left: 50%; top: 38%;
  z-index: 2;
  background: #ffffff;
  border-radius: 12px 0 0 0;
  overflow: hidden;
  display: none;
  gap: 18px;
  padding: 24px;
  box-sizing: border-box;
}
@media (min-width: 768px) { .cfc-card { display: flex; left: 52%; top: 36%; } }
@media (min-width: 1024px) { .cfc-card { padding: 28px; gap: 22px; left: 54%; top: 34%; } }

.cfc-skel-sq { flex: 0 0 32%; align-self: stretch; border-radius: 10px; background: #F0F1F4; }
.cfc-skel-lines { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 12px; }
@media (min-width: 1024px) { .cfc-skel-lines { gap: 14px; } }
.cfc-skel-line { height: 12px; border-radius: 4px; background: #F0F1F4; }
.cfc-skel-line:nth-child(2) { width: 92%; }
.cfc-skel-line:nth-child(3) { width: 84%; }
.cfc-skel-line:nth-child(4) { width: 78%; }
.cfc-skel-line:nth-child(5) { width: 64%; }
.cfc-skel-line:last-child { width: 46%; }
`;

function SkeletonCard() {
  return (
    <div className="cfc-card" aria-hidden>
      <div className="cfc-skel-sq" />
      <div className="cfc-skel-lines">
        <div className="cfc-skel-line" />
        <div className="cfc-skel-line" />
        <div className="cfc-skel-line" />
        <div className="cfc-skel-line" />
        <div className="cfc-skel-line" />
        <div className="cfc-skel-line" />
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
            {/* empty hairline row above — extends the vertical
               gridlines past the cell so they can fade out */}
            <div className="cfc-filler" aria-hidden />

            <div className="cfc-cell">
              <div className="cfc-head">
                <div className="cfc-title-row">
                  <Image
                    src="/logobueno.png"
                    alt=""
                    aria-hidden
                    width={40}
                    height={40}
                    className="cfc-logo"
                    style={{ filter: COLUMBUS_LOGO_FILTER }}
                  />
                  <h3 className="cfc-name">Columbus</h3>
                </div>
                <p className="cfc-desc">
                  Try the platform built for the physical world.
                </p>
                <a className="cfc-link" href="#">
                  Learn more →
                </a>
              </div>

              <div className="cfc-card-bg" aria-hidden />
              <SkeletonCard />
            </div>

            {/* empty hairline row below */}
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
