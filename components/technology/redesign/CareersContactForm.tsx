"use client";

import Link from "next/link";
import { useState } from "react";

type InquiryType = "columbus-pro" | "elio" | "investment" | "careers";

const TABS: { value: InquiryType; label: string }[] = [
  { value: "columbus-pro", label: "Columbus Pro" },
  { value: "elio", label: "Elio" },
  { value: "investment", label: "Investors" },
  { value: "careers", label: "Careers" },
];

const TAB_INTRO: Record<InquiryType, { heading: string; sub: string }> = {
  "columbus-pro": { heading: "Book a demo", sub: "See Columbus working on your own data." },
  elio: { heading: "Tell us about your project", sub: "Share what you want to build with Elio." },
  investment: { heading: "Investor relations", sub: "Let’s talk partnerships and the road ahead." },
  careers: { heading: "Join the crew", sub: "Tell us where you’d make your mark." },
};

/* Design tokens — same source of truth as the contact page
   (app/contact/page.tsx), so this form stays in lock-step with it. */
const INK = "var(--color-ink)";
const MUTED = "var(--color-muted)";
const HAIRLINE = "var(--color-gridline)";
const CTA = "var(--color-cta)";
/* Interactive accent — the teal the navbar "Try Elio" CTA arrows use. */
const ACCENT = "var(--color-accent)";

const cardStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: "var(--radius-card)",
  boxShadow: `0 1px 3px color-mix(in srgb, ${CTA} 5%, transparent), 0 16px 44px color-mix(in srgb, ${CTA} 10%, transparent)`,
};

const labelEl = (text: string) => (
  <span className="text-[13px] font-medium" style={{ color: MUTED }}>
    {text}
  </span>
);

/* The dot-arrow icon every CTA on the site carries (navbar + Hero). */
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

type Props = {
  /** Optional intro block (e.g. section heading + lead) rendered above
      the form card. Fades + collapses gracefully on submit. */
  intro?: React.ReactNode;
};

export function CareersContactForm({ intro }: Props = {}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    message: "",
    companySize: "",
    industry: "",
    heardFrom: "",
  });
  const [tab, setTab] = useState<InquiryType>("careers");
  const [updates, setUpdates] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [tabKey, setTabKey] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "message") setCharCount(value.length);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      message: "",
      companySize: "",
      industry: "",
      heardFrom: "",
    });
    setCharCount(0);
    setUpdates(false);
    setSubmitted(false);
  };

  return (
    <div className="w-full max-w-[640px] mx-auto">
      <style>{`
        /* Intro wrapper collapses to zero height when the form has been
           submitted. */
        .ccf-intro-wrap {
          display: grid;
          grid-template-rows: 1fr;
          opacity: 1;
          margin-bottom: 40px;
          transition: grid-template-rows 500ms cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 300ms ease,
                      transform 500ms cubic-bezier(0.22, 1, 0.36, 1),
                      margin-bottom 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ccf-intro-wrap[data-hidden="true"] {
          grid-template-rows: 0fr;
          opacity: 0;
          transform: translateY(-12px);
          margin-bottom: 0;
          pointer-events: none;
        }
        .ccf-intro-wrap > * { overflow: hidden; min-height: 0; }

        /* ── Boxed fields — rounded, hairline border, accent focus ── */
        .ccf-input, .ccf-select, .ccf-textarea {
          width: 100%;
          border: 1px solid ${HAIRLINE};
          background: #FFFFFF;
          color: ${INK};
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .ccf-input   { padding: 11px 14px; border-radius: var(--radius-md); }
        .ccf-textarea{ padding: 12px 14px; border-radius: var(--radius-md); min-height: 116px; line-height: 1.55; resize: vertical; }
        .ccf-select  {
          padding: 11px 40px 11px 14px;
          border-radius: var(--radius-md);
          appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%235A6B7B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
        }
        .ccf-input::placeholder, .ccf-textarea::placeholder { color: color-mix(in srgb, ${INK} 32%, transparent); }
        .ccf-input:focus, .ccf-select:focus, .ccf-textarea:focus {
          border-color: ${ACCENT};
          box-shadow: 0 0 0 3px color-mix(in srgb, ${ACCENT} 14%, transparent);
        }
        /* ── Pill tabs — navy fill on the active one ── */
        .ccf-tab {
          padding: 7px 15px;
          font-size: 13px;
          font-weight: 500;
          border-radius: var(--radius-full);
          color: ${MUTED};
          white-space: nowrap;
          cursor: pointer;
          transition: background-color 0.25s ease, color 0.25s ease;
        }
        .ccf-tab:hover { color: ${INK}; background: color-mix(in srgb, ${INK} 5%, transparent); }
        .ccf-tab[data-active="true"],
        .ccf-tab[data-active="true"]:hover { background: ${CTA}; color: #FFFFFF; }
        /* ── Resume file input ── */
        .ccf-file { font-size: 14px; color: ${INK}; }
        .ccf-file::file-selector-button {
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
        .ccf-file::file-selector-button:hover { background: color-mix(in srgb, var(--color-bg1), ${INK} 5%); }

        @keyframes ccfTabContentIn {
          from { opacity: 0; filter: blur(6px); transform: translateY(12px); }
          to   { opacity: 1; filter: blur(0px); transform: translateY(0); }
        }
        @keyframes ccfConfirm {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {intro && (
        <div className="ccf-intro-wrap" data-hidden={submitted} aria-hidden={submitted}>
          <div>{intro}</div>
        </div>
      )}

      {!submitted && (
        <div style={cardStyle}>
          {/* Pill tab row — left-aligned */}
          <div
            className="flex gap-2.5 overflow-x-auto px-4 py-4"
            style={{ borderBottom: `1px solid ${HAIRLINE}` }}
          >
            {TABS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setTab(opt.value);
                  setTabKey((k) => k + 1);
                }}
                data-active={tab === opt.value}
                className="ccf-tab"
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div
            key={tabKey}
            className="px-6 py-7 md:px-8 md:py-9"
            style={{ animation: "ccfTabContentIn 0.5s cubic-bezier(0.22, 1, 0.36, 1)" }}
          >
            <div className="mb-7">
              <h3 className="h4 tracking-tight text-ink">{TAB_INTRO[tab].heading}</h3>
              <p className="p-m text-muted mt-2">{TAB_INTRO[tab].sub}</p>
            </div>

            {/* ── Columbus Pro — book a demo ── */}
            {tab === "columbus-pro" && (
              <form className="flex flex-col gap-5" onSubmit={handleSend}>
                <label className="flex flex-col gap-1.5">
                  {labelEl("Email")}
                  <input type="email" name="email" required value={form.email} onChange={handleChange} className="ccf-input" placeholder="name@company.com" />
                </label>

                <label className="flex flex-col gap-1.5">
                  {labelEl("Your name")}
                  <input type="text" name="companySize" required value={form.companySize} onChange={handleChange} className="ccf-input" placeholder="Number of employees" />
                </label>

                <label className="flex flex-col gap-1.5">
                  {labelEl("Industry")}
                  <select name="industry" required value={form.industry} onChange={handleChange} className="ccf-select">
                    <option value="" disabled>Please select</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="government">Government</option>
                    <option value="logistics">Logistics &amp; Supply Chain</option>
                    <option value="urban-infrastructure">Urban Infrastructure</option>
                    <option value="environmental-research">Environmental Research</option>
                    <option value="security">Security &amp; Defense</option>
                    <option value="insurance">Insurance</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  {labelEl("What are you hoping to get out of Columbus?")}
                  <textarea name="message" required maxLength={500} rows={4} value={form.message} onChange={handleChange} className="ccf-textarea" placeholder="Tell us how you want to work with Columbus Pro." />
                  <span className="text-[12px] text-right" style={{ color: MUTED }}>{charCount}/500</span>
                </label>

                <label className="flex flex-col gap-1.5">
                  {labelEl("How did you hear about us?")}
                  <select name="heardFrom" value={form.heardFrom} onChange={handleChange} className="ccf-select">
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
                  <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} className="ccf-input" placeholder="Your name" />
                </label>

                <label className="flex flex-col gap-1.5">
                  {labelEl("Email")}
                  <input type="email" name="email" required value={form.email} onChange={handleChange} className="ccf-input" placeholder="name@company.com" />
                </label>

                {tab === "investment" && (
                  <label className="flex flex-col gap-1.5">
                    {labelEl("Organization")}
                    <input type="text" name="role" required value={form.role} onChange={handleChange} className="ccf-input" />
                  </label>
                )}

                <label className="flex flex-col gap-1.5">
                  {labelEl(tab === "investment" ? "Tell us about your interest" : "We're happy to talk")}
                  <textarea
                    name="message"
                    required
                    maxLength={500}
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className="ccf-textarea"
                    placeholder={
                      tab === "investment"
                        ? "Message goes directly to our CEO"
                        : "App support, ideas, feature requests or anything else :)"
                    }
                  />
                  <span className="text-[12px] text-right" style={{ color: MUTED }}>{charCount}/500</span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={updates} onChange={(e) => setUpdates(e.target.checked)} className="mt-0.5 w-4 h-4 accent-accent" />
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
                  <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} className="ccf-input" placeholder="Your name" />
                </label>

                <label className="flex flex-col gap-1.5">
                  {labelEl("Email")}
                  <input type="email" name="email" required value={form.email} onChange={handleChange} className="ccf-input" placeholder="name@company.com" />
                </label>

                <label className="flex flex-col gap-1.5">
                  {labelEl("Role you’re interested in")}
                  <input type="text" name="role" required value={form.role} onChange={handleChange} className="ccf-input" placeholder="e.g. Software Engineer, Data Scientist…" />
                </label>

                <label className="flex flex-col gap-1.5">
                  {labelEl("Tell us about yourself")}
                  <textarea name="message" required maxLength={500} rows={4} value={form.message} onChange={handleChange} className="ccf-textarea" placeholder="What excites you about geospatial intelligence? What would you bring to the team?" />
                  <span className="text-[12px] text-right" style={{ color: MUTED }}>{charCount}/500</span>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[13px] font-medium" style={{ color: MUTED }}>
                    Resume <span className="text-[12px]" style={{ color: MUTED }}>(optional — PDF or DOC)</span>
                  </span>
                  <input type="file" accept=".pdf,.doc,.docx" className="ccf-file" />
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
      )}

      {submitted && (
        <div
          className="flex flex-col items-center text-center py-16"
          style={{ animation: "ccfConfirm 0.9s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <p className="h4 tracking-tight text-ink mb-3">Message sent.</p>
          <p className="p-l text-muted max-w-[400px]">
            Thanks — we&rsquo;ll be in touch shortly.
          </p>
          <CtaButton className="mt-8" onClick={resetForm}>
            Send another message
          </CtaButton>
        </div>
      )}
    </div>
  );
}
