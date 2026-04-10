"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const BeachOceanScene = dynamic(() => import("@/components/contact/IslandScene"), { ssr: false });

type Phase = "writing" | "folding" | "bottling" | "dropping" | "floating" | "done";

function Accordion({ title, icon, children, defaultOpen = false }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-8 py-6 text-left hover:bg-[rgba(0,0,0,0.015)] transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-[16px] font-semibold text-[#1D1D1F]">{title}</span>
        </div>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#1D1D1F" strokeWidth="1.5" strokeLinecap="round"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }}
        >
          <path d="M2 4.5l4 4 4-4" />
        </svg>
      </button>
      <div
        style={{
          maxHeight: open ? 300 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <div className="px-8 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", role: "", message: "" });
  const [phase, setPhase] = useState<Phase>("writing");
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

  const inputClass = "bg-transparent border-b border-[rgba(0,0,0,0.12)] focus:border-[#2563EB] outline-none py-2 text-[16px] text-[#1D1D1F] transition-colors duration-300 w-full";

  return (
    <main className="relative min-h-screen">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes foldCard {
          0% { max-height: 600px; width: 100%; padding: 40px 36px; opacity: 1; border-radius: 0px; transform: translateY(0) scale(1); }
          40% { max-height: 120px; width: 80%; padding: 16px 28px; opacity: 1; border-radius: 8px; transform: translateY(10px) scale(0.95); }
          70% { max-height: 50px; width: 50%; padding: 10px 20px; opacity: 0.85; border-radius: 20px; transform: translateY(30px) scale(0.7); }
          100% { max-height: 30px; width: 30%; padding: 6px 16px; opacity: 0; border-radius: 24px; transform: translateY(60px) scale(0.4); }
        }
        @keyframes confirmFade {
          from { opacity: 0; transform: translateY(24px); filter: blur(2px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }
        @keyframes subtleTextIn {
          from { opacity: 0; transform: translateY(12px); filter: blur(1px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }
        @keyframes footerFadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <BeachOceanScene phase={phase} messageText={form.message} senderName={form.firstName} />

      <Navbar />

      <div className="relative z-10">

        {/* ── Hero heading ── */}
        {phase === "writing" && (
          <div className="pt-36 md:pt-44 pb-10 md:pb-14 px-8 md:px-10 text-center">
            <h1
              className="font-light leading-[1.15] text-[#0A1344] text-[39px] md:text-[49px] lg:text-[61px]"
              style={{ letterSpacing: "-0.02em" }}
            >
              Get in touch.
            </h1>
            <p
              className="mt-4 text-[16px] md:text-[20px] leading-[1.5]"
              style={{ color: "rgba(10, 19, 68, 0.55)", letterSpacing: "-0.015em", fontWeight: 400 }}
            >
              Let&apos;s start your journey.
            </p>
          </div>
        )}
        {phase !== "writing" && <div className="pt-24 md:pt-32" />}

        {/* ── Single column centered layout ── */}
        <div className="max-w-[640px] mx-auto px-5 md:px-10 pb-16 md:pb-24">

          {/* ── Phase: Writing (the form + dropdowns) ── */}
          {phase === "writing" && (
            <div style={{ animation: "fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}>

              {/* Contact form card */}
              <div style={cardStyle}>
                <div className="px-8 py-8 md:px-10 md:py-10">
                  <h2 className="text-[24px] md:text-[28px] font-medium text-[#1D1D1F] mb-10" style={{ letterSpacing: "-0.02em" }}>
                    Contact sales.
                  </h2>
                  <form className="flex flex-col gap-6" onSubmit={handleSend}>
                    <div className="grid grid-cols-2 gap-6">
                      <label className="flex flex-col gap-1">
                        <span className="text-[14px] text-[#1D1D1F]">First name<span className="text-[#2563EB]">*</span></span>
                        <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} className={inputClass} />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-[14px] text-[#1D1D1F]">Last name<span className="text-[#2563EB]">*</span></span>
                        <input type="text" name="lastName" required value={form.lastName} onChange={handleChange} className={inputClass} />
                      </label>
                    </div>

                    <label className="flex flex-col gap-1">
                      <span className="text-[14px] text-[#1D1D1F]">Email<span className="text-[#2563EB]">*</span></span>
                      <input type="email" name="email" required value={form.email} onChange={handleChange} className={inputClass} />
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-[14px] text-[#1D1D1F]">Role<span className="text-[#2563EB]">*</span></span>
                      <input type="text" name="role" required value={form.role} onChange={handleChange} className={inputClass} />
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-[14px] text-[#1D1D1F]">Tell us about your project.<span className="text-[#2563EB]">*</span></span>
                      <textarea
                        name="message" required maxLength={500} rows={4} value={form.message} onChange={handleChange}
                        placeholder="Please share your objectives and any specific requirements."
                        className="bg-transparent border border-[rgba(0,0,0,0.08)] focus:border-[#2563EB] outline-none p-3 text-[15px] text-[#1D1D1F] placeholder:text-[rgba(0,0,0,0.3)] transition-colors duration-300 resize-y mt-1"
                      />
                      <span className="text-[13px] text-right" style={{ color: "rgba(0,0,0,0.35)" }}>{charCount}/500</span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={updates} onChange={e => setUpdates(e.target.checked)} className="mt-1 w-4 h-4 accent-[#2563EB]" />
                      <span className="text-[14px] leading-[1.5] text-[#1D1D1F]">I want to receive updates about new features and products from Columbus Earth.</span>
                    </label>

                    <p className="text-[13px] leading-[1.5]" style={{ color: "rgba(0,0,0,0.45)" }}>
                      By submitting this form, you agree with our <Link href="/terms" className="underline">Terms of Service</Link>. We process your data in accordance with our <Link href="/privacy" className="underline">Privacy Policy</Link>.
                    </p>

                    <button
                      type="submit"
                      className="group flex items-center justify-between leading-none hover:opacity-90 transition-opacity self-start"
                      style={{ height: 36, paddingLeft: 20, paddingRight: 16, fontSize: 15, fontWeight: 500, backgroundColor: "#000000", color: "white" }}
                    >
                      <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Submit</span>
                      <svg className="ml-4 transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l5 5-5 5" /></svg>
                    </button>
                  </form>
                </div>
              </div>

              {/* How can we help — accordion dropdowns */}
              <div className="mt-6" style={cardStyle}>
                <div className="px-8 py-6" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <h2 className="text-[20px] md:text-[22px] font-medium text-[#1D1D1F]" style={{ letterSpacing: "-0.02em" }}>
                    How can we help?
                  </h2>
                </div>

                <Accordion
                  title="Support"
                  icon={<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#2563EB" strokeWidth="1.2" /><circle cx="10" cy="10" r="4" stroke="#2563EB" strokeWidth="1.2" /><line x1="10" y1="1" x2="10" y2="4" stroke="#2563EB" strokeWidth="1.2" /><line x1="10" y1="16" x2="10" y2="19" stroke="#2563EB" strokeWidth="1.2" /><line x1="1" y1="10" x2="4" y2="10" stroke="#2563EB" strokeWidth="1.2" /><line x1="16" y1="10" x2="19" y2="10" stroke="#2563EB" strokeWidth="1.2" /></svg>}
                >
                  <ul className="space-y-2 text-[15px] leading-[1.6] text-[#1D1D1F]">
                    <li>• Visit our <Link href="/help" className="underline hover:opacity-70 transition-opacity">Help center</Link></li>
                    <li>• <Link href="/login" className="underline hover:opacity-70 transition-opacity">Login</Link> to chat with support</li>
                    <li>• Join our <Link href="https://discord.gg/columbus" className="underline hover:opacity-70 transition-opacity">Discord</Link> for community support</li>
                  </ul>
                </Accordion>

                <Accordion
                  title="Press and events"
                  icon={<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="16" height="16" rx="2" stroke="#2563EB" strokeWidth="1.2" /><line x1="2" y1="8" x2="18" y2="8" stroke="#2563EB" strokeWidth="1.2" /><line x1="8" y1="2" x2="8" y2="18" stroke="#2563EB" strokeWidth="1.2" /></svg>}
                >
                  <p className="text-[15px] leading-[1.6] text-[#1D1D1F]">Email us at<br /><a href="mailto:press@columbus.earth" className="underline hover:opacity-70 transition-opacity font-medium">press@columbus.earth</a></p>
                </Accordion>

                <Accordion
                  title="Careers"
                  icon={<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#2563EB" strokeWidth="1.2" /><path d="M10 5v5l3.5 3.5" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" /></svg>}
                >
                  <p className="text-[15px] leading-[1.6] text-[#1D1D1F] mb-3">If you&apos;re excited about creating paradigm shifts in physical world understanding. Join us now.</p>
                  <Link href="/careers" className="text-[15px] font-medium underline hover:opacity-70 transition-opacity text-[#1D1D1F]">View open positions ↗</Link>
                </Accordion>

                <Accordion
                  title="Investment queries"
                  icon={<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M3 17V7l7-5 7 5v10H3z" stroke="#2563EB" strokeWidth="1.2" strokeLinejoin="round" /><path d="M8 17v-5h4v5" stroke="#2563EB" strokeWidth="1.2" strokeLinejoin="round" /></svg>}
                >
                  <p className="text-[15px] leading-[1.6] text-[#1D1D1F] mb-3">For partnership, investment, or general business inquiries.</p>
                  <a href="mailto:invest@columbus.earth" className="text-[15px] font-medium underline hover:opacity-70 transition-opacity text-[#1D1D1F]">invest@columbus.earth ↗</a>
                </Accordion>
              </div>

            </div>
          )}

          {/* ── Phase: Folding ── */}
          {phase === "folding" && (
            <div
              className="mx-auto overflow-hidden"
              style={{
                ...cardStyle,
                animation: "foldCard 1.15s cubic-bezier(0.4, 0, 0.2, 1) forwards",
              }}
            >
              <div className="p-8">
                <p className="text-[15px] text-[#1D1D1F] leading-[1.6]">{form.message || "..."}</p>
                <p className="text-[14px] text-right mt-4" style={{ color: "rgba(0,0,0,0.45)" }}>— {form.firstName || "Explorer"}</p>
              </div>
            </div>
          )}

          {/* ── Phases: Bottling / Dropping ── */}
          {(phase === "bottling" || phase === "dropping") && (
            <div
              key={phase}
              className="flex flex-col items-center text-center py-8"
              style={{ animation: "subtleTextIn 0.7s cubic-bezier(0.22, 1, 0.36, 1)" }}
            >
              <p className="text-[17px]" style={{ color: "rgba(10, 19, 68, 0.45)", fontWeight: 400 }}>
                {phase === "bottling" ? "Sealing your message..." : "Into the waves..."}
              </p>
            </div>
          )}

          {/* ── Phase: Floating / Done ── */}
          {(phase === "floating" || phase === "done") && (
            <div
              className="flex flex-col items-center text-center py-12"
              style={{ animation: "confirmFade 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              <p className="text-[28px] font-semibold text-[#1D1D1F] mb-3" style={{ letterSpacing: "-0.02em" }}>
                Message sent.
              </p>
              <p className="text-[17px] leading-[1.6] max-w-[400px]" style={{ color: "rgba(10, 19, 68, 0.45)", fontWeight: 400 }}>
                Your bottle is on its way. Like all good things, it may take a little time — but we&apos;ll be in touch.
              </p>
            </div>
          )}

        </div>

        {(phase === "writing" || phase === "done") && (
          <div
            style={{
              mask: "linear-gradient(to bottom, transparent 0%, black 10%)",
              WebkitMask: "linear-gradient(to bottom, transparent 0%, black 10%)",
              animation: phase === "done" ? "footerFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1)" : undefined,
            }}
          >
            <Footer />
          </div>
        )}
      </div>
    </main>
  );
}
