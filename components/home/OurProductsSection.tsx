"use client";

/**
 * "We're all about maps" section.
 *
 * Typography + rhythm follow the catcherX design system
 * (design-system/design-system.md): the `.section` vertical rhythm,
 * `.container-site` content cap, `SectionHeading` block, ink/muted/brand
 * colour tokens, and the Products-card title scale (`text-2xl
 * font-semibold`). The blueprint-grid hairlines, soft-blue radial glow,
 * and pinned bottom-right skeleton card are this section's bespoke
 * visual — only the typography and spacing primitives come from the
 * system.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { SectionHeading } from "@/components/SectionHeading";

interface Product {
  name: string;
  desc: string;
  href: string;
}

const PRODUCTS: Product[] = [
  { name: "Columbus", desc: "The agentic GIS product", href: "#" },
  { name: "Elio", desc: "The consumer product", href: "#" },
  { name: "Research", desc: "Check out our research", href: "#" },
];

// Visual treatment scoped to this section only — the blueprint grid,
// hairline fades, radial glow, and pinned skeleton card. Typography
// + section padding come from the catcherX design-system classes.
const CSS = `
.ops-reveal {
  transition: transform 700ms ease-out, opacity 700ms ease-out;
  will-change: transform, opacity;
}
.ops-reveal[data-shown="false"] { transform: translateY(24px); opacity: 0; }
.ops-reveal[data-shown="true"]  { transform: none; opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .ops-reveal { transition: none; transform: none; opacity: 1; }
}

.ops-gridwrap { margin-top: 48px; }
@media (min-width: 1024px) { .ops-gridwrap { margin-top: 64px; } }

.ops-grid {
  position: relative;
  width: 100%;
  margin-inline: auto;
  border-left: 1px solid var(--color-gridline);
}
.ops-grid-inner { display: grid; grid-template-columns: 1fr; }
@media (min-width: 640px)  { .ops-grid-inner { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .ops-grid-inner { grid-template-columns: 1fr 1fr 1fr; } }

.ops-cell,
.ops-filler {
  border-bottom: 1px solid var(--color-gridline);
  border-right: 1px solid var(--color-gridline);
}
.ops-filler { display: none; min-height: 64px; }
@media (min-width: 640px) { .ops-filler { display: block; } }

.ops-cell {
  position: relative;
  overflow: hidden;
  min-height: 340px;
  background-color: #ffffff;
  background-image:
    radial-gradient(200% 135% at 100% 100%, rgba(125, 211, 252, 0.28), rgba(125, 211, 252, 0.10) 48%, transparent 76%),
    radial-gradient(115% 68% at 100% 100%, rgba(125, 211, 252, 0.42), transparent 58%);
}
@media (min-width: 640px)  { .ops-cell { min-height: 420px; } }
@media (min-width: 1024px) { .ops-cell { min-height: 480px; } }

.ops-fade { pointer-events: none; position: absolute; left: -1px; right: -1px; height: 70px; z-index: 3; }
.ops-fade--top    { top: 0;    background-image: linear-gradient(#fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }
.ops-fade--bottom { bottom: 0; background-image: linear-gradient(to top, #fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }

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
.ops-skel-sq { flex: 0 0 36%; align-self: stretch; border-radius: 8px; background: #F0F1F4; }
.ops-skel-lines { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 11px; }
@media (min-width: 1024px) { .ops-skel-lines { gap: 13px; } }
.ops-skel-line { height: 12px; border-radius: 4px; background: #F0F1F4; }
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
    <section id="products" className="section bg-white text-ink">
      <style>{CSS}</style>
      <div className="container-site">
        <Reveal>
          <SectionHeading centered title="We’re all about maps" />
        </Reveal>

        <Reveal className="ops-gridwrap">
          <div className="ops-grid">
            <div className="ops-grid-inner">
              <div className="ops-filler" aria-hidden />
              <div className="ops-filler" aria-hidden />
              <div className="ops-filler" aria-hidden />

              {PRODUCTS.map((p) => (
                <div className="ops-cell" key={p.name}>
                  <div className="ops-cell-head">
                    <h3 className="text-2xl font-semibold leading-snug text-ink">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-base text-muted">{p.desc}</p>
                    <a
                      className="mt-4 text-sm font-semibold text-brand hover:underline"
                      href={p.href}
                    >
                      Learn more →
                    </a>
                  </div>
                  <div className="ops-card-bg" aria-hidden />
                  <SkeletonCard />
                </div>
              ))}

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
