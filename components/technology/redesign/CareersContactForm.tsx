"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type InquiryType = "columbus-pro" | "elio" | "investment" | "careers";

const TABS: { value: InquiryType; label: string }[] = [
  { value: "columbus-pro", label: "Columbus Pro" },
  { value: "elio", label: "Elio" },
  { value: "investment", label: "Investment" },
  { value: "careers", label: "Careers" },
];

const cardStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.03)",
};

const inputClass = "bg-transparent outline-none py-2 text-[16px] text-[#0A1344] w-full";

const fadeLine: React.CSSProperties = {
  height: 1,
  background:
    "linear-gradient(to right, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.08) 60%, transparent 100%)",
};

export function CareersContactForm() {
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

  useEffect(() => {
    if (!submitted) return;
    // Auto-reset after 8s so the user can send another message.
    const t = window.setTimeout(() => setSubmitted(false), 8000);
    return () => window.clearTimeout(t);
  }, [submitted]);

  return (
    <div className="w-full max-w-[640px] mx-auto">
      <style>{`
        .ccf-input-wrap { position: relative; }
        .ccf-input-wrap::after {
          content: "";
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, rgba(10,19,68,0.12) 0%, rgba(10,19,68,0.12) 60%, transparent 100%);
        }
        .ccf-input-wrap .ccf-input-fill {
          position: absolute;
          bottom: 0; left: 0;
          height: 1px;
          width: 0;
          background: rgba(0,102,204,0.7);
          transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 1;
        }
        .ccf-input-wrap:focus-within .ccf-input-fill { width: 100%; }

        .ccf-tab { position: relative; overflow: hidden; }
        .ccf-tab::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,102,204,0.12) 0%, rgba(0,102,204,0.04) 60%, transparent 100%);
          opacity: 0;
          transform: translateY(100%);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ccf-tab:hover::before { opacity: 0.4; transform: translateY(0%); }
        .ccf-tab[data-active="true"]::before { opacity: 1; transform: translateY(0%); }
        .ccf-tab span { position: relative; z-index: 1; }

        .ccf-btn { cursor: pointer; }
        .ccf-btn:hover span { color: #0066CC; }
        .ccf-btn:hover svg { transform: translate(2px, -2px); }
        .ccf-btn svg { transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
        .ccf-btn span { transition: color 0.3s ease; }

        @keyframes ccfTabContentIn {
          from { opacity: 0; filter: blur(6px); transform: translateY(12px); }
          to   { opacity: 1; filter: blur(0px); transform: translateY(0); }
        }
        @keyframes ccfConfirm {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {!submitted && (
        <div style={cardStyle}>
          {/* Tab bar */}
          <div
            className="flex"
            style={{ borderBottom: "1px solid rgba(10,19,68,0.08)" }}
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
                className="ccf-tab flex-1 py-4 text-[14px] font-medium cursor-pointer"
                style={{
                  color: tab === opt.value ? "#0A1344" : "rgba(10,19,68,0.35)",
                  borderRight: "1px solid rgba(10,19,68,0.06)",
                  transition: "color 0.3s ease",
                }}
              >
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div
            key={tabKey}
            className="px-8 py-8 md:px-10 md:py-10"
            style={{ animation: "ccfTabContentIn 0.5s cubic-bezier(0.22, 1, 0.36, 1)" }}
          >
            {tab === "columbus-pro" && (
              <form className="flex flex-col gap-7" onSubmit={handleSend}>
                <div className="mb-2">
                  <h3 className="text-[22px] font-medium text-[#0A1344] tracking-[-0.02em]">
                    Book a Demo
                  </h3>
                </div>

                <label className="flex flex-col gap-1">
                  <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>Company email</span>
                  <div className="ccf-input-wrap">
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="name@company.com"
                    />
                    <div className="ccf-input-fill" />
                  </div>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>Company size</span>
                  <div className="ccf-input-wrap">
                    <input
                      type="text"
                      name="companySize"
                      required
                      value={form.companySize}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Enter the number of employees"
                    />
                    <div className="ccf-input-fill" />
                  </div>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>Industry</span>
                  <select
                    name="industry"
                    required
                    value={form.industry}
                    onChange={handleChange}
                    className="bg-transparent outline-none py-3 text-[15px] text-[#0A1344] w-full appearance-none cursor-pointer"
                    style={{
                      borderBottom: "1px solid rgba(10,19,68,0.12)",
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%230A1344' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right center",
                    }}
                  >
                    <option value="" disabled>Please Select</option>
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

                <label className="flex flex-col gap-1">
                  <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>What are you hoping to get out of Columbus?</span>
                  <textarea
                    name="message"
                    required
                    maxLength={500}
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className="bg-transparent border border-[rgba(10,19,68,0.08)] focus:border-[rgba(0,102,204,0.5)] outline-none p-3 text-[15px] text-[#0A1344] placeholder:text-[rgba(10,19,68,0.25)] transition-colors duration-300 resize-y mt-1"
                    style={{ borderRadius: 0 }}
                  />
                  <span className="text-[13px] text-right" style={{ color: "rgba(10,19,68,0.3)" }}>{charCount}/500</span>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>How did you hear about us?</span>
                  <select
                    name="heardFrom"
                    value={form.heardFrom}
                    onChange={handleChange}
                    className="bg-transparent outline-none py-3 text-[15px] text-[#0A1344] w-full appearance-none cursor-pointer"
                    style={{
                      borderBottom: "1px solid rgba(10,19,68,0.12)",
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%230A1344' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right center",
                    }}
                  >
                    <option value="" disabled>Please Select</option>
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
                    <option value="news-press">News / Press / Articles / Newsletters / Podcast</option>
                    <option value="short-squeeze">Short Squeeze Newsletter</option>
                    <option value="ooh-billboards">Out of Home / Billboards</option>
                    <option value="product-hunt">Product Hunt / Forums</option>
                    <option value="direct-outreach">Direct Outreach</option>
                    <option value="partnership">Partnership / Integration</option>
                    <option value="existing-customer">Existing Customer / Prior Experience</option>
                    <option value="other-ad">Other Advertisement</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <p className="text-[13px] leading-[1.5]" style={{ color: "rgba(10,19,68,0.35)" }}>
                  By submitting, you agree with our <Link href="/terms" className="underline cursor-pointer">Terms</Link> and <Link href="/privacy" className="underline cursor-pointer">Privacy Policy</Link>.
                </p>

                <button
                  type="submit"
                  className="ccf-btn flex items-center gap-4 self-start"
                  style={{ height: 40, paddingLeft: 20, paddingRight: 16, fontSize: 14, fontWeight: 500, backgroundColor: "#000000", color: "white", borderRadius: 0 }}
                >
                  <span>Submit</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#0066CC" strokeWidth="1.2" strokeLinecap="round">
                    <path d="M1 13L13 1M13 1H5M13 1V9" />
                  </svg>
                </button>
              </form>
            )}

            {(tab === "investment" || tab === "elio") && (
              <form className="flex flex-col gap-7" onSubmit={handleSend}>
                {tab === "investment" && (
                  <div className="mb-2">
                    <h3 className="text-[22px] font-medium text-[#0A1344] tracking-[-0.02em]">Investment Inquiry</h3>
                  </div>
                )}
                {tab === "elio" && (
                  <div className="mb-2">
                    <h3 className="text-[22px] font-medium text-[#0A1344] tracking-[-0.02em]">Elio / MapsGPT</h3>
                  </div>
                )}

                <label className="flex flex-col gap-1">
                  <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>Name</span>
                  <div className="ccf-input-wrap">
                    <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} className={inputClass} />
                    <div className="ccf-input-fill" />
                  </div>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>Email</span>
                  <div className="ccf-input-wrap">
                    <input type="email" name="email" required value={form.email} onChange={handleChange} className={inputClass} />
                    <div className="ccf-input-fill" />
                  </div>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>{tab === "investment" ? "Organization" : "Role"}</span>
                  <div className="ccf-input-wrap">
                    <input type="text" name="role" required value={form.role} onChange={handleChange} className={inputClass} />
                    <div className="ccf-input-fill" />
                  </div>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>
                    {tab === "investment" ? "Tell us about your interest" : "Tell us about your project"}
                  </span>
                  <textarea
                    name="message"
                    required
                    maxLength={500}
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder={
                      tab === "investment"
                        ? "Share your investment thesis or partnership proposal."
                        : "Please share your objectives and any specific requirements."
                    }
                    className="bg-transparent border border-[rgba(10,19,68,0.08)] focus:border-[rgba(0,102,204,0.5)] outline-none p-3 text-[15px] text-[#0A1344] placeholder:text-[rgba(10,19,68,0.25)] transition-colors duration-300 resize-y mt-1"
                    style={{ borderRadius: 0 }}
                  />
                  <span className="text-[13px] text-right" style={{ color: "rgba(10,19,68,0.3)" }}>{charCount}/500</span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={updates} onChange={(e) => setUpdates(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#0066CC]" style={{ borderRadius: 0 }} />
                  <span className="text-[14px] leading-[1.5]" style={{ color: "rgba(10,19,68,0.65)" }}>I want to receive product updates from Columbus Earth.</span>
                </label>

                <p className="text-[13px] leading-[1.5]" style={{ color: "rgba(10,19,68,0.35)" }}>
                  By submitting, you agree with our <Link href="/terms" className="underline cursor-pointer">Terms</Link> and <Link href="/privacy" className="underline cursor-pointer">Privacy Policy</Link>.
                </p>

                <button
                  type="submit"
                  className="ccf-btn flex items-center gap-4 self-start"
                  style={{ height: 40, paddingLeft: 20, paddingRight: 16, fontSize: 14, fontWeight: 500, backgroundColor: "#000000", color: "white", borderRadius: 0 }}
                >
                  <span>Submit</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#0066CC" strokeWidth="1.2" strokeLinecap="round">
                    <path d="M1 13L13 1M13 1H5M13 1V9" />
                  </svg>
                </button>
              </form>
            )}

            {tab === "careers" && (
              <form className="flex flex-col gap-7" onSubmit={handleSend}>
                <div className="mb-2">
                  <h3 className="text-[22px] font-medium text-[#0A1344] tracking-[-0.02em]">Join Our Team</h3>
                </div>

                <label className="flex flex-col gap-1">
                  <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>Name</span>
                  <div className="ccf-input-wrap">
                    <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} className={inputClass} />
                    <div className="ccf-input-fill" />
                  </div>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>Email</span>
                  <div className="ccf-input-wrap">
                    <input type="email" name="email" required value={form.email} onChange={handleChange} className={inputClass} />
                    <div className="ccf-input-fill" />
                  </div>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>Role you&apos;re interested in</span>
                  <div className="ccf-input-wrap">
                    <input type="text" name="role" required value={form.role} onChange={handleChange} className={inputClass} placeholder="e.g. Software Engineer, Data Scientist..." />
                    <div className="ccf-input-fill" />
                  </div>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>Tell us about yourself</span>
                  <textarea
                    name="message"
                    required
                    maxLength={500}
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="What excites you about geospatial intelligence? What would you bring to the team?"
                    className="bg-transparent border border-[rgba(10,19,68,0.08)] focus:border-[rgba(0,102,204,0.5)] outline-none p-3 text-[15px] text-[#0A1344] placeholder:text-[rgba(10,19,68,0.25)] transition-colors duration-300 resize-y mt-1"
                    style={{ borderRadius: 0 }}
                  />
                  <span className="text-[13px] text-right" style={{ color: "rgba(10,19,68,0.3)" }}>{charCount}/500</span>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>
                    Resume <span className="text-[12px]" style={{ color: "rgba(10,19,68,0.35)" }}>(optional — PDF or DOC)</span>
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="text-[14px] text-[#0A1344] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[13px] file:font-medium file:bg-[rgba(10,19,68,0.06)] file:text-[#0A1344] hover:file:bg-[rgba(10,19,68,0.1)] file:cursor-pointer file:transition-colors file:duration-200"
                    style={{ borderRadius: 0 }}
                  />
                </label>

                <p className="text-[13px] leading-[1.5]" style={{ color: "rgba(10,19,68,0.35)" }}>
                  By submitting, you agree with our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>

                <button
                  type="submit"
                  className="ccf-btn flex items-center gap-4 self-start"
                  style={{ height: 40, paddingLeft: 20, paddingRight: 16, fontSize: 14, fontWeight: 500, backgroundColor: "#000000", color: "white", borderRadius: 0 }}
                >
                  <span>Submit</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#0066CC" strokeWidth="1.2" strokeLinecap="round">
                    <path d="M1 13L13 1M13 1H5M13 1V9" />
                  </svg>
                </button>
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
          <p
            className="text-[28px] font-semibold mb-3"
            style={{ color: "#0A1344", letterSpacing: "-0.02em" }}
          >
            Message sent.
          </p>
          <p
            className="text-[17px] leading-[1.6] max-w-[400px]"
            style={{ color: "rgba(10,19,68,0.45)", fontWeight: 400 }}
          >
            Thanks — we&rsquo;ll be in touch shortly.
          </p>
          <button
            onClick={resetForm}
            className="ccf-btn mt-8 flex items-center gap-4"
            style={{ height: 40, paddingLeft: 20, paddingRight: 16, fontSize: 14, fontWeight: 500, backgroundColor: "#000000", color: "white", borderRadius: 0 }}
          >
            <span>Send another message</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#0066CC" strokeWidth="1.2" strokeLinecap="round">
              <path d="M1 13L13 1M13 1H5M13 1V9" />
            </svg>
          </button>
        </div>
      )}

    </div>
  );
}
