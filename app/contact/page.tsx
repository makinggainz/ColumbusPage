"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const BeachOceanScene = dynamic(() => import("@/components/contact/IslandScene"), { ssr: false });

type Phase = "writing" | "folding" | "bottling" | "dropping" | "floating" | "done";
type InquiryType = "columbus-pro" | "elio" | "investment" | "careers";

const TABS: { value: InquiryType; label: string }[] = [
  { value: "columbus-pro", label: "Columbus Pro" },
  { value: "elio", label: "Elio" },
  { value: "investment", label: "Investment" },
  { value: "careers", label: "Careers" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", role: "", message: "" });
  const [phase, setPhase] = useState<Phase>("writing");
  const [tab, setTab] = useState<InquiryType>("columbus-pro");
  const [updates, setUpdates] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === "message") setCharCount(value.length);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setPhase("folding");
  };

  useEffect(() => {
    if (phase === "folding")  { const t = setTimeout(() => setPhase("bottling"), 1200); return () => clearTimeout(t); }
    if (phase === "bottling") { const t = setTimeout(() => setPhase("dropping"), 1200); return () => clearTimeout(t); }
    if (phase === "dropping") { const t = setTimeout(() => setPhase("floating"), 1000); return () => clearTimeout(t); }
    if (phase === "floating") { const t = setTimeout(() => setPhase("done"), 8000);    return () => clearTimeout(t); }
  }, [phase]);

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#FFFFFF",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.03)",
  };

  const inputClass = "bg-transparent outline-none py-2 text-[16px] text-[#0A1344] w-full";
  const fadeLine: React.CSSProperties = {
    height: 1,
    background: "linear-gradient(to right, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.08) 60%, transparent 100%)",
  };

  return (
    <main className="relative min-h-screen">
      <style>{`
        .contact-input {
          position: relative;
          border-bottom: none;
          background: none;
        }
        .contact-input-wrap {
          position: relative;
        }
        .contact-input-wrap::after {
          content: "";
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, rgba(10,19,68,0.12) 0%, rgba(10,19,68,0.12) 60%, transparent 100%);
          transition: none;
        }
        .contact-input-wrap .input-fill {
          position: absolute;
          bottom: 0; left: 0;
          height: 1px;
          width: 0;
          background: rgba(0,102,204,0.7);
          transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .contact-input-wrap:focus-within .input-fill {
          width: 100%;
        }
        /* Tab gradient fade-in */
        .contact-tab {
          position: relative;
          overflow: hidden;
        }
        .contact-tab::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,102,204,0.12) 0%, rgba(0,102,204,0.04) 60%, transparent 100%);
          opacity: 0;
          transform: translateY(100%);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .contact-tab[data-active="true"]::before {
          opacity: 1;
          transform: translateY(0%);
        }
        .contact-tab span { position: relative; z-index: 1; }
        /* Button hover */
        .contact-btn:hover span { color: #0066CC; }
        .contact-btn:hover svg { transform: translate(2px, -2px); }
        .contact-btn svg { transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
        .contact-btn span { transition: color 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes foldCard {
          0% { max-height: 600px; width: 100%; opacity: 1; transform: translateY(0) scale(1); }
          50% { max-height: 80px; width: 60%; opacity: 0.8; transform: translateY(20px) scale(0.85); }
          100% { max-height: 20px; width: 30%; opacity: 0; transform: translateY(50px) scale(0.4); }
        }
        @keyframes confirmFade { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes subtleTextIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes footerFadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <BeachOceanScene phase={phase} messageText={form.message} senderName={form.firstName} />
      <Navbar />

      <div className="relative z-10">

        {phase === "writing" && (
          <div className="pt-36 md:pt-44 pb-10 md:pb-14 px-8 md:px-10 text-center">
            <h1 className="font-light leading-[1.15] text-[#0A1344] text-[39px] md:text-[49px] lg:text-[61px]" style={{ letterSpacing: "-0.02em" }}>
              Get in touch.
            </h1>
            <p className="mt-4 text-[16px] md:text-[20px] leading-[1.5]" style={{ color: "rgba(10, 19, 68, 0.55)", letterSpacing: "-0.015em", fontWeight: 400 }}>
              Let&apos;s start your journey.
            </p>
          </div>
        )}
        {phase !== "writing" && <div className="pt-24 md:pt-32" />}

        <div className="max-w-[640px] mx-auto px-5 md:px-10 pb-16 md:pb-24">

          {phase === "writing" && (
            <div style={{ animation: "fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}>
            <div style={cardStyle}>

              {/* ── Tab bar — structural, accent gradient on active ── */}
              <div className="flex" style={{ borderBottom: "1px solid rgba(10,19,68,0.08)" }}>
                {TABS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTab(opt.value)}
                    data-active={tab === opt.value}
                    className="contact-tab flex-1 py-4 text-[14px] font-medium"
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

              {/* ── Tab content ── */}
              <div className="px-8 py-8 md:px-10 md:py-10">

                {/* ── Columbus Pro / Investment / Support → form ── */}
                {tab !== "careers" && (
                  <form className="flex flex-col gap-7" onSubmit={handleSend}>

                    {tab === "columbus-pro" && (
                      <p className="text-[16px] leading-[1.6]" style={{ color: "rgba(10, 19, 68, 0.45)", fontWeight: 400 }}>
                        Tell us about your enterprise needs and we&apos;ll connect you with the right team.
                      </p>
                    )}
                    {tab === "investment" && (
                      <p className="text-[16px] leading-[1.6]" style={{ color: "rgba(10, 19, 68, 0.45)", fontWeight: 400 }}>
                        For partnership, funding, or business development inquiries.
                      </p>
                    )}
                    {tab === "elio" && (
                      <p className="text-[16px] leading-[1.6]" style={{ color: "rgba(10, 19, 68, 0.45)", fontWeight: 400 }}>
                        Tell us about your interest in Elio (MapsGPT) and how we can help.
                      </p>
                    )}

                    <div style={fadeLine} />

                    <div className="grid grid-cols-2 gap-6">
                      <label className="flex flex-col gap-1">
                        <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>First name</span>
                        <div className="contact-input-wrap">
                          <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} className={inputClass} />
                          <div className="input-fill" />
                        </div>
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>Last name</span>
                        <div className="contact-input-wrap">
                          <input type="text" name="lastName" required value={form.lastName} onChange={handleChange} className={inputClass} />
                          <div className="input-fill" />
                        </div>
                      </label>
                    </div>

                    <label className="flex flex-col gap-1">
                      <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>Email</span>
                      <div className="contact-input-wrap">
                        <input type="email" name="email" required value={form.email} onChange={handleChange} className={inputClass} />
                        <div className="input-fill" />
                      </div>
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>{tab === "investment" ? "Organization" : "Role"}</span>
                      <div className="contact-input-wrap">
                        <input type="text" name="role" required value={form.role} onChange={handleChange} className={inputClass} />
                        <div className="input-fill" />
                      </div>
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-[14px]" style={{ color: "rgba(10,19,68,0.65)" }}>
                        {tab === "investment" ? "Tell us about your interest" : "Tell us about your project"}
                      </span>
                      <textarea
                        name="message" required maxLength={500} rows={4} value={form.message} onChange={handleChange}
                        placeholder={
                          tab === "investment" ? "Share your investment thesis or partnership proposal."
                          : "Please share your objectives and any specific requirements."
                        }
                        className="bg-transparent border border-[rgba(10,19,68,0.08)] focus:border-[rgba(0,102,204,0.5)] outline-none p-3 text-[15px] text-[#0A1344] placeholder:text-[rgba(10,19,68,0.25)] transition-colors duration-300 resize-y mt-1"
                        style={{ borderRadius: 0 }}
                      />
                      <span className="text-[13px] text-right" style={{ color: "rgba(10,19,68,0.3)" }}>{charCount}/500</span>
                    </label>

                    <div style={fadeLine} />

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={updates} onChange={e => setUpdates(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#0066CC]" style={{ borderRadius: 0 }} />
                      <span className="text-[14px] leading-[1.5]" style={{ color: "rgba(10,19,68,0.65)" }}>I want to receive product updates from Columbus Earth.</span>
                    </label>

                    <p className="text-[13px] leading-[1.5]" style={{ color: "rgba(10,19,68,0.35)" }}>
                      By submitting, you agree with our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                    </p>

                    <button
                      type="submit"
                      className="contact-btn flex items-center gap-4 self-start"
                      style={{ height: 40, paddingLeft: 20, paddingRight: 16, fontSize: 14, fontWeight: 500, backgroundColor: "#000000", color: "white", borderRadius: 0 }}
                    >
                      <span>Submit</span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#0066CC" strokeWidth="1.2" strokeLinecap="round">
                        <path d="M1 13L13 1M13 1H5M13 1V9" />
                      </svg>
                    </button>
                  </form>
                )}

                {/* ── Careers tab ── */}
                {tab === "careers" && (
                  <div className="py-4">
                    <p className="text-[16px] leading-[1.6] mb-6" style={{ color: "rgba(10,19,68,0.65)", fontWeight: 400 }}>
                      We&apos;re building the future of geospatial intelligence. If you want to work on problems that matter — understanding our planet at scale — we&apos;d love to hear from you.
                    </p>
                    <div style={fadeLine} className="mb-6" />
                    <Link
                      href="/careers"
                      className="contact-btn inline-flex items-center gap-4"
                      style={{ height: 40, paddingLeft: 20, paddingRight: 16, fontSize: 14, fontWeight: 500, backgroundColor: "#000000", color: "white", borderRadius: 0 }}
                    >
                      <span>View open positions</span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#0066CC" strokeWidth="1.2" strokeLinecap="round">
                        <path d="M1 13L13 1M13 1H5M13 1V9" />
                      </svg>
                    </Link>
                    <p className="mt-6 text-[14px] leading-[1.6]" style={{ color: "rgba(10,19,68,0.45)" }}>
                      Or email us directly at <a href="mailto:careers@columbus.earth" className="underline hover:opacity-70 transition-opacity">careers@columbus.earth</a>
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* ── Support dropdown ── */}
            <div className="mt-4" style={cardStyle}>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("support-content");
                  if (el) el.style.maxHeight = el.style.maxHeight === "0px" ? "300px" : "0px";
                  const arrow = document.getElementById("support-arrow");
                  if (arrow) arrow.style.transform = arrow.style.transform === "rotate(180deg)" ? "rotate(0deg)" : "rotate(180deg)";
                }}
                className="w-full flex items-center justify-between px-8 py-5 text-left"
              >
                <span className="text-[15px] font-medium" style={{ color: "#0A1344" }}>Need support?</span>
                <svg id="support-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#0A1344" strokeWidth="1.5" strokeLinecap="round"
                  style={{ transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)" }}>
                  <path d="M2 4.5l4 4 4-4" />
                </svg>
              </button>
              <div id="support-content" style={{ maxHeight: "0px", overflow: "hidden", transition: "max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1)" }}>
                <div className="px-8 pb-6">
                  <div style={fadeLine} className="mb-5" />
                  <ul className="space-y-2 text-[15px] leading-[1.6]" style={{ color: "rgba(10,19,68,0.65)" }}>
                    <li>• Visit our <Link href="/help" className="underline hover:opacity-70 transition-opacity">Help center</Link></li>
                    <li>• <Link href="/login" className="underline hover:opacity-70 transition-opacity">Login</Link> to chat with support</li>
                    <li>• Join our <Link href="https://discord.gg/columbus" className="underline hover:opacity-70 transition-opacity">Discord</Link> for community support</li>
                    <li>• Email <a href="mailto:support@columbus.earth" className="underline hover:opacity-70 transition-opacity">support@columbus.earth</a></li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
          )}

          {/* ── Phase: Folding ── */}
          {phase === "folding" && (
            <div className="mx-auto overflow-hidden" style={{ ...cardStyle, animation: "foldCard 1.15s cubic-bezier(0.4, 0, 0.2, 1) forwards" }}>
              <div className="p-8">
                <p className="text-[15px] text-[#1D1D1F] leading-[1.6]">{form.message || "..."}</p>
                <p className="text-[14px] text-right mt-4" style={{ color: "rgba(0,0,0,0.45)" }}>— {form.firstName || "Explorer"}</p>
              </div>
            </div>
          )}

          {(phase === "bottling" || phase === "dropping") && (
            <div key={phase} className="flex flex-col items-center text-center py-8" style={{ animation: "subtleTextIn 0.7s cubic-bezier(0.22, 1, 0.36, 1)" }}>
              <p className="text-[17px]" style={{ color: "rgba(10, 19, 68, 0.45)", fontWeight: 400 }}>
                {phase === "bottling" ? "Sealing your message..." : "Into the waves..."}
              </p>
            </div>
          )}

          {(phase === "floating" || phase === "done") && (
            <div className="flex flex-col items-center text-center py-12" style={{ animation: "confirmFade 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <p className="text-[28px] font-semibold mb-3" style={{ color: "#0A1344", letterSpacing: "-0.02em" }}>Message sent.</p>
              <p className="text-[17px] leading-[1.6] max-w-[400px]" style={{ color: "rgba(10,19,68,0.45)", fontWeight: 400 }}>
                Your bottle is on its way. Like all good things, it may take a little time — but we&apos;ll be in touch.
              </p>
              {phase === "done" && (
                <button
                  onClick={() => { setPhase("writing"); setForm({ firstName: "", lastName: "", email: "", role: "", message: "" }); setCharCount(0); }}
                  className="contact-btn mt-8 flex items-center gap-4"
                  style={{ height: 40, paddingLeft: 20, paddingRight: 16, fontSize: 14, fontWeight: 500, backgroundColor: "#000000", color: "white", borderRadius: 0 }}
                >
                  <span>Send another message</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#0066CC" strokeWidth="1.2" strokeLinecap="round">
                    <path d="M1 13L13 1M13 1H5M13 1V9" />
                  </svg>
                </button>
              )}
            </div>
          )}

        </div>

        <div style={{ minHeight: "30vh" }} />

        {(phase === "writing" || phase === "done") && (
          <div style={{
            mask: "linear-gradient(to bottom, transparent 0%, black 10%)",
            WebkitMask: "linear-gradient(to bottom, transparent 0%, black 10%)",
            animation: phase === "done" ? "footerFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1)" : undefined,
          }}>
            <Footer />
          </div>
        )}
      </div>
    </main>
  );
}
