"use client";

import Link from "next/link";
import { getImageProps } from "next/image";
import { useState, useEffect, useRef, Suspense, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import { MistxNav } from "@/components/layout/MistxNav";

type Phase = "writing" | "folding" | "bottling" | "dropping" | "floating" | "done";
type InquiryType = "columbus-pro" | "elio" | "investment" | "careers" | "general";

const TABS: { value: InquiryType; label: string }[] = [
  { value: "general", label: "General inquiry" },
  { value: "columbus-pro", label: "Columbus Pro" },
  { value: "elio", label: "Elio" },
  { value: "investment", label: "Investors" },
  { value: "careers", label: "Careers" },
];

const VALID_TABS = new Set<InquiryType>(["general", "columbus-pro", "elio", "investment", "careers"]);

const TAB_INTRO: Record<InquiryType, { heading: string }> = {
  "columbus-pro": { heading: "Book a demo" },
  "elio": { heading: "What’s up" },
  "investment": { heading: "Investor relations" },
  "careers": { heading: "Join the crew" },
  "general": { heading: "Get in touch" },
};

/* Source-of-truth list for the "How did you hear about us?" select.
   Defined once at module scope so every tab's form renders the same
   options in the same order — keeps marketing attribution clean. */
const HEARD_FROM_OPTIONS: { value: string; label: string }[] = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter / X" },
  { value: "facebook-instagram", label: "Facebook / Instagram" },
  { value: "reddit", label: "Reddit" },
  { value: "other-social", label: "Other Social Media" },
  { value: "google", label: "Google" },
  { value: "chatgpt-llm", label: "ChatGPT / Claude / Grok / Other LLM" },
  { value: "other-search", label: "Other Search / Research" },
  { value: "word-of-mouth", label: "Word of Mouth / Referral" },
  { value: "events", label: "Events / Conferences / Webinars" },
  { value: "news-press", label: "News / Press / Articles / Podcast" },
  { value: "ooh-billboards", label: "Out of Home / Billboards" },
  { value: "product-hunt", label: "Product Hunt / Forums" },
  { value: "direct-outreach", label: "Direct Outreach" },
  { value: "partnership", label: "Partnership / Integration" },
  { value: "existing-customer", label: "Existing Customer" },
  { value: "other", label: "Other" },
];

/* Design tokens — referenced straight from app/globals.css (@theme),
   the site's single source of truth for colour, so the form stays in
   lock-step with the homepage / blog / company system. */
const INK = "var(--color-ink)";           /* #0B1B2B */
const MUTED = "var(--color-muted)";        /* #5A6B7B */
const HAIRLINE = "var(--color-gridline)";  /* #E7E7F1 */
const CTA = "var(--color-cta)";            /* #0B1342 navy */
/* Interactive accent — the site accent token from globals.css
   (--color-accent). Same value the navbar arrows, hover states, focus
   rings, and homepage hero eyebrow read from — one change there
   retints every accent surface site-wide. */
const ACCENT = "var(--color-accent)";

/* ── Hero backdrop ────────────────────────────────────────────────────
   The single full-bleed image on the page (its LCP). Routed through the
   next/image optimizer via getImageProps so it ships AVIF instead of the
   raw multi-MB PNG, and rendered as a <picture> (below) so only the
   matching viewport variant downloads — previously two display-toggled
   <img>s meant *both* PNGs loaded on every device. The mask gradient is
   identical for both variants; only the crop (object-position) differs,
   handled by responsive classes on the <img>. See MEDIA_LOADING_PLAYBOOK.md. */
const CONTACT_HERO_MASK =
  "linear-gradient(to bottom, transparent 0%, #000 18%, #000 72%, transparent 100%)";
const CONTACT_HERO_SIZES = "100vw";

const { props: contactHeroDesktopProps } = getImageProps({
  src: "/ContactBg.png",
  alt: "",
  width: 1881,
  height: 836,
  sizes: CONTACT_HERO_SIZES,
  quality: 75,
  loading: "eager",
});

const {
  props: { srcSet: contactHeroMobileSrcSet },
} = getImageProps({
  src: "/contactbackimg-mobile.png",
  alt: "",
  width: 1440,
  height: 1440,
  sizes: CONTACT_HERO_SIZES,
  quality: 75,
});

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "What can I do with Columbus?",
    a: "Columbus turns plain-language questions into map-grade answers — fresh spatial data, real geographic reasoning, and actual maps and reports as the output, not regurgitated text.",
  },
  {
    q: "How quickly will I hear back?",
    a: "Fast. Most inquiries get a reply within one business day — picking the tab that matches your request routes it straight to the right team.",
  },
  {
    q: "Which tab should I use?",
    a: "Columbus Pro for product demos and business use, Elio for MapsGPT projects, Investors for partnership and funding conversations, and Careers if you’d like to join the team.",
  },
  {
    q: "Need help with an existing account?",
    a: (
      <>
        Visit our <Link href="/help" className="underline hover:opacity-70 transition-opacity">Help center</Link>,{" "}
        <Link href="/login" className="underline hover:opacity-70 transition-opacity">log in</Link> to chat with support,
        join our <Link href="https://discord.gg/columbus" className="underline hover:opacity-70 transition-opacity">Discord</Link>,
        or email <a href="mailto:support@columbus.earth" className="underline hover:opacity-70 transition-opacity">support@columbus.earth</a>.
      </>
    ),
  },
];

/* A plus mark whose vertical bar collapses to a minus when open —
   the same icon idiom as components/business/FAQSection.tsx. */
function PlusIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative inline-block shrink-0" style={{ width: 18, height: 18 }}>
      <span className="absolute left-0 top-1/2 -translate-y-1/2" style={{ width: 18, height: 1.5, backgroundColor: "currentColor" }} />
      <span
        className="absolute left-1/2 top-0 -translate-x-1/2 transition-transform duration-300"
        style={{ width: 1.5, height: 18, backgroundColor: "currentColor", transform: open ? "scaleY(0)" : "scaleY(1)" }}
      />
    </span>
  );
}

/* The dot-arrow icon every CTA on the site carries (navbar + Hero +
   CtaBanner) — see components/home/lightspark/CtaBanner.tsx. */
function ArrowDots({ className = "" }: { className?: string }) {
  return (
    <svg className={"size-3 shrink-0 " + className} width="24" viewBox="0 0 9 13" fill="none" aria-hidden="true">
      <circle cx="7.22" cy="6.589" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="4.018" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="1.46" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="9.151" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="11.718" r="1.28" fill="currentColor" />
    </svg>
  );
}

/* Primary CTA — the site-wide button idiom: navy `bg-cta` fill, white
   label that turns to the accent on hover, dot-arrow nudging right.
   `touch-target` floors the height at 44px on mobile (Phase 1.5 utility)
   so the button meets WCAG AA on phones while keeping the slim 36-px
   desktop look (px-5 py-2 ≈ 36px tall, matches the navbar buttons). */
function CtaButton({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`touch-target group rounded-button px-5 py-2 text-sm flex items-center gap-2 transition-colors bg-cta text-white hover:text-accent cursor-pointer ${className}`}
    >
      {children}
      <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
        <ArrowDots className="text-accent" />
      </span>
    </button>
  );
}

/* FAQ accordion — visual system lifted verbatim from the business page's
   FAQSection (components/business/FAQSection.tsx) so the two read as members
   of the same family: a single rounded host with a 2px soft hairline, rows
   divided by 1px hairlines (no per-card borders), idle rows at opacity-70 that
   snap to opacity-100 when open or hovered, and a flat #F2F2F2 fill behind the
   open row. Single-open (clicking a row closes the others); all rows start
   closed. The business --ent-* tokens are scoped to .ent-scope and aren't
   available here, so the equivalent literal values are used — and the contact
   INK / MUTED / ACCENT already match --ent-text-primary / -secondary / -accent. */
function ContactFaq({ items }: { items: { q: string; a: React.ReactNode }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <ul
      className="flex flex-col list-none m-0 p-0 overflow-hidden rounded-3xl border-2"
      style={{ borderColor: "rgba(0, 0, 0, 0.05)", background: "transparent" }}
    >
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const isHovered = hoveredIndex === i;
        const isLast = i === items.length - 1;
        return (
          <li
            key={item.q}
            className={[
              "relative transition-opacity duration-200",
              isOpen || isHovered ? "opacity-100" : "opacity-70",
            ].join(" ")}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Open-state fill — flat #F2F2F2 behind the whole row. */}
            {isOpen && (
              <span
                aria-hidden
                className="absolute inset-0"
                style={{ backgroundColor: "#F2F2F2", zIndex: 0 }}
              />
            )}

            <h3 className="m-0 relative z-10">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`contact-faq-panel-${i}`}
                id={`contact-faq-trigger-${i}`}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full text-left cursor-pointer flex items-center justify-between gap-6 px-6 md:px-10 py-7 md:py-8"
              >
                <span
                  className="text-[20px] md:text-[22px] font-semibold leading-[1.2]"
                  style={{ color: "#0E173C", letterSpacing: "-0.01em" }}
                >
                  {item.q}
                </span>
                <span
                  className="transition-colors duration-300 shrink-0"
                  style={{ color: isOpen ? ACCENT : "#0B1B2B" }}
                >
                  <PlusIcon open={isOpen} />
                </span>
              </button>
            </h3>

            {/* Answer — grid-rows trick for a smooth height transition. */}
            <div
              id={`contact-faq-panel-${i}`}
              role="region"
              aria-labelledby={`contact-faq-trigger-${i}`}
              className="relative z-10 grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p
                  className="px-6 md:px-10 pb-7 md:pb-8 text-[14px] md:text-[15px] leading-[1.6]"
                  style={{ color: MUTED, letterSpacing: "-0.005em" }}
                >
                  {item.a}
                </p>
              </div>
            </div>

            {/* Row separator — skipped on the last cell (host border carries
                the bottom edge). */}
            {!isLast && (
              <span
                aria-hidden
                className="absolute left-0 bottom-0 w-full"
                style={{ height: 1, backgroundColor: "rgba(0, 0, 0, 0.05)" }}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function ContactPageInner() {
  const searchParams = useSearchParams();
  /* Seed the form tab from `?tab=…` so CTAs around the site can route
     users straight to the form that matches where they came from
     (e.g. the homepage "Join our team" tile lands on Careers, the
     business-page "Try Demo" pill lands on Columbus Pro). Falls back
     to General if the param is missing or unknown. */
  const initialTab: InquiryType = (() => {
    const raw = searchParams.get("tab");
    return raw && VALID_TABS.has(raw as InquiryType) ? (raw as InquiryType) : "general";
  })();

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", role: "", message: "", companySize: "", industry: "", heardFrom: "" });
  const [phase, setPhase] = useState<Phase>("writing");
  const [tab, setTab] = useState<InquiryType>(initialTab);
  const [updates, setUpdates] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [tabKey, setTabKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(t);
  }, []);

  const heroFadeIn = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    filter: mounted ? "blur(0px)" : "blur(8px)",
    transform: mounted ? "translateY(0px)" : "translateY(18px)",
    transition: `opacity 1000ms ease ${delay}ms, filter 1000ms ease ${delay}ms, transform 1000ms ease ${delay}ms`,
  });

  /* Glide the form card up under the navbar the first time the user
     interacts with it. `scrollIntoView` + the card's `scroll-margin-top`
     lets the browser compute the landing spot, so it can't overshoot
     the way manual `scrollY` math did (the page sits inside PageFrame's
     margin'd, `overflow: clip` wrapper, which threw the math off).
     The guard skips the scroll once the card is already up — or
     scrolled past — so focusing a field or switching tabs never
     re-yanks the page. */
  const scrollToForm = () => {
    const el = cardRef.current;
    if (!el || el.getBoundingClientRect().top < 140) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === "message") setCharCount(value.length);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tab,
          ...form,
          updates,
          honeypot,
          pageUri: window.location.href,
          pageName: "Contact",
        }),
      });
      if (!res.ok) throw new Error("failed");
      setPhase("folding");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderSubmitRow = () => (
    <>
      {/* Honeypot — positioned off-screen; filled by bots, invisible to users */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={e => setHoneypot(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px", top: 0, opacity: 0, pointerEvents: "none", height: 0 }}
      />
      <div className="flex flex-col gap-2 pt-1">
        {submitError && (
          <p className="text-[13px]" style={{ color: "#C0392B" }}>{submitError}</p>
        )}
        <div className="flex items-center gap-4">
          <CtaButton type="submit" disabled={submitting}>
            {submitting ? "Sending…" : "Submit"}
          </CtaButton>
          {!submitError && <span className="text-[13px] text-muted">We answer fast.</span>}
        </div>
      </div>
    </>
  );

  useEffect(() => {
    if (phase === "folding")  { const t = setTimeout(() => setPhase("bottling"), 1200); return () => clearTimeout(t); }
    if (phase === "bottling") { const t = setTimeout(() => setPhase("dropping"), 1200); return () => clearTimeout(t); }
    if (phase === "dropping") { const t = setTimeout(() => setPhase("floating"), 1000); return () => clearTimeout(t); }
    if (phase === "floating") { const t = setTimeout(() => setPhase("done"), 8000);    return () => clearTimeout(t); }
  }, [phase]);

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#FFFFFF",
    border: `1px solid ${HAIRLINE}`,
    borderRadius: "var(--radius-card)",
    boxShadow: `0 1px 3px color-mix(in srgb, ${CTA} 5%, transparent), 0 16px 44px color-mix(in srgb, ${CTA} 10%, transparent)`,
  };

  const labelEl = (text: string) => (
    <span className="text-[13px] font-medium" style={{ color: MUTED }}>{text}</span>
  );

  const heardFromField = (
    <label className="flex flex-col gap-1.5">
      {labelEl("How did you hear about us?")}
      <select name="heardFrom" value={form.heardFrom} onChange={handleChange} className="cf-select">
        <option value="" disabled>Please select</option>
        {HEARD_FROM_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );

  return (
    <main className="relative min-h-screen bg-white">
      <style>{`
        /* ── Boxed fields — rounded, hairline border, brand-blue focus ── */
        .cf-input, .cf-select, .cf-textarea {
          width: 100%;
          border: 1px solid ${HAIRLINE};
          background: #FFFFFF;
          color: ${INK};
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .cf-input   { padding: 11px 14px; border-radius: var(--radius-md); }
        .cf-textarea{ padding: 12px 14px; border-radius: var(--radius-md); min-height: 116px; line-height: 1.55; resize: vertical; }
        .cf-select  {
          padding: 11px 40px 11px 14px;
          border-radius: var(--radius-md);
          appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%235A6B7B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
        }
        .cf-input::placeholder, .cf-textarea::placeholder { color: color-mix(in srgb, ${INK} 32%, transparent); }
        .cf-input:focus, .cf-select:focus, .cf-textarea:focus {
          border-color: ${ACCENT};
          box-shadow: 0 0 0 3px color-mix(in srgb, ${ACCENT} 14%, transparent);
        }
        /* ── Pill tabs — navy fill on the active one ── */
        .cf-tab {
          padding: 7px 15px;
          font-size: 13px;
          font-weight: 500;
          border-radius: var(--radius-full);
          color: ${MUTED};
          white-space: nowrap;
          cursor: pointer;
          transition: background-color 0.25s ease, color 0.25s ease;
          /* Inline-flex so min-height (mobile touch-target floor below)
             vertically centres the label without needing line-height
             gymnastics. */
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        /* Mobile touch-target floor — 44 × 44 px (WCAG AA). Padding
           still keeps the visual pill snug on desktop; mobile gets the
           extra hit area via min-height. */
        @media (max-width: 1023px) {
          .cf-tab { min-height: 44px; }
        }
        .cf-tab:hover { color: ${INK}; background: color-mix(in srgb, ${INK} 5%, transparent); }
        .cf-tab[data-active="true"],
        .cf-tab[data-active="true"]:hover { background: ${CTA}; color: #FFFFFF; }
        /* ── Resume file input ── */
        .cf-file {
          font-size: 14px;
          color: ${INK};
        }
        .cf-file::file-selector-button {
          margin-right: 14px;
          padding: 8px 14px;
          border: 1px solid ${HAIRLINE};
          border-radius: var(--radius-md);
          background: var(--color-bg1);
          color: ${INK};
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .cf-file::file-selector-button:hover { background: color-mix(in srgb, var(--color-bg1), ${INK} 5%); }

        @keyframes tabContentIn { from { opacity: 0; filter: blur(6px); transform: translateY(12px); } to { opacity: 1; filter: blur(0px); transform: translateY(0); } }
        @keyframes foldCard {
          0% { max-height: 600px; width: 100%; opacity: 1; transform: translateY(0) scale(1); }
          50% { max-height: 80px; width: 60%; opacity: 0.8; transform: translateY(20px) scale(0.85); }
          100% { max-height: 20px; width: 30%; opacity: 0; transform: translateY(50px) scale(0.4); }
        }
        @keyframes confirmFade { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes subtleTextIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Static hand-drawn beach backdrop — sits behind all content,
          full-bleed at the top of the page. The wrapping section carries
          `data-hero-section` so the navbar reads as transparent at the
          top of the page (same handshake the company / blog heroes use)
          — otherwise the navbar paints a solid white band over the top
          of the image. `aspect-ratio` on the wrapper preserves the
          natural 1881:836 ratio, and `min-height: 360px` keeps the scene
          substantial on phones where the natural ratio would collapse
          the strip to ~160 px. The top + bottom mask gradient melts the
          band into the white page above and below it. */}
      {/* Media-scoped LCP preload for the hero — one variant per viewport,
          matching the <picture> srcSets so they can't drift. React 19 hoists
          these to <head>; the `media` attr means only the matching variant is
          fetched (no double-download). */}
      <link
        rel="preload"
        as="image"
        media="(min-width: 768px)"
        imageSrcSet={contactHeroDesktopProps.srcSet}
        imageSizes={contactHeroDesktopProps.sizes}
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        media="(max-width: 767px)"
        imageSrcSet={contactHeroMobileSrcSet}
        imageSizes={CONTACT_HERO_SIZES}
        fetchPriority="high"
      />
      <section
        data-hero-section
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 w-full overflow-hidden"
        style={{ aspectRatio: "1881 / 836", minHeight: "360px" }}
      >
        {/* Art-directed <picture>: mobile source swaps in the portrait crop;
            object-position differs per viewport (mobile right-weighted, desktop
            centred) via responsive classes (`object-right` ≡ CSS `right center`).
            Only the matching variant downloads. */}
        <picture>
          <source media="(max-width: 767px)" srcSet={contactHeroMobileSrcSet} />
          <img
            {...contactHeroDesktopProps}
            alt=""
            aria-hidden
            className="select-none w-full h-full object-cover object-right md:object-center"
            style={{
              ...(contactHeroDesktopProps.style as CSSProperties),
              WebkitMaskImage: CONTACT_HERO_MASK,
              maskImage: CONTACT_HERO_MASK,
            }}
          />
        </picture>
      </section>
      <MistxNav />

      <div className="relative z-10">

        {phase === "writing" && (
          <div className="pt-28 md:pt-44 pb-10 md:pb-14 px-5 md:px-10 text-center">
            <h1 className="h1 tracking-tight text-ink text-balance" style={heroFadeIn(0)}>
              Get in touch.
            </h1>
          </div>
        )}
        {phase !== "writing" && <div className="pt-24 md:pt-32" />}

        <div className="max-w-[640px] mx-auto px-5 md:px-8 pb-16 md:pb-24">

          {phase === "writing" && (
            <div style={heroFadeIn(200)}>

              {/* ── Form card ── */}
              <div ref={cardRef} style={{ ...cardStyle, scrollMarginTop: 120 }} onClick={scrollToForm}>

                {/* Pill tab row — left-aligned */}
                <div className="flex gap-2.5 overflow-x-auto px-4 py-4" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  {TABS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setTab(opt.value); setTabKey(k => k + 1); }}
                      data-active={tab === opt.value}
                      className="cf-tab"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div key={tabKey} className="px-6 py-7 md:px-8 md:py-9" style={{ animation: "tabContentIn 0.5s cubic-bezier(0.22, 1, 0.36, 1)" }}>

                  <div className="mb-7">
                    <h2 className="h4 tracking-tight text-ink">
                      {TAB_INTRO[tab].heading}
                    </h2>
                  </div>

                  {/* ── Columbus Pro — book a demo ── */}
                  {tab === "columbus-pro" && (
                    <form className="flex flex-col gap-5" onSubmit={handleSend}>
                      <label className="flex flex-col gap-1.5">
                        {labelEl("Email")}
                        <input type="email" name="email" required value={form.email} onChange={handleChange} className="cf-input" placeholder="name@company.com" />
                      </label>

                      <label className="flex flex-col gap-1.5">
                        {labelEl("Your name")}
                        <input type="text" name="companySize" required value={form.companySize} onChange={handleChange} className="cf-input" placeholder="Number of employees" />
                      </label>

                      <label className="flex flex-col gap-1.5">
                        {labelEl("Industry")}
                        <select name="industry" required value={form.industry} onChange={handleChange} className="cf-select">
                          <option value="" disabled>Please select</option>
                          <option value="real-estate">Real Estate</option>
                          <option value="government">Government</option>
                          <option value="logistics">Logistics &amp; Supply Chain</option>
                          <option value="urban-planning">Urban Planning</option>
                          <option value="environmental">Environmental</option>
                          <option value="security">Security &amp; Defense</option>
                          <option value="insurance">Insurance</option>
                          <option value="consulting">Consulting</option>
                          <option value="other">Other</option>
                        </select>
                      </label>

                      <label className="flex flex-col gap-1.5">
                        {labelEl("What are you hoping to get out of Columbus?")}
                        <textarea name="message" required maxLength={500} rows={4} value={form.message} onChange={handleChange} className="cf-textarea" placeholder="Tell us how you want to work with Columbus Pro." />
                        <span className="text-[12px] text-right" style={{ color: MUTED }}>{charCount}/500</span>
                      </label>

                      {heardFromField}

                      <p className="text-[13px] leading-[1.5]" style={{ color: MUTED }}>
                        By submitting, you agree with our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                      </p>

                      {renderSubmitRow()}
                    </form>
                  )}

                  {/* ── Investors / Elio ── */}
                  {(tab === "investment" || tab === "elio") && (
                    <form className="flex flex-col gap-5" onSubmit={handleSend}>
                      <label className="flex flex-col gap-1.5">
                        {labelEl("Name")}
                        <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} className="cf-input" placeholder="Your name" />
                      </label>

                      <label className="flex flex-col gap-1.5">
                        {labelEl("Email")}
                        <input type="email" name="email" required value={form.email} onChange={handleChange} className="cf-input" placeholder="name@company.com" />
                      </label>

                      {tab === "investment" && (
                        <label className="flex flex-col gap-1.5">
                          {labelEl("Organization")}
                          <input type="text" name="role" required value={form.role} onChange={handleChange} className="cf-input" />
                        </label>
                      )}

                      <label className="flex flex-col gap-1.5">
                        {labelEl(tab === "investment" ? "Tell us about your interest" : "We're happy to talk")}
                        <textarea
                          name="message" required maxLength={500} rows={4} value={form.message} onChange={handleChange} className="cf-textarea"
                          placeholder={tab === "investment" ? "Message goes directly to our CEO" : "App support, ideas, feature requests or anything else :)"}
                        />
                        <span className="text-[12px] text-right" style={{ color: MUTED }}>{charCount}/500</span>
                      </label>

                      {heardFromField}

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={updates} onChange={e => setUpdates(e.target.checked)} className="mt-0.5 w-4 h-4 accent-accent" />
                        <span className="text-[14px] leading-[1.5]" style={{ color: MUTED }}>I want to receive product updates from Columbus Earth.</span>
                      </label>

                      <p className="text-[13px] leading-[1.5]" style={{ color: MUTED }}>
                        By submitting, you agree with our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                      </p>

                      {renderSubmitRow()}
                    </form>
                  )}

                  {/* ── Careers ── */}
                  {tab === "careers" && (
                    <form className="flex flex-col gap-5" onSubmit={handleSend}>
                      <label className="flex flex-col gap-1.5">
                        {labelEl("Name")}
                        <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} className="cf-input" placeholder="Your name" />
                      </label>

                      <label className="flex flex-col gap-1.5">
                        {labelEl("Email")}
                        <input type="email" name="email" required value={form.email} onChange={handleChange} className="cf-input" placeholder="name@company.com" />
                      </label>

                      <label className="flex flex-col gap-1.5">
                        {labelEl("Role you’re interested in")}
                        <input type="text" name="role" required value={form.role} onChange={handleChange} className="cf-input" placeholder="e.g. Software Engineer, Data Scientist…" />
                      </label>

                      <label className="flex flex-col gap-1.5">
                        {labelEl("Tell us about yourself")}
                        <textarea name="message" required maxLength={500} rows={4} value={form.message} onChange={handleChange} className="cf-textarea" placeholder="What excites you about geospatial intelligence? What would you bring to the team?" />
                        <span className="text-[12px] text-right" style={{ color: MUTED }}>{charCount}/500</span>
                      </label>

                      {heardFromField}

                      <label className="flex flex-col gap-2">
                        <span className="text-[13px] font-medium" style={{ color: MUTED }}>
                          Resume <span className="text-[12px]" style={{ color: MUTED }}>(optional — PDF or DOC)</span>
                        </span>
                        <input type="file" accept=".pdf,.doc,.docx" className="cf-file" />
                      </label>

                      <p className="text-[13px] leading-[1.5]" style={{ color: MUTED }}>
                        By submitting, you agree with our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                      </p>

                      {renderSubmitRow()}
                    </form>
                  )}

                  {/* ── General inquiry ── */}
                  {tab === "general" && (
                    <form className="flex flex-col gap-5" onSubmit={handleSend}>
                      <label className="flex flex-col gap-1.5">
                        {labelEl("Name")}
                        <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} className="cf-input" placeholder="Your name" />
                      </label>

                      <label className="flex flex-col gap-1.5">
                        {labelEl("Email")}
                        <input type="email" name="email" required value={form.email} onChange={handleChange} className="cf-input" placeholder="name@example.com" />
                      </label>

                      <label className="flex flex-col gap-1.5">
                        {labelEl("Message")}
                        <textarea name="message" required maxLength={500} rows={4} value={form.message} onChange={handleChange} className="cf-textarea" placeholder="What can we help you with?" />
                        <span className="text-[12px] text-right" style={{ color: MUTED }}>{charCount}/500</span>
                      </label>

                      {heardFromField}

                      <p className="text-[13px] leading-[1.5]" style={{ color: MUTED }}>
                        By submitting, you agree with our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                      </p>

                      {renderSubmitRow()}
                    </form>
                  )}

                </div>
              </div>

              {/* ── FAQ ── */}
              <div className="mt-20 md:mt-24">
                <h2 className="h2 tracking-tight text-ink text-center text-balance mb-8">
                  FAQ
                </h2>
                <ContactFaq items={FAQS} />
              </div>

            </div>
          )}

          {/* ── Phase: Folding ── */}
          {phase === "folding" && (
            <div className="mx-auto overflow-hidden" style={{ ...cardStyle, animation: "foldCard 1.15s cubic-bezier(0.4, 0, 0.2, 1) forwards" }}>
              <div className="p-8">
                <p className="text-[15px] leading-[1.6]" style={{ color: INK }}>{form.message || "..."}</p>
                <p className="text-[14px] text-right mt-4" style={{ color: MUTED }}>— {form.firstName || "Explorer"}</p>
              </div>
            </div>
          )}

          {(phase === "bottling" || phase === "dropping") && (
            <div key={phase} className="flex flex-col items-center text-center py-8" style={{ animation: "subtleTextIn 0.7s cubic-bezier(0.22, 1, 0.36, 1)" }}>
              <p className="p-l text-ink">
                {phase === "bottling" ? "Sealing your message..." : "Into the waves..."}
              </p>
            </div>
          )}

          {(phase === "floating" || phase === "done") && (
            <div className="flex flex-col items-center text-center py-12" style={{ animation: "confirmFade 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <p className="h4 tracking-tight text-ink mb-3">Message sent.</p>
              <p className="p-l text-muted max-w-[400px]">
                Your bottle has landed. We respond fast.
              </p>
              <CtaButton
                className="mt-8"
                onClick={() => { setPhase("writing"); setForm({ firstName: "", lastName: "", email: "", role: "", message: "", companySize: "", industry: "", heardFrom: "" }); setCharCount(0); setSubmitError(null); setHoneypot(""); }}
              >
                Send another message
              </CtaButton>
            </div>
          )}

        </div>

        <div style={{ minHeight: "20vh" }} />

      </div>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactPageInner />
    </Suspense>
  );
}
