/**
 * catcherX design-system showcase.
 *
 * Single source of truth for the visual language: colors, typescale,
 * shape, motion, and the small set of pre-baked component primitives
 * (.section, .container-site, .card, .btn, .eyebrow).
 *
 * Tokens are defined in app/globals.css (@theme block + :root typescale).
 */

import type { CSSProperties } from "react";

const COLORS: { name: string; token: string; hex: string; note?: string }[] = [
  { name: "Ink", token: "--color-ink", hex: "#0B1B2B", note: "Default heading + body text" },
  { name: "Muted", token: "--color-muted", hex: "#5A6B7B", note: "Secondary text" },
  { name: "Brand", token: "--color-brand", hex: "#1451E8", note: "Signal colour only" },
  { name: "Brand soft", token: "--color-brand-soft", hex: "#74A0FE", note: "Decorative gradient stop" },
  { name: "BG 1", token: "--color-bg1", hex: "#F6F8FB", note: "Page gradient top stop" },
  { name: "BG 2", token: "--color-bg2", hex: "#E5EDFB", note: "Pale-blue wash (use at 40% opacity)" },
  { name: "Grid line", token: "--color-gridline", hex: "#E7E7F1", note: "Blueprint hairlines" },
];

const TYPESCALE: { name: string; base: string; sample: string }[] = [
  { name: "Headline / Large", base: "headline-lg", sample: "The frontier research lab" },
  { name: "Headline / Small", base: "headline-sm", sample: "Section heading" },
  { name: "Title / Large", base: "title-lg", sample: "Card title or article subhead" },
  { name: "Body / Large", base: "body-lg", sample: "Paragraph body — the default reading size for prose." },
  { name: "Body / Medium", base: "body-md", sample: "Compact body — secondary captions and meta." },
  { name: "Label / Large", base: "label-lg", sample: "Button label or chip" },
  { name: "Label / Medium", base: "label-md", sample: "EYEBROW / KICKER" },
];

const SHAPE: { name: string; token: string; px: string }[] = [
  { name: "Card", token: "--radius-card", px: "20px" },
  { name: "Medium", token: "--radius-md", px: "12px" },
  { name: "Full (pill)", token: "--radius-full", px: "9999px" },
];

const MOTION: { name: string; token: string; value: string }[] = [
  { name: "Duration / Medium", token: "--motion-duration-md", value: "300ms" },
  { name: "Easing / Decelerate", token: "--motion-easing-decelerate", value: "cubic-bezier(0.05, 0.7, 0.1, 1)" },
];

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-white text-ink">
      <header className="section">
        <div className="container-site">
          <p className="eyebrow mb-2">Design system</p>
          <h1 className="text-display font-normal tracking-tight leading-[1.05] mb-6">catcherX</h1>
          <p className="text-xl text-muted max-w-[60ch]">
            The single visual language for the site. Use these tokens directly; do not invent new
            colours, type sizes, or radii outside this page.
          </p>
        </div>
      </header>

      <Section title="Colour">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {COLORS.map((c) => (
            <article key={c.token} className="card">
              <div
                className="h-24 rounded-md mb-4 border"
                style={{ background: c.hex, borderColor: "var(--color-gridline)" }}
              />
              <p className="text-base font-semibold text-ink">{c.name}</p>
              <p className="text-sm font-mono text-muted mt-1">{c.token}</p>
              <p className="text-sm font-mono text-muted">{c.hex}</p>
              {c.note ? <p className="text-sm text-muted mt-2">{c.note}</p> : null}
            </article>
          ))}
        </div>
      </Section>

      <Section title="Typescale">
        <div className="space-y-8">
          {TYPESCALE.map((t) => {
            const style: CSSProperties = {
              fontFamily: "var(--font-sans)",
              fontSize: `var(--text-${t.base}-size)`,
              lineHeight: `var(--text-${t.base}-line-height)`,
              fontWeight: `var(--text-${t.base}-weight)` as CSSProperties["fontWeight"],
              letterSpacing: `var(--text-${t.base}-tracking)`,
            };
            return (
              <article key={t.base} className="border-b border-gridline pb-6">
                <p className="text-sm font-mono text-muted mb-2">--text-{t.base}-*</p>
                <p className="text-xs text-muted mb-3">{t.name}</p>
                <p style={style} className="text-ink">{t.sample}</p>
              </article>
            );
          })}
        </div>
      </Section>

      <Section title="Shape">
        <div className="grid grid-cols-3 gap-6 max-w-xl">
          {SHAPE.map((s) => (
            <article key={s.token} className="text-center">
              <div
                className="aspect-square bg-bg2 border mx-auto"
                style={{ borderRadius: `var(${s.token})`, borderColor: "var(--color-brand-soft)" }}
              />
              <p className="text-base font-semibold text-ink mt-3">{s.name}</p>
              <p className="text-sm font-mono text-muted">{s.token}</p>
              <p className="text-sm font-mono text-muted">{s.px}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Motion">
        <ul className="space-y-3 max-w-2xl">
          {MOTION.map((m) => (
            <li key={m.token} className="flex items-baseline justify-between border-b border-gridline pb-3">
              <span className="text-base text-ink">{m.name}</span>
              <span className="text-sm font-mono text-muted">{m.token}</span>
              <span className="text-sm font-mono text-muted">{m.value}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Component primitives">
        <div className="space-y-10">
          <Primitive name=".btn-primary" code='<button class="btn btn-primary">Get in touch</button>'>
            <button className="btn btn-primary">Get in touch</button>
          </Primitive>
          <Primitive name=".btn-ghost" code='<button class="btn btn-ghost">Read more</button>'>
            <button className="btn btn-ghost">Read more</button>
          </Primitive>
          <Primitive name=".eyebrow" code='<p class="eyebrow">Section kicker</p>'>
            <p className="eyebrow">Section kicker</p>
          </Primitive>
          <Primitive name=".card" code='<article class="card">…</article>'>
            <article className="card max-w-md">
              <p className="text-lg font-semibold text-ink mb-2">Soft-elevated surface</p>
              <p className="text-base text-muted">
                20px radius, hairline border, subtle drop shadow, 28px padding, slight backdrop blur.
              </p>
            </article>
          </Primitive>
        </div>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="section border-t border-gridline">
      <div className="container-site">
        <h2
          className="font-normal tracking-tight text-ink mb-10"
          style={{
            fontSize: "var(--text-headline-lg-size)",
            lineHeight: "var(--text-headline-lg-line-height)",
          }}
        >
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function Primitive({ name, code, children }: { name: string; code: string; children: React.ReactNode }) {
  return (
    <article>
      <p className="text-sm font-mono text-muted mb-3">{name}</p>
      <div className="mb-3">{children}</div>
      <pre className="text-xs font-mono text-muted bg-bg1 rounded-md p-3 overflow-x-auto">
        {code}
      </pre>
    </article>
  );
}
