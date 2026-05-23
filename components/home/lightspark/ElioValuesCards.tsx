"use client";

/**
 * Elio values — hairline blueprint-grid (the same structure as
 * OurProductsSection's "We're all about maps" cells) with the smaller,
 * text-only cell content used by catcherX's `<WhyBetter>` section,
 * plus a brand-blue line-icon at the top-left of each cell to mirror
 * OurProductsSection's logo placement.
 *
 * Cell sizing: 28px padding, `.h7 font-semibold` title (18px / 600)
 * over a `.p-m text-muted` body (14px). No glow, no visual card —
 * cells are content-sized so the row is much shorter than the
 * Columbus product cells.
 *
 * Grid: top filler row + cell row + bottom filler row (all hairline
 * bordered). The cells' bottom border falls in the middle of the grid,
 * so the bottom fade overlay can soften the lowermost hairline without
 * erasing the line below the cells. (catcherX's WhyBetter only renders
 * top fillers — we add bottom fillers so a horizontal line is visible
 * below the cells, per user feedback.)
 *
 * Copy verbatim from Mistx-Elio's `ElioValues.tsx`. Icons are inline
 * SVGs in the project's icon accent colour (#154ACC).
 */

type IconKind = "infinity" | "globe" | "no-entry" | "lock";

interface Value {
  title: string;
  body: string;
  icon: IconKind;
}

const VALUES: Value[] = [
  {
    title: "Free, forever.",
    body:
      "Everything Elio does is free. No premium tier, no upsell, no asterisks. Use it on day one and on day one thousand.",
    icon: "infinity",
  },
  {
    title: "By travellers, for travellers.",
    body:
      "Built by people who actually care whether the third drink list has any house cocktails. Recommendations you'd actually take.",
    icon: "globe",
  },
  {
    title: "No ads, ever.",
    body:
      "Elio doesn't rent your attention to brands. The picks you see are the picks Elio thought were best — full stop.",
    icon: "no-entry",
  },
  {
    title: "Privacy by default.",
    body:
      "Your taste, your places, your people, your trips. Yours. We don't sell, we don't share, we don't track around the web.",
    icon: "lock",
  },
];

function ValueIcon({ kind }: { kind: IconKind }) {
  const common = {
    className: "size-7 shrink-0",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (kind) {
    case "infinity":
      return (
        <svg {...common}>
          <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
        </svg>
      );
    case "no-entry":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="m4.93 4.93 14.14 14.14" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
  }
}

const CSS = `
.evc-bounds {
  max-width: 1287px;
  margin-left: 20px;
  margin-right: 20px;
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .evc-bounds { margin-left: auto; margin-right: auto; }
}

/* Blueprint grid — left hairline on the wrapper, bottom+right on every
   cell. Top + bottom filler rows (visible at lg+) sandwich the content
   row so the cells' bottom border lands in the middle of the grid
   (visible) instead of at the bottom edge (hidden by the fade). */
.evc-grid {
  position: relative;
  border-left: 1px solid var(--color-gridline);
}
.evc-grid-inner {
  display: grid;
  grid-template-columns: 1fr;
}
@media (min-width: 640px)  { .evc-grid-inner { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .evc-grid-inner { grid-template-columns: 1fr 1fr 1fr 1fr; } }

.evc-cell,
.evc-filler {
  border-bottom: 1px solid var(--color-gridline);
  border-right: 1px solid var(--color-gridline);
}
.evc-filler { display: none; min-height: 56px; }
@media (min-width: 1024px) { .evc-filler { display: block; } }

.evc-cell {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px;
  color: var(--color-ink);
  /* Blueprint-cell wash from catcherX / newscatcherapi.com: a tall
     ellipse at the top-centre that's fully transparent at the top
     and fades to near-white (#F9FAFB) at the bottom/edges — gives the
     subtle "darker-at-the-corners" look without competing with the
     hairline grid. */
  background: radial-gradient(
    77% 100% at 50% 0%,
    rgba(249, 250, 251, 0) 20%,
    #F9FAFB 100%
  );
}

.evc-icon { color: #154ACC; }

.evc-fade { pointer-events: none; position: absolute; left: -1px; right: -1px; height: 70px; z-index: 4; }
.evc-fade--top    { top: 0;    background-image: linear-gradient(#fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }
.evc-fade--bottom { bottom: 0; background-image: linear-gradient(to top, #fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }
`;

export function ElioValuesCards() {
  return (
    <section className="section">
      <style>{CSS}</style>
      <div className="evc-bounds">
        <h2 className="h2 tracking-tight text-ink text-center mb-12">
          Maps the way you wish they&rsquo;d be.
        </h2>
        <div className="evc-grid">
          <div className="evc-grid-inner">
            {/* Top filler row — only renders at lg+ (4-column layout). */}
            {[0, 1, 2, 3].map((i) => (
              <div className="evc-filler" key={`top-${i}`} aria-hidden />
            ))}
            {VALUES.map((v) => (
              <div className="evc-cell" key={v.title}>
                <span className="evc-icon">
                  <ValueIcon kind={v.icon} />
                </span>
                <h3 className="h7 font-semibold text-ink">{v.title}</h3>
                <p className="p-m text-muted">{v.body}</p>
              </div>
            ))}
            {/* Bottom filler row — only renders at lg+ so the cells'
                bottom hairline stays visible above the bottom fade. */}
            {[0, 1, 2, 3].map((i) => (
              <div className="evc-filler" key={`bot-${i}`} aria-hidden />
            ))}
          </div>
          <div className="evc-fade evc-fade--top" aria-hidden />
          <div className="evc-fade evc-fade--bottom" aria-hidden />
        </div>
      </div>
    </section>
  );
}

export default ElioValuesCards;
