"use client";

import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const IslandScene = dynamic(() => import("@/components/contact/IslandScene"), { ssr: false });

export default function ContactPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", role: "", message: "" });
  const [updates, setUpdates] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === "message") setCharCount(value.length);
  };

  const glassCard: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
  };

  const sectionBorder: React.CSSProperties = {
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  };

  return (
    <main className="relative min-h-screen">
      {/* Ocean scene — fixed fullscreen background */}
      <IslandScene />

      <Navbar />

      {/* All content floats above the canvas */}
      <div className="relative z-10">

        {/* ── Hero heading ── */}
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

        {/* ── Two-column layout — glass cards over ocean ── */}
        <div className="max-w-[1287px] mx-auto px-5 md:px-10 pb-16 md:pb-24">
          <div className="grid md:grid-cols-[1fr_2fr] gap-6 md:gap-8 items-start">

            {/* ──── Left column: How can we help? ──── */}
            <div style={glassCard}>

              <div className="px-8 py-8" style={sectionBorder}>
                <h2 className="text-[24px] md:text-[28px] font-medium text-[#1D1D1F]" style={{ letterSpacing: "-0.02em" }}>
                  How can we help?
                </h2>
              </div>

              <div className="px-8 py-8" style={sectionBorder}>
                <div className="flex items-center gap-2 mb-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#2563EB" strokeWidth="1.2" /><circle cx="10" cy="10" r="4" stroke="#2563EB" strokeWidth="1.2" /><line x1="10" y1="1" x2="10" y2="4" stroke="#2563EB" strokeWidth="1.2" /><line x1="10" y1="16" x2="10" y2="19" stroke="#2563EB" strokeWidth="1.2" /><line x1="1" y1="10" x2="4" y2="10" stroke="#2563EB" strokeWidth="1.2" /><line x1="16" y1="10" x2="19" y2="10" stroke="#2563EB" strokeWidth="1.2" /></svg>
                </div>
                <h3 className="text-[18px] font-semibold text-[#1D1D1F] mb-3">Support</h3>
                <ul className="space-y-2 text-[15px] leading-[1.6] text-[#1D1D1F]">
                  <li>• Visit our <Link href="/help" className="underline hover:opacity-70 transition-opacity">Help center</Link></li>
                  <li>• <Link href="/login" className="underline hover:opacity-70 transition-opacity">Login</Link> to chat with support</li>
                  <li>• Join our <Link href="https://discord.gg/columbus" className="underline hover:opacity-70 transition-opacity">Discord</Link> for community support</li>
                </ul>
              </div>

              <div className="px-8 py-8" style={sectionBorder}>
                <div className="flex items-center gap-2 mb-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="16" height="16" rx="2" stroke="#2563EB" strokeWidth="1.2" /><line x1="2" y1="8" x2="18" y2="8" stroke="#2563EB" strokeWidth="1.2" /><line x1="8" y1="2" x2="8" y2="18" stroke="#2563EB" strokeWidth="1.2" /></svg>
                </div>
                <h3 className="text-[18px] font-semibold text-[#1D1D1F] mb-3">Press and events</h3>
                <p className="text-[15px] leading-[1.6] text-[#1D1D1F]">Email us at<br /><a href="mailto:press@columbus.earth" className="underline hover:opacity-70 transition-opacity font-medium">press@columbus.earth</a></p>
              </div>

              <div className="px-8 py-8" style={sectionBorder}>
                <div className="flex items-center gap-2 mb-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#2563EB" strokeWidth="1.2" /><path d="M10 5v5l3.5 3.5" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" /></svg>
                </div>
                <h3 className="text-[18px] font-semibold text-[#1D1D1F] mb-3">Careers</h3>
                <p className="text-[15px] leading-[1.6] text-[#1D1D1F] mb-3">If you&apos;re excited about creating paradigm shifts in physical world understanding. Join us now.</p>
                <Link href="/careers" className="text-[15px] font-medium underline hover:opacity-70 transition-opacity text-[#1D1D1F]">View open positions ↗</Link>
              </div>

              <div className="px-8 py-8">
                <div className="flex items-center gap-2 mb-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 17V7l7-5 7 5v10H3z" stroke="#2563EB" strokeWidth="1.2" strokeLinejoin="round" /><path d="M8 17v-5h4v5" stroke="#2563EB" strokeWidth="1.2" strokeLinejoin="round" /></svg>
                </div>
                <h3 className="text-[18px] font-semibold text-[#1D1D1F] mb-3">Careers &amp; investment queries</h3>
                <p className="text-[15px] leading-[1.6] text-[#1D1D1F] mb-3">For partnership, investment, or general business inquiries.</p>
                <a href="mailto:invest@columbus.earth" className="text-[15px] font-medium underline hover:opacity-70 transition-opacity text-[#1D1D1F]">invest@columbus.earth ↗</a>
              </div>
            </div>

            {/* ──── Right column: Contact sales form ──── */}
            <div style={glassCard}>
              <div className="px-8 py-8 md:px-10 md:py-10">
                <h2 className="text-[24px] md:text-[28px] font-medium text-[#1D1D1F] mb-10" style={{ letterSpacing: "-0.02em" }}>
                  Contact sales.
                </h2>
                <form className="flex flex-col gap-6" onSubmit={e => e.preventDefault()}>
                  <label className="flex flex-col gap-1">
                    <span className="text-[14px] text-[#1D1D1F]">First name<span className="text-[#2563EB]">*</span></span>
                    <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} className="bg-transparent border-b border-[rgba(0,0,0,0.12)] focus:border-[#2563EB] outline-none py-2 text-[16px] text-[#1D1D1F] transition-colors duration-300" />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[14px] text-[#1D1D1F]">Last name<span className="text-[#2563EB]">*</span></span>
                    <input type="text" name="lastName" required value={form.lastName} onChange={handleChange} className="bg-transparent border-b border-[rgba(0,0,0,0.12)] focus:border-[#2563EB] outline-none py-2 text-[16px] text-[#1D1D1F] transition-colors duration-300" />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[14px] text-[#1D1D1F]">Email<span className="text-[#2563EB]">*</span></span>
                    <input type="email" name="email" required value={form.email} onChange={handleChange} className="bg-transparent border-b border-[rgba(0,0,0,0.12)] focus:border-[#2563EB] outline-none py-2 text-[16px] text-[#1D1D1F] transition-colors duration-300" />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[14px] text-[#1D1D1F]">Role<span className="text-[#2563EB]">*</span></span>
                    <input type="text" name="role" required value={form.role} onChange={handleChange} className="bg-transparent border-b border-[rgba(0,0,0,0.12)] focus:border-[#2563EB] outline-none py-2 text-[16px] text-[#1D1D1F] transition-colors duration-300" />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[14px] text-[#1D1D1F]">Tell us about your project.<span className="text-[#2563EB]">*</span></span>
                    <textarea name="message" required maxLength={500} rows={4} value={form.message} onChange={handleChange} placeholder="Please share your objectives and any specific requirements." className="bg-transparent border border-[rgba(0,0,0,0.08)] focus:border-[#2563EB] outline-none p-3 text-[15px] text-[#1D1D1F] placeholder:text-[rgba(0,0,0,0.3)] transition-colors duration-300 resize-y mt-1" />
                    <span className="text-[13px] text-right" style={{ color: "rgba(0,0,0,0.35)" }}>{charCount}/500</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={updates} onChange={e => setUpdates(e.target.checked)} className="mt-1 w-4 h-4 accent-[#2563EB]" />
                    <span className="text-[14px] leading-[1.5] text-[#1D1D1F]">I want to receive updates about new features and products from Columbus Earth.</span>
                  </label>
                  <p className="text-[13px] leading-[1.5]" style={{ color: "rgba(0,0,0,0.45)" }}>
                    By submitting this form, you agree with our <Link href="/terms" className="underline">Terms of Service</Link>. We process your data in accordance with our <Link href="/privacy" className="underline">Privacy Policy</Link>.
                  </p>
                  <button type="submit" className="group flex items-center justify-between leading-none hover:opacity-90 transition-opacity self-start" style={{ height: 36, paddingLeft: 20, paddingRight: 16, fontSize: 15, fontWeight: 500, backgroundColor: "#000000", color: "white" }}>
                    <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Submit</span>
                    <svg className="ml-4 transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l5 5-5 5" /></svg>
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
