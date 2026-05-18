"use client";

/**
 * ClosingCTASection — the page's closing download CTA. Mirrors the site's
 * canonical CTA banner (components/home/lightspark/ElioFinalCTA.tsx):
 * a white card with a 1px gridline border, 7px corners, and a sky-blue
 * radial glow + perspective grid rising from the bottom. Primary
 * "in browser" pill plus App Store + Google Play badges. Original
 * MapsGPT copy; styled with the site design system (Funnel Display
 * headings, Opening Hours Sans body, the catcherX colour tokens).
 */

import { useRef, useEffect, useState } from "react";
import StoreBadges from "@/components/products/StoreBadges";

function ArrowDots() {
  return (
    <svg style={{ width: 12, height: 12, flexShrink: 0 }} viewBox="0 0 9 13" fill="none" aria-hidden="true">
      <circle cx="7.22" cy="6.589" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="4.018" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="1.46" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="9.151" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="11.718" r="1.28" fill="currentColor" />
    </svg>
  );
}

const CSS = `
.mg-cta-bounds {
  max-width: 1287px;
  margin-left: 20px;
  margin-right: 20px;
  box-sizing: border-box;
}
@media (min-width: 768px) { .mg-cta-bounds { margin-left: auto; margin-right: auto; } }

.mg-cta-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-gridline, #E7E7F1);
  border-radius: 7px;
  background: #ffffff;
  padding: 64px 24px 96px;
  text-align: center;
}
@media (min-width: 768px)  { .mg-cta-card { padding: 96px 48px 132px; } }
@media (min-width: 1024px) { .mg-cta-card { padding: 116px 64px 160px; } }

/* sky-blue radial glow rising from the bottom edge */
.mg-cta-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 95% 75% at 50% 100%,
    rgba(56,189,248,0.30) 0%, rgba(56,189,248,0.14) 42%, transparent 82%);
  pointer-events: none;
  z-index: 1;
}
/* faint perspective grid sitting in the glow */
.mg-cta-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient( 45deg, rgba(56,189,248,0.18) 0 1px, transparent 1px 40px),
    repeating-linear-gradient(-45deg, rgba(56,189,248,0.18) 0 1px, transparent 1px 40px);
  -webkit-mask-image: radial-gradient(ellipse 95% 75% at 50% 100%, #000 0%, transparent 82%);
  mask-image: radial-gradient(ellipse 95% 75% at 50% 100%, #000 0%, transparent 82%);
  transform: perspective(900px) rotateX(55deg);
  transform-origin: 50% 100%;
  pointer-events: none;
  z-index: 2;
}
.mg-cta-content { position: relative; z-index: 3; max-width: 660px; margin: 0 auto; }

.mg-cta-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-cta, #0B1342);
  color: #ffffff;
  border-radius: var(--radius-button-md, 18px);
  padding: 9px 18px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: color 150ms ease;
}
.mg-cta-pill:hover { color: #154ACC; }
`;

export default function ClosingCTASection() {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="section" style={{ background: "#FFFFFF" }}>
      <style>{CSS}</style>
      <div className="mg-cta-bounds">
        <div className="mg-cta-card">
          <div
            className="mg-cta-content"
            style={{
              opacity: vis ? 1 : 0,
              transform: vis ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
            }}
          >
            <div className="eyebrow">Ready when you are</div>
            <h2 className="h2" style={{ marginTop: 14, color: "#0B1B2B", letterSpacing: "-0.01em" }}>
              Your next trip starts with a question.
            </h2>
            <p className="p-l" style={{ margin: "16px auto 0", maxWidth: 460, color: "#5A6B7B" }}>
              Open MapsGPT, ask away, and go — free, no account needed.
            </p>

            <div
              style={{
                marginTop: 32,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: 12,
              }}
            >
              <a href="https://mapsgpt.es" target="_blank" rel="noreferrer" className="mg-cta-pill group">
                Try MapsGPT in browser
                <span style={{ display: "inline-block", color: "#154ACC" }}>
                  <ArrowDots />
                </span>
              </a>
              <StoreBadges />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
