"use client"; // only needed on Next.js App Router; harmless / ignored elsewhere

/**
 * "We're all about maps" section — standalone (no Tailwind, no theme tokens, no UI lib).
 * Styles are inlined in a scoped <style> block; class names are prefixed `ops-`.
 * Only dependency: React 18+.
 *
 * Layout:
 *   - centred "We're all about maps" <h2> (bold)
 *   - a 3-column blueprint grid (hairline cells, empty rows above & below)
 *   - each large cell: a soft blue radial glow emanating from the bottom-right
 *     (the layered radial gradient from laraX.html's hero, repositioned), the
 *     product name / one-line description / "Learn more" pinned top-left, and a
 *     white card pinned to the bottom-right (top-left corner rounded 12px, the
 *     other corners square so its right & bottom edges sit flush with the cell)
 *     containing a placeholder UI skeleton.
 *
 * Colours/fonts:
 *   ink #0B1B2B · muted #6F7790 · brand #183FD9 · gridline #E7E7F1 · glow rgb(125,211,252) ("#7dd3fc")
 *   sans "PP Neue Montreal" → Arial · mono "PP Neue Montreal Mono" → system mono (neither bundled)
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Product {
  name: string;
  desc: string;
  href: string;
  logo: string;
  /** Optional CSS filter applied to the logo (Columbus reuses the navbar
   *  recolor filter so the brand mark renders in the same navy blue). */
  logoFilter?: string;
}

// Columbus uses the same recolour filter as MistxNav so the mark reads
// as the same navy-blue brand colour the navbar shows.
const COLUMBUS_LOGO_FILTER =
  "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)";

const PRODUCTS: Product[] = [
  {
    name: "Columbus",
    desc: "An agentic GIS platform for professionals",
    href: "#",
    logo: "/logobueno.png",
    logoFilter: COLUMBUS_LOGO_FILTER,
  },
  {
    name: "Elio",
    desc: "Smart and social maps",
    href: "#",
    logo: "/MapsGPT-logo.png",
  },
  {
    name: "Research",
    desc: "Our jurney to the Large Geospacial Model",
    href: "#",
    logo: "/TechnologyPageImages/lgm-globe-icon.png",
  },
];

const CSS = `
.ops-section {
  --ops-surface: #ffffff;
  --ops-ink: #0B1B2B;
  --ops-muted: #6F7790;
  --ops-brand: #183FD9;
  --ops-gridline: #E7E7F1;
  --ops-skel: #F0F1F4;
  --ops-sans: "Ppneuemontreal", "PP Neue Montreal", Arial, "Helvetica Neue", Helvetica, ui-sans-serif, system-ui, sans-serif;
  --ops-mono: "Ppneuemontrealmono", "PP Neue Montreal Mono", ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Courier New", monospace;

  background: var(--ops-surface);
  color: var(--ops-ink);
  font-family: var(--ops-sans);
  -webkit-font-smoothing: antialiased;
  padding-top: 96px;
  padding-bottom: 72px;
}
@media (min-width: 1024px) {
  .ops-section { padding-top: 136px; padding-bottom: 96px; }
}

.ops-container {
  /* match ColumbusPage's content bounds (its sections use max-w-[1287px] mx-5 md:mx-auto) */
  max-width: 1287px;
  margin-left: 20px;
  margin-right: 20px;
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .ops-container { margin-left: auto; margin-right: auto; }
}

/* heading — centred, regular weight (same as before) */
.ops-title {
  margin: 0 auto;
  max-width: 32rem;
  text-align: center;
  font-size: 32px;
  line-height: 1.08;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--ops-ink);
}
@media (min-width: 768px) { .ops-title { font-size: 42px; } }

/* scroll reveal */
.ops-reveal {
  transition: transform 700ms ease-out, opacity 700ms ease-out;
  will-change: transform, opacity;
}
.ops-reveal[data-shown="false"] { transform: translateY(24px); opacity: 0; }
.ops-reveal[data-shown="true"]  { transform: none; opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .ops-reveal { transition: none; transform: none; opacity: 1; }
}

.ops-gridwrap { margin-top: 28px; }

/* 3-column blueprint grid */
.ops-grid {
  position: relative;
  width: 100%;
  margin-inline: auto;
  border-left: 1px solid var(--ops-gridline);
}
.ops-grid-inner { display: grid; grid-template-columns: 1fr; }
@media (min-width: 640px)  { .ops-grid-inner { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .ops-grid-inner { grid-template-columns: 1fr 1fr 1fr; } }

.ops-cell,
.ops-filler {
  border-bottom: 1px solid var(--ops-gridline);
  border-right: 1px solid var(--ops-gridline);
}
.ops-filler { display: none; min-height: 64px; }
@media (min-width: 640px) { .ops-filler { display: block; } }

/* a large product cell — blue glow from the bottom-right (laraX hero gradient, repositioned) */
.ops-cell {
  position: relative;
  overflow: hidden;
  min-height: 340px;
  background-color: #ffffff;
  /* soft sky-blue glow emanating from the bottom-right corner — the layered
     radial gradient from laraX.html's hero (rgb 125,211,252 / "#7dd3fc"),
     enlarged and re-anchored to 100% 100% so it clearly reads as bottom-right */
  background-image:
    radial-gradient(200% 135% at 100% 100%, rgba(125, 211, 252, 0.28), rgba(125, 211, 252, 0.10) 48%, transparent 76%),
    radial-gradient(115% 68% at 100% 100%, rgba(125, 211, 252, 0.42), transparent 58%);
}
@media (min-width: 640px)  { .ops-cell { min-height: 420px; } }
@media (min-width: 1024px) { .ops-cell { min-height: 480px; } }

/* white fades so the hairlines dissolve into the section bg */
.ops-fade { pointer-events: none; position: absolute; left: -1px; right: -1px; height: 70px; z-index: 3; }
.ops-fade--top    { top: 0;    background-image: linear-gradient(#fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }
.ops-fade--bottom { bottom: 0; background-image: linear-gradient(to top, #fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }

/* top-left text block */
.ops-cell-head {
  position: absolute;
  top: 0; left: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 28px;
  box-sizing: border-box;
}
@media (min-width: 1024px) { .ops-cell-head { padding: 36px; } }
/* title row — product logo on the left, name on the right; weight 400
   to match the .ops-title heading "We're all about maps" */
.ops-cell-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.ops-cell-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex: 0 0 auto;
  display: block;
}
@media (min-width: 1024px) { .ops-cell-logo { width: 36px; height: 36px; } }
.ops-cell-name { margin: 0; font-size: 24px; line-height: 1.15; font-weight: 400; letter-spacing: -0.01em; color: var(--ops-ink); }
@media (min-width: 1024px) { .ops-cell-name { font-size: 28px; } }
.ops-cell-desc { margin: 16px 0 0; font-size: 16px; line-height: 1.4; color: var(--ops-ink); }
@media (min-width: 1024px) { .ops-cell-desc { font-size: 18px; } }
.ops-cell-link {
  margin-top: 18px;
  font-family: var(--ops-mono);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--ops-brand);
  text-decoration: none;
}
.ops-cell-link:hover { text-decoration: underline; }

/* sky-blue plate behind the white card — peeks out along the card's top & left
   edges (a "border-like" sliver), with a 1px white outer border */
.ops-card-bg {
  position: absolute;
  right: 0; bottom: 0;
  left: calc(22% - 7px); top: calc(44% - 7px);
  z-index: 1;
  background: rgba(125, 211, 252, 0.275);
  border: 1px solid #ffffff;
  border-radius: 16px 0 0 0;
  box-sizing: border-box;
}
@media (min-width: 1024px) { .ops-card-bg { left: calc(24% - 8px); top: calc(46% - 8px); } }

/* white card pinned bottom-right: top-left corner rounded, right & bottom flush */
.ops-card {
  position: absolute;
  right: 0; bottom: 0;
  left: 22%; top: 44%;
  z-index: 2;
  background: #ffffff;
  border-radius: 12px 0 0 0;
  overflow: hidden;
  display: flex;
  gap: 16px;
  padding: 22px;
  box-sizing: border-box;
}
@media (min-width: 1024px) { .ops-card { padding: 26px; gap: 20px; left: 24%; top: 46%; } }
.ops-skel-sq { flex: 0 0 36%; align-self: stretch; border-radius: 8px; background: var(--ops-skel); }
.ops-skel-lines { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 11px; }
@media (min-width: 1024px) { .ops-skel-lines { gap: 13px; } }
.ops-skel-line { height: 12px; border-radius: 4px; background: var(--ops-skel); }
.ops-skel-line:last-child { width: 58%; }
`;

function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Reading an external system (matchMedia) to decide initial state — intentional.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`ops-reveal ${className}`} data-shown={shown}>
      {children}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="ops-card" aria-hidden>
      <div className="ops-skel-sq" />
      <div className="ops-skel-lines">
        <div className="ops-skel-line" />
        <div className="ops-skel-line" />
        <div className="ops-skel-line" />
        <div className="ops-skel-line" />
        <div className="ops-skel-line" />
        <div className="ops-skel-line" />
      </div>
    </div>
  );
}

export default function OurProductsSection() {
  return (
    <section id="products" className="ops-section">
      <style>{CSS}</style>
      <div className="ops-container">
        <Reveal>
          <h2 className="ops-title">We&rsquo;re all about maps</h2>
        </Reveal>

        <Reveal className="ops-gridwrap">
          <div className="ops-grid">
            <div className="ops-grid-inner">
              {/* empty hairline row above */}
              <div className="ops-filler" aria-hidden />
              <div className="ops-filler" aria-hidden />
              <div className="ops-filler" aria-hidden />

              {PRODUCTS.map((p) => (
                <div className="ops-cell" key={p.name}>
                  <div className="ops-cell-head">
                    <div className="ops-cell-title">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.logo}
                        alt=""
                        aria-hidden
                        className="ops-cell-logo"
                        style={p.logoFilter ? { filter: p.logoFilter } : undefined}
                      />
                      <h3 className="ops-cell-name">{p.name}</h3>
                    </div>
                    <p className="ops-cell-desc">{p.desc}</p>
                    <a className="ops-cell-link" href={p.href}>
                      Learn more
                    </a>
                  </div>
                  <div className="ops-card-bg" aria-hidden />
                  <SkeletonCard />
                </div>
              ))}

              {/* empty hairline row below */}
              <div className="ops-filler" aria-hidden />
              <div className="ops-filler" aria-hidden />
              <div className="ops-filler" aria-hidden />
            </div>

            <div className="ops-fade ops-fade--top" aria-hidden />
            <div className="ops-fade ops-fade--bottom" aria-hidden />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
