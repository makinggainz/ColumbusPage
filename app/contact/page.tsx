"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GridSection, gl } from "@/components/home/ContentGrid";

/* ── Scroll reveal ── */
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

/* ── Wireframe Globe ── */
function WireframeGlobe({ className = "" }: { className?: string }) {
  const cx = 400, cy = 400, R = 350;
  const tiltX = 20 * (Math.PI / 180);
  const tiltY = -15 * (Math.PI / 180);
  const project = (lon: number, lat: number): [number, number] | null => {
    const l = lon * (Math.PI / 180), p = lat * (Math.PI / 180);
    const x = Math.cos(p) * Math.cos(l);
    const y = Math.cos(p) * Math.sin(l);
    const z = Math.sin(p);
    const y1 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
    const z1 = y * Math.sin(tiltX) + z * Math.cos(tiltX);
    const x2 = x * Math.cos(tiltY) + z1 * Math.sin(tiltY);
    const z2 = -x * Math.sin(tiltY) + z1 * Math.cos(tiltY);
    if (z2 < -0.1) return null;
    return [cx + x2 * R, cy - y1 * R];
  };
  const buildLine = (pts: ([number, number] | null)[]): string => {
    let d = "", pen = false;
    for (const pt of pts) {
      if (!pt) { pen = false; continue; }
      d += pen ? `L${pt[0].toFixed(1)},${pt[1].toFixed(1)} ` : `M${pt[0].toFixed(1)},${pt[1].toFixed(1)} `;
      pen = true;
    }
    return d;
  };
  const steps = 120;
  const lines: React.ReactElement[] = [];
  for (let lon = -180; lon < 180; lon += 20) {
    const pts = Array.from({ length: steps + 1 }, (_, i) => project(lon, -90 + i * (180 / steps)));
    const d = buildLine(pts);
    if (d) lines.push(<path key={`m${lon}`} d={d} stroke="rgba(37,99,235,0.12)" strokeWidth={0.8} />);
  }
  for (let lat = -75; lat <= 75; lat += 15) {
    const pts = Array.from({ length: steps + 1 }, (_, i) => project(-180 + i * (360 / steps), lat));
    const d = buildLine(pts);
    if (d) lines.push(<path key={`p${lat}`} d={d} stroke="rgba(37,99,235,0.10)" strokeWidth={0.6} />);
  }
  const eq = Array.from({ length: steps + 1 }, (_, i) => project(-180 + i * (360 / steps), 0));
  const eqD = buildLine(eq);
  if (eqD) lines.push(<path key="eq" d={eqD} stroke="rgba(37,99,235,0.20)" strokeWidth={1.2} />);
  const pm = Array.from({ length: steps + 1 }, (_, i) => project(0, -90 + i * (180 / steps)));
  const pmD = buildLine(pm);
  if (pmD) lines.push(<path key="pm" d={pmD} stroke="rgba(37,99,235,0.18)" strokeWidth={1.0} />);
  lines.push(<circle key="outline" cx={cx} cy={cy} r={R} stroke="rgba(37,99,235,0.08)" strokeWidth={1} />);
  return (
    <svg className={className} viewBox="0 0 800 800" fill="none" aria-hidden>
      <style>{`@keyframes globe-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <g style={{ transformOrigin: "400px 400px", animation: "globe-spin 60s linear infinite" }}>{lines}</g>
    </svg>
  );
}

/* ── Accordion card ── */
function ContactCard({ label, icon, children, defaultOpen = false }: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <GridSection className="bg-transparent!">
      <div style={{ borderBottom: gl }}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between px-8 md:px-10 py-6 md:py-8 cursor-pointer hover:bg-[rgba(37,99,235,0.02)] transition-colors duration-300"
        >
          <div className="flex items-center gap-4">
            <span className="text-[#2563EB]">{icon}</span>
            <h2 className="text-[20px] md:text-[24px] font-medium text-[#1D1D1F]" style={{ letterSpacing: "-0.02em" }}>
              {label}
            </h2>
          </div>
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#1D1D1F" strokeWidth="1.5" strokeLinecap="round"
            className="transition-transform duration-300"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <path d="M2 5l5 5 5-5" />
          </svg>
        </button>
        <div
          className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ maxHeight: open ? 800 : 0, opacity: open ? 1 : 0 }}
        >
          <div className="px-8 md:px-10 pb-8 md:pb-10">
            {children}
          </div>
        </div>
      </div>
    </GridSection>
  );
}

/* ── Page ── */
export default function ContactPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", role: "", message: "" });
  const [updates, setUpdates] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const hero = useScrollReveal(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === "message") setCharCount(value.length);
  };

  const inputClass = "bg-transparent border-b border-[rgba(0,0,0,0.12)] focus:border-[#2563EB] outline-none py-3 text-[16px] text-[#1D1D1F] transition-colors duration-300 w-full";

  return (
    <main className="relative min-h-screen" style={{ backgroundColor: "#F9F9F9" }}>
      <Navbar />

      {/* ════════ HERO — Globe + heading ════════ */}
      <div className="relative overflow-hidden" style={{ minHeight: "70vh" }}>
        {/* Accent gradient */}
        <div
          className="absolute left-0 right-0 top-0 pointer-events-none"
          style={{ height: "100%", background: "linear-gradient(to bottom, rgba(0, 102, 204, 0.15) 0%, rgba(0, 102, 204, 0.06) 60%, transparent 100%)", zIndex: 1 }}
          aria-hidden
        />

        {/* Globe — large, centered background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
          <div style={{ width: "min(700px, 90vw)", opacity: 0.5 }}>
            <WireframeGlobe className="w-full h-auto" />
          </div>
        </div>

        {/* Heading overlaid on globe */}
        <div ref={hero.ref} className="relative z-10 flex flex-col items-center justify-center text-center px-8 md:px-10" style={{ minHeight: "70vh" }}>
          <h1
            className="font-light leading-[1.15] text-[#0A1344] text-[39px] md:text-[49px] lg:text-[61px]"
            style={{ letterSpacing: "-0.02em", ...hero.anim(0) }}
          >
            Get in touch.
          </h1>
          <p
            className="mt-4 text-[16px] md:text-[20px] leading-[1.5]"
            style={{ color: "rgba(10, 19, 68, 0.45)", letterSpacing: "-0.015em", fontWeight: 400, ...hero.anim(100) }}
          >
            Let&apos;s start your journey.
          </p>
        </div>

        {/* Bottom fade into cards */}
        <div className="absolute left-0 right-0 bottom-0 pointer-events-none" style={{ height: 120, background: "linear-gradient(to bottom, transparent, #F9F9F9)", zIndex: 2 }} aria-hidden />
      </div>

      {/* ════════ STACKED CARDS ════════ */}
      <div className="relative z-10 -mt-8">

        {/* Card 1: Contact Sales (default open) */}
        <ContactCard
          label="Contact Sales"
          defaultOpen
          icon={
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M2 4h16v12H2z" stroke="currentColor" strokeWidth="1.2" />
              <path d="M2 4l8 7 8-7" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          }
        >
          <form className="flex flex-col gap-6" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <label className="flex flex-col gap-1">
                <span className="text-[14px] text-[#1D1D1F]">First name<span className="text-[#2563EB]">*</span></span>
                <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} className={inputClass} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[14px] text-[#1D1D1F]">Last name<span className="text-[#2563EB]">*</span></span>
                <input type="text" name="lastName" required value={form.lastName} onChange={handleChange} className={inputClass} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[14px] text-[#1D1D1F]">Email<span className="text-[#2563EB]">*</span></span>
                <input type="email" name="email" required value={form.email} onChange={handleChange} className={inputClass} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[14px] text-[#1D1D1F]">Role<span className="text-[#2563EB]">*</span></span>
                <input type="text" name="role" required value={form.role} onChange={handleChange} className={inputClass} />
              </label>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-[14px] text-[#1D1D1F]">Tell us about your project.<span className="text-[#2563EB]">*</span></span>
              <textarea
                name="message" required maxLength={500} rows={4} value={form.message} onChange={handleChange}
                placeholder="Please share your objectives and any specific requirements."
                className="bg-transparent border border-[rgba(0,0,0,0.08)] focus:border-[#2563EB] outline-none p-4 text-[15px] text-[#1D1D1F] placeholder:text-[rgba(0,0,0,0.25)] transition-colors duration-300 resize-y mt-1"
              />
              <span className="text-[13px] text-right" style={{ color: "rgba(0,0,0,0.3)" }}>{charCount}/500</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={updates} onChange={e => setUpdates(e.target.checked)} className="mt-1 w-4 h-4 accent-[#2563EB]" />
              <span className="text-[14px] leading-[1.5] text-[#1D1D1F]">I want to receive updates about new features and products from Columbus Earth.</span>
            </label>
            <p className="text-[13px] leading-[1.5]" style={{ color: "rgba(0,0,0,0.35)" }}>
              By submitting this form, you agree with our <Link href="/terms" className="underline">Terms of Service</Link>. We process your data in accordance with our <Link href="/privacy" className="underline">Privacy Policy</Link>.
            </p>
            <button
              type="submit"
              className="group flex items-center justify-between leading-none hover:opacity-90 transition-opacity self-start"
              style={{ height: 36, paddingLeft: 20, paddingRight: 16, fontSize: 15, fontWeight: 500, backgroundColor: "#000000", color: "white" }}
            >
              <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Submit</span>
              <svg className="ml-4 transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1l5 5-5 5" />
              </svg>
            </button>
          </form>
        </ContactCard>

        {/* Card 2: Support */}
        <ContactCard
          label="Support"
          icon={
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.2" />
              <line x1="10" y1="1" x2="10" y2="4" stroke="currentColor" strokeWidth="1.2" />
              <line x1="10" y1="16" x2="10" y2="19" stroke="currentColor" strokeWidth="1.2" />
              <line x1="1" y1="10" x2="4" y2="10" stroke="currentColor" strokeWidth="1.2" />
              <line x1="16" y1="10" x2="19" y2="10" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          }
        >
          <ul className="space-y-3 text-[16px] leading-[1.6] text-[#1D1D1F]">
            <li>• Visit our <Link href="/help" className="underline hover:opacity-70 transition-opacity">Help center</Link></li>
            <li>• <Link href="/login" className="underline hover:opacity-70 transition-opacity">Login</Link> to chat with support</li>
            <li>• Join our <Link href="https://discord.gg/columbus" className="underline hover:opacity-70 transition-opacity">Discord</Link> for community support</li>
          </ul>
        </ContactCard>

        {/* Card 3: Careers */}
        <ContactCard
          label="Careers"
          icon={
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.2" />
              <path d="M10 5v5l3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          }
        >
          <p className="text-[16px] leading-[1.6] text-[#1D1D1F] mb-4">
            If you&apos;re excited about creating paradigm shifts in physical world understanding. Join us now.
          </p>
          <Link href="/careers" className="text-[15px] font-medium text-[#1D1D1F] underline hover:opacity-70 transition-opacity">
            View open positions →
          </Link>
        </ContactCard>

        {/* Card 4: Press & Investment */}
        <ContactCard
          label="Careers & investment queries"
          icon={
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M3 17V7l7-5 7 5v10H3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M8 17v-5h4v5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          }
        >
          <p className="text-[16px] leading-[1.6] text-[#1D1D1F] mb-2">
            For partnership, investment, or general business inquiries.
          </p>
          <a href="mailto:invest@columbus.earth" className="text-[15px] font-medium text-[#1D1D1F] underline hover:opacity-70 transition-opacity">
            invest@columbus.earth →
          </a>
          <p className="text-[16px] leading-[1.6] text-[#1D1D1F] mt-4 mb-2">
            Press and events
          </p>
          <a href="mailto:press@columbus.earth" className="text-[15px] font-medium text-[#1D1D1F] underline hover:opacity-70 transition-opacity">
            press@columbus.earth →
          </a>
        </ContactCard>

      </div>

      <Footer />
    </main>
  );
}
