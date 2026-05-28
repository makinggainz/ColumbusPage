"use client";

import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
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
   label that turns to the accent on hover, dot-arrow nudging right. */
function CtaButton({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`group rounded-button px-5 py-2 text-sm flex items-center gap-2 transition-colors bg-cta text-white hover:text-accent cursor-pointer ${className}`}
    >
      {children}
      <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
        <ArrowDots className="text-accent" />
      </span>
    </button>
  );
}

function FaqItem({ item }: { item: { q: string; a: React.ReactNode } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-[7px] border bg-white overflow-hidden" style={{ borderColor: HAIRLINE }}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left cursor-pointer"
      >
        <span className="text-[16px] md:text-[17px] font-medium leading-[1.4]" style={{ color: INK }}>
          {item.q}
        </span>
        <span className="transition-colors duration-300" style={{ color: open ? ACCENT : INK }}>
          <PlusIcon open={open} />
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-[15px] leading-[1.65]" style={{ color: MUTED }}>
            {item.a}
          </p>
        </div>
      </div>
    </div>
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

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setPhase("folding");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          full-bleed at the top of the page, fading naturally to white. */}
      <img
        src="/contactbackimg.png"
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute inset-x-0 top-0 z-0 w-full h-auto"
      />
      <MistxNav />

      <div className="relative z-10">

        {phase === "writing" && (
          <div className="pt-36 md:pt-44 pb-10 md:pb-14 px-8 md:px-10 text-center">
            <h1 className="h1 tracking-tight text-ink" style={heroFadeIn(0)}>
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
                        {labelEl("Company email")}
                        <input type="email" name="email" required value={form.email} onChange={handleChange} className="cf-input" placeholder="name@company.com" />
                      </label>

                      <label className="flex flex-col gap-1.5">
                        {labelEl("Company size")}
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

                      <label className="flex flex-col gap-1.5">
                        {labelEl("How did you hear about us?")}
                        <select name="heardFrom" value={form.heardFrom} onChange={handleChange} className="cf-select">
                          <option value="" disabled>Please select</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="twitter">Twitter / X</option>
                          <option value="facebook-instagram">Facebook / Instagram</option>
                          <option value="reddit">Reddit</option>
                          <option value="other-social">Other Social Media</option>
                          <option value="google">Google</option>
                          <option value="chatgpt-llm">ChatGPT / Claude / Grok / Other LLM</option>
                          <option value="other-search">Other Search / Research</option>
                          <option value="word-of-mouth">Word of Mouth / Referral</option>
                          <option value="events">Events / Conferences / Webinars</option>
                          <option value="news-press">News / Press / Articles / Podcast</option>
                          <option value="ooh-billboards">Out of Home / Billboards</option>
                          <option value="product-hunt">Product Hunt / Forums</option>
                          <option value="direct-outreach">Direct Outreach</option>
                          <option value="partnership">Partnership / Integration</option>
                          <option value="existing-customer">Existing Customer</option>
                          <option value="other">Other</option>
                        </select>
                      </label>

                      <p className="text-[13px] leading-[1.5]" style={{ color: MUTED }}>
                        By submitting, you agree with our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                      </p>

                      <div className="flex items-center gap-4 pt-1">
                        <CtaButton type="submit">Submit</CtaButton>
                        <span className="text-[13px] text-muted">We answer fast.</span>
                      </div>
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

                      <label className="flex flex-col gap-1.5">
                        {labelEl(tab === "investment" ? "Organization" : "Role")}
                        <input type="text" name="role" required value={form.role} onChange={handleChange} className="cf-input" />
                      </label>

                      <label className="flex flex-col gap-1.5">
                        {labelEl(tab === "investment" ? "Tell us about your interest" : "Tell us about your project")}
                        <textarea
                          name="message" required maxLength={500} rows={4} value={form.message} onChange={handleChange} className="cf-textarea"
                          placeholder={tab === "investment" ? "Share your investment thesis or partnership proposal." : "Share your objectives and any specific requirements."}
                        />
                        <span className="text-[12px] text-right" style={{ color: MUTED }}>{charCount}/500</span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={updates} onChange={e => setUpdates(e.target.checked)} className="mt-0.5 w-4 h-4 accent-accent" />
                        <span className="text-[14px] leading-[1.5]" style={{ color: MUTED }}>I want to receive product updates from Columbus Earth.</span>
                      </label>

                      <p className="text-[13px] leading-[1.5]" style={{ color: MUTED }}>
                        By submitting, you agree with our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                      </p>

                      <div className="flex items-center gap-4 pt-1">
                        <CtaButton type="submit">Submit</CtaButton>
                        <span className="text-[13px] text-muted">We answer fast.</span>
                      </div>
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

                      <label className="flex flex-col gap-2">
                        <span className="text-[13px] font-medium" style={{ color: MUTED }}>
                          Resume <span className="text-[12px]" style={{ color: MUTED }}>(optional — PDF or DOC)</span>
                        </span>
                        <input type="file" accept=".pdf,.doc,.docx" className="cf-file" />
                      </label>

                      <p className="text-[13px] leading-[1.5]" style={{ color: MUTED }}>
                        By submitting, you agree with our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                      </p>

                      <div className="flex items-center gap-4 pt-1">
                        <CtaButton type="submit">Submit</CtaButton>
                        <span className="text-[13px] text-muted">We answer fast.</span>
                      </div>
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

                      <p className="text-[13px] leading-[1.5]" style={{ color: MUTED }}>
                        By submitting, you agree with our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                      </p>

                      <div className="flex items-center gap-4 pt-1">
                        <CtaButton type="submit">Submit</CtaButton>
                        <span className="text-[13px] text-muted">We answer fast.</span>
                      </div>
                    </form>
                  )}

                </div>
              </div>

              {/* ── FAQ ── */}
              <div className="mt-20 md:mt-24">
                <h2 className="h2 tracking-tight text-ink text-center mb-8">
                  FAQ
                </h2>
                <div className="flex flex-col gap-3">
                  {FAQS.map(item => (
                    <FaqItem key={item.q} item={item} />
                  ))}
                </div>
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
                onClick={() => { setPhase("writing"); setForm({ firstName: "", lastName: "", email: "", role: "", message: "", companySize: "", industry: "", heardFrom: "" }); setCharCount(0); }}
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
