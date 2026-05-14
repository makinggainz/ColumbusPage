"use client";

/**
 * V2 hiring card — fifth card in the V2 homepage stack. Mirrors the
 * ProductCardV2 layout (text left, eyebrow + headline + body + CTA)
 * but without a product screenshot on the right. A subtle accent strip
 * sits on the right column instead so the card composition still reads
 * balanced.
 */

const CSS = `
.hcv2-card {
  display: flex;
  flex-direction: column;
  padding: 40px 28px;
  gap: 28px;
  color: #0B1B2B;
  background-color: #ffffff;
}
@media (min-width: 768px)  { .hcv2-card { padding: 56px 48px; gap: 36px; } }
@media (min-width: 1024px) {
  .hcv2-card {
    padding: 96px 80px;
    flex-direction: row;
    align-items: center;
    gap: 64px;
  }
}

.hcv2-text {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 720px;
}
@media (min-width: 1024px) { .hcv2-text { gap: 30px; } }

.hcv2-eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(11, 27, 43, 0.5);
}
.hcv2-h2 {
  margin: 0;
  font-size: 36px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-weight: 500;
}
@media (min-width: 768px)  { .hcv2-h2 { font-size: 44px; } }
@media (min-width: 1024px) { .hcv2-h2 { font-size: 60px; } }
.hcv2-desc {
  margin: 0;
  font-size: 16px;
  line-height: 1.55;
  color: rgba(11, 27, 43, 0.7);
  max-width: 38rem;
}
.hcv2-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 6px;
}
.hcv2-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 7px;
  background-color: #111111;
  color: #ffffff;
  border: 1px solid #111111;
  transition: background-color 180ms ease;
  white-space: nowrap;
  font-family: inherit;
}
.hcv2-cta:hover { background-color: #1f1f1f; }
.hcv2-cta--ghost {
  background-color: transparent;
  color: #0B1B2B;
  border-color: rgba(11, 27, 43, 0.35);
}
.hcv2-cta--ghost:hover { background-color: rgba(11, 27, 43, 0.04); }

/* Right column visual — a stack of soft horizontal bands suggesting
   open roles, without committing to specific copy or imagery. */
.hcv2-visual {
  flex: 1 1 auto;
  display: none;
}
@media (min-width: 1024px) {
  .hcv2-visual {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 440px;
  }
}
.hcv2-role {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-radius: 14px;
  border: 1px solid var(--color-gridline, #E7E7F1);
  background-color: #FAFBFD;
}
.hcv2-role-title {
  font-size: 14px;
  font-weight: 500;
  color: #0B1B2B;
}
.hcv2-role-loc {
  font-size: 12px;
  color: rgba(11, 27, 43, 0.55);
  letter-spacing: 0.02em;
}
`;

const ROLES = [
  { title: "Geospatial Research Scientist", loc: "Remote · Hybrid" },
  { title: "Senior Frontend Engineer",      loc: "New York" },
  { title: "Map Studio Product Designer",   loc: "San Francisco" },
  { title: "Developer Advocate",            loc: "Remote" },
] as const;

export function HiringCardV2() {
  return (
    <section className="cardv2 cardv2--full hcv2-card" aria-label="Open roles">
      <style>{CSS}</style>
      <div className="hcv2-text">
        <span className="hcv2-eyebrow">Open roles</span>
        <h2 className="hcv2-h2">Build the world&rsquo;s spatial intelligence with us.</h2>
        <p className="hcv2-desc">
          Columbus is hiring researchers, engineers, and designers who want
          to ship geospatial AI that meets the real world. Remote-friendly,
          deeply technical, mission-led.
        </p>
        <div className="hcv2-ctas">
          <a className="hcv2-cta" href="#">See open roles</a>
          <a className="hcv2-cta hcv2-cta--ghost" href="#">Read our values</a>
        </div>
      </div>
      <div className="hcv2-visual" aria-hidden="true">
        {ROLES.map((r) => (
          <div className="hcv2-role" key={r.title}>
            <span className="hcv2-role-title">{r.title}</span>
            <span className="hcv2-role-loc">{r.loc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HiringCardV2;
