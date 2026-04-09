"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/* ── Scroll reveal hook ── */
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  const anim = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });
  return { ref, visible, anim };
}

export default function ContactPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", role: "", message: "" });
  const [updates, setUpdates] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const hero = useScrollReveal(0);
  const formSection = useScrollReveal(0.05);
  const links = useScrollReveal(0.05);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === "message") setCharCount(value.length);
  };

  const inputClass = "bg-transparent border-b border-[rgba(0,0,0,0.12)] focus:border-[#2563EB] outline-none py-3 text-[16px] text-[#1D1D1F] transition-colors duration-300 w-full";

  return (
    <main className="relative min-h-screen" style={{ backgroundColor: "#F9F9F9" }}>
      <Navbar />

      {/* Accent gradient */}
      <div
        className="absolute left-0 right-0 top-0 pointer-events-none"
        style={{ height: "35%", background: "linear-gradient(to bottom, rgba(0, 102, 204, 0.15) 0%, rgba(0, 102, 204, 0.08) 60%, transparent 100%)", zIndex: 1 }}
        aria-hidden
      />

      {/* Subtle side structure lines */}
      <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden>
        <div className="max-w-[1287px] mx-auto h-full relative">
          <div style={{ position: "absolute", top: 0, left: 0, width: 1, height: "100%", background: "linear-gradient(to bottom, transparent 0px, var(--grid-line) 192px, var(--grid-line) calc(100% - 400px), transparent 100%)" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: 1, height: "100%", background: "linear-gradient(to bottom, transparent 0px, var(--grid-line) 192px, var(--grid-line) calc(100% - 400px), transparent 100%)" }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[640px] mx-auto px-8 md:px-10">

        {/* ── Heading ── */}
        <div ref={hero.ref} className="pt-40 md:pt-48 pb-6">
          <h1
            className="font-light leading-[1.15] text-[#0A1344] text-[39px] md:text-[49px] lg:text-[61px] text-center"
            style={{ letterSpacing: "-0.02em", ...hero.anim(0) }}
          >
            Get in touch.
          </h1>
          <p
            className="mt-4 text-[16px] md:text-[20px] leading-[1.5] text-center"
            style={{ color: "rgba(10, 19, 68, 0.45)", letterSpacing: "-0.015em", fontWeight: 400, ...hero.anim(100) }}
          >
            Let&apos;s start your journey.
          </p>
        </div>

        {/* ── Form fields flowing directly in the page ── */}
        <div ref={formSection.ref} className="py-12 md:py-16">

          <div className="grid grid-cols-2 gap-x-8 gap-y-8">
            <label className="flex flex-col gap-1" style={formSection.anim(0)}>
              <span className="text-[14px] text-[#1D1D1F]">First name<span className="text-[#2563EB]">*</span></span>
              <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} className={inputClass} />
            </label>
            <label className="flex flex-col gap-1" style={formSection.anim(50)}>
              <span className="text-[14px] text-[#1D1D1F]">Last name<span className="text-[#2563EB]">*</span></span>
              <input type="text" name="lastName" required value={form.lastName} onChange={handleChange} className={inputClass} />
            </label>
          </div>

          <label className="flex flex-col gap-1 mt-8" style={formSection.anim(100)}>
            <span className="text-[14px] text-[#1D1D1F]">Email<span className="text-[#2563EB]">*</span></span>
            <input type="email" name="email" required value={form.email} onChange={handleChange} className={inputClass} />
          </label>

          <label className="flex flex-col gap-1 mt-8" style={formSection.anim(150)}>
            <span className="text-[14px] text-[#1D1D1F]">Role<span className="text-[#2563EB]">*</span></span>
            <input type="text" name="role" required value={form.role} onChange={handleChange} className={inputClass} />
          </label>

          <label className="flex flex-col gap-1 mt-8" style={formSection.anim(200)}>
            <span className="text-[14px] text-[#1D1D1F]">Tell us about your project.<span className="text-[#2563EB]">*</span></span>
            <textarea
              name="message"
              required
              maxLength={500}
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="Please share your objectives and any specific requirements."
              className="bg-transparent border border-[rgba(0,0,0,0.08)] focus:border-[#2563EB] outline-none p-4 text-[15px] text-[#1D1D1F] placeholder:text-[rgba(0,0,0,0.25)] transition-colors duration-300 resize-y mt-1"
            />
            <span className="text-[13px] text-right" style={{ color: "rgba(0,0,0,0.3)" }}>{charCount}/500</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer mt-8" style={formSection.anim(250)}>
            <input type="checkbox" checked={updates} onChange={e => setUpdates(e.target.checked)} className="mt-1 w-4 h-4 accent-[#2563EB]" />
            <span className="text-[14px] leading-[1.5] text-[#1D1D1F]">
              I want to receive updates about new features and products from Columbus Earth.
            </span>
          </label>

          <p className="text-[13px] leading-[1.5] mt-6" style={{ color: "rgba(0,0,0,0.35)", ...formSection.anim(300) }}>
            By submitting this form, you agree with our{" "}
            <Link href="/terms" className="underline">Terms of Service</Link>.
            We process your data in accordance with our{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>

          <div className="mt-8" style={formSection.anim(350)}>
            <button
              type="submit"
              className="group flex items-center justify-between leading-none hover:opacity-90 transition-opacity"
              style={{ height: 36, paddingLeft: 20, paddingRight: 16, fontSize: 15, fontWeight: 500, backgroundColor: "#000000", color: "white" }}
            >
              <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Submit</span>
              <svg className="ml-4 transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1l5 5-5 5" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: "linear-gradient(to right, transparent 0%, var(--grid-line) 15%, var(--grid-line) 85%, transparent 100%)" }} />

        {/* ── Info links row ── */}
        <div ref={links.ref} className="py-12 md:py-16 grid grid-cols-2 gap-8">
          <div style={links.anim(0)}>
            <p className="text-[13px] font-bold tracking-[0.08em] uppercase text-[#0A1344] mb-3">Support</p>
            <p className="text-[14px] leading-[1.6] text-[#6E6E73]">
              <Link href="/help" className="underline hover:opacity-70 transition-opacity">Help center</Link>
              {" · "}
              <Link href="https://discord.gg/columbus" className="underline hover:opacity-70 transition-opacity">Discord</Link>
            </p>
          </div>
          <div style={links.anim(80)}>
            <p className="text-[13px] font-bold tracking-[0.08em] uppercase text-[#0A1344] mb-3">Press</p>
            <p className="text-[14px] leading-[1.6] text-[#6E6E73]">
              <a href="mailto:press@columbus.earth" className="underline hover:opacity-70 transition-opacity">press@columbus.earth</a>
            </p>
          </div>
          <div style={links.anim(160)}>
            <p className="text-[13px] font-bold tracking-[0.08em] uppercase text-[#0A1344] mb-3">Careers</p>
            <p className="text-[14px] leading-[1.6] text-[#6E6E73]">
              Creating paradigm shifts in physical world understanding.{" "}
              <Link href="/careers" className="underline hover:opacity-70 transition-opacity">Join us</Link>
            </p>
          </div>
          <div style={links.anim(240)}>
            <p className="text-[13px] font-bold tracking-[0.08em] uppercase text-[#0A1344] mb-3">Investment</p>
            <p className="text-[14px] leading-[1.6] text-[#6E6E73]">
              <a href="mailto:invest@columbus.earth" className="underline hover:opacity-70 transition-opacity">invest@columbus.earth</a>
            </p>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}
