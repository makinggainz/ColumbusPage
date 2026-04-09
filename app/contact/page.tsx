"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const IslandScene = dynamic(() => import("@/components/contact/IslandScene"), { ssr: false });

type Phase = "writing" | "fading" | "rolling" | "bottling" | "floating" | "done";

export default function ContactPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", role: "", message: "" });
  const [phase, setPhase] = useState<Phase>("writing");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setPhase("fading");
  };

  // Phase timer chain
  useEffect(() => {
    if (phase === "fading") { const t = setTimeout(() => setPhase("rolling"), 600); return () => clearTimeout(t); }
    if (phase === "rolling") { const t = setTimeout(() => setPhase("bottling"), 800); return () => clearTimeout(t); }
    if (phase === "bottling") { const t = setTimeout(() => setPhase("floating"), 700); return () => clearTimeout(t); }
    if (phase === "floating") { const t = setTimeout(() => setPhase("done"), 1200); return () => clearTimeout(t); }
  }, [phase]);

  const inputClass = "bg-transparent border-b border-[rgba(140,120,80,0.25)] focus:border-[#8a7a5a] outline-none py-2 text-[16px] text-[#3a3020] transition-colors duration-300 w-full";

  return (
    <main className="relative min-h-screen">
      <style>{`
        @keyframes noteAppear {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bottleFadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes floatAway {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(200px) scale(0.3); }
        }
        @keyframes confirmFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Underwater scene background */}
      <IslandScene />

      <Navbar />

      {/* Content */}
      <div className="relative z-10">

        {/* Heading */}
        <div className="pt-36 md:pt-44 pb-6 md:pb-10 px-8 md:px-10 text-center">
          <h1
            className="font-light leading-[1.15] text-[#0A1344] text-[36px] md:text-[46px] lg:text-[56px]"
            style={{ letterSpacing: "-0.02em", fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Send us a message in a bottle.
          </h1>
          <p
            className="mt-4 text-[16px] md:text-[18px]"
            style={{ color: "rgba(58, 48, 32, 0.55)", fontFamily: "Georgia, serif", fontStyle: "italic" }}
          >
            Write your note, seal it, and send it to sea.
          </p>
        </div>

        {/* Note card / animation area */}
        <div className="flex justify-center px-5 md:px-10 pb-20 md:pb-32">
          <div className="w-full max-w-[600px]">

            {/* ── Phase: Writing (the form) ── */}
            {phase === "writing" && (
              <div
                style={{
                  backgroundColor: "#faf5eb",
                  border: "1px solid rgba(160,140,100,0.2)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                  padding: "40px 36px",
                  animation: "noteAppear 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 18, color: "#8a7a5a", marginBottom: 28 }}>
                  Dear Columbus Team,
                </p>

                <form className="flex flex-col gap-5" onSubmit={handleSend}>
                  <div className="grid grid-cols-2 gap-5">
                    <label className="flex flex-col gap-1">
                      <span className="text-[13px]" style={{ color: "#8a7a5a", fontFamily: "Georgia, serif" }}>First name</span>
                      <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} className={inputClass} />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-[13px]" style={{ color: "#8a7a5a", fontFamily: "Georgia, serif" }}>Last name</span>
                      <input type="text" name="lastName" required value={form.lastName} onChange={handleChange} className={inputClass} />
                    </label>
                  </div>

                  <label className="flex flex-col gap-1">
                    <span className="text-[13px]" style={{ color: "#8a7a5a", fontFamily: "Georgia, serif" }}>Email</span>
                    <input type="email" name="email" required value={form.email} onChange={handleChange} className={inputClass} />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-[13px]" style={{ color: "#8a7a5a", fontFamily: "Georgia, serif" }}>Role</span>
                    <input type="text" name="role" required value={form.role} onChange={handleChange} className={inputClass} />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-[13px]" style={{ color: "#8a7a5a", fontFamily: "Georgia, serif" }}>Your message</span>
                    <textarea
                      name="message" required rows={4} value={form.message} onChange={handleChange}
                      placeholder="Tell us about your project..."
                      className="bg-transparent border border-[rgba(140,120,80,0.15)] focus:border-[#8a7a5a] outline-none p-3 text-[15px] text-[#3a3020] placeholder:text-[rgba(140,120,80,0.35)] transition-colors duration-300 resize-y mt-1"
                    />
                  </label>

                  <p className="text-[12px]" style={{ color: "rgba(138,122,90,0.5)", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                    By sending, you agree with our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                  </p>

                  <button
                    type="submit"
                    className="self-end flex items-center gap-3 hover:opacity-90 transition-opacity"
                    style={{
                      height: 40, paddingLeft: 24, paddingRight: 20,
                      backgroundColor: "#0A1344", color: "white",
                      fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 500,
                    }}
                  >
                    Send to sea
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round">
                      <path d="M1 13L13 1M13 1H4M13 1V10" />
                    </svg>
                  </button>
                </form>
              </div>
            )}

            {/* ── Phase: Fading (fields disappear, message remains) ── */}
            {phase === "fading" && (
              <div
                style={{
                  backgroundColor: "#faf5eb",
                  border: "1px solid rgba(160,140,100,0.2)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                  padding: "40px 36px",
                  transition: "all 0.5s ease",
                }}
              >
                <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 18, color: "#8a7a5a", marginBottom: 12 }}>
                  Dear Columbus Team,
                </p>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#3a3020", lineHeight: 1.6 }}>
                  {form.message || "..."}
                </p>
                <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 14, color: "#8a7a5a", marginTop: 16, textAlign: "right" }}>
                  — {form.firstName || "A fellow explorer"}
                </p>
              </div>
            )}

            {/* ── Phase: Rolling (note shrinks to a strip) ── */}
            {phase === "rolling" && (
              <div
                style={{
                  backgroundColor: "#faf5eb",
                  border: "1px solid rgba(160,140,100,0.2)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                  padding: "12px 36px",
                  height: 40,
                  overflow: "hidden",
                  transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 20,
                }}
              >
                <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 13, color: "#8a7a5a", whiteSpace: "nowrap" }}>
                  ✉ Your message
                </p>
              </div>
            )}

            {/* ── Phase: Bottling (SVG bottle wraps around the note) ── */}
            {phase === "bottling" && (
              <div className="flex justify-center" style={{ animation: "bottleFadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}>
                <svg width="200" height="80" viewBox="0 0 200 80" fill="none">
                  {/* Bottle body */}
                  <ellipse cx="90" cy="40" rx="70" ry="22" stroke="rgba(90,80,180,0.35)" strokeWidth="1.5" />
                  {/* Neck */}
                  <line x1="160" y1="30" x2="175" y2="30" stroke="rgba(90,80,180,0.35)" strokeWidth="1.5" />
                  <line x1="160" y1="50" x2="175" y2="50" stroke="rgba(90,80,180,0.35)" strokeWidth="1.5" />
                  {/* Cork */}
                  <rect x="175" y="27" width="15" height="26" rx="4" stroke="rgba(160,130,80,0.5)" strokeWidth="1.5" fill="rgba(160,130,80,0.1)" />
                  {/* Scroll inside */}
                  <line x1="40" y1="35" x2="140" y2="35" stroke="rgba(180,160,120,0.45)" strokeWidth="1" />
                  <line x1="40" y1="40" x2="140" y2="40" stroke="rgba(180,160,120,0.45)" strokeWidth="1" />
                  <line x1="40" y1="45" x2="140" y2="45" stroke="rgba(180,160,120,0.45)" strokeWidth="1" />
                  {/* Glass highlight */}
                  <line x1="50" y1="24" x2="130" y2="24" stroke="rgba(140,135,200,0.2)" strokeWidth="2" />
                </svg>
              </div>
            )}

            {/* ── Phase: Floating (bottle drops toward ocean) ── */}
            {phase === "floating" && (
              <div className="flex justify-center" style={{ animation: "floatAway 1.1s cubic-bezier(0.4, 0, 0.2, 1) forwards" }}>
                <svg width="200" height="80" viewBox="0 0 200 80" fill="none">
                  <ellipse cx="90" cy="40" rx="70" ry="22" stroke="rgba(90,80,180,0.35)" strokeWidth="1.5" />
                  <line x1="160" y1="30" x2="175" y2="30" stroke="rgba(90,80,180,0.35)" strokeWidth="1.5" />
                  <line x1="160" y1="50" x2="175" y2="50" stroke="rgba(90,80,180,0.35)" strokeWidth="1.5" />
                  <rect x="175" y="27" width="15" height="26" rx="4" stroke="rgba(160,130,80,0.5)" strokeWidth="1.5" fill="rgba(160,130,80,0.1)" />
                  <line x1="40" y1="35" x2="140" y2="35" stroke="rgba(180,160,120,0.45)" strokeWidth="1" />
                  <line x1="40" y1="40" x2="140" y2="40" stroke="rgba(180,160,120,0.45)" strokeWidth="1" />
                  <line x1="40" y1="45" x2="140" y2="45" stroke="rgba(180,160,120,0.45)" strokeWidth="1" />
                  <line x1="50" y1="24" x2="130" y2="24" stroke="rgba(140,135,200,0.2)" strokeWidth="2" />
                </svg>
              </div>
            )}

            {/* ── Phase: Done (confirmation message) ── */}
            {phase === "done" && (
              <div
                className="flex flex-col items-center text-center py-12"
                style={{ animation: "confirmFade 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }}
              >
                <p style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 600, color: "#3a3020", letterSpacing: "-0.02em", marginBottom: 12 }}>
                  Message sent.
                </p>
                <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 17, color: "#8a7a5a", lineHeight: 1.6, maxWidth: 400 }}>
                  Your bottle is on its way. Like all good things, it may take a little time — but we&apos;ll be in touch.
                </p>

                {/* Small bottle icon drifting */}
                <svg className="mt-8" width="60" height="30" viewBox="0 0 200 80" fill="none" style={{ opacity: 0.3 }}>
                  <ellipse cx="90" cy="40" rx="70" ry="22" stroke="rgba(90,80,180,0.5)" strokeWidth="2" />
                  <rect x="175" y="27" width="15" height="26" rx="4" stroke="rgba(160,130,80,0.5)" strokeWidth="2" />
                </svg>
              </div>
            )}

          </div>
        </div>

        <div style={{ mask: "linear-gradient(to bottom, transparent 0%, black 30%)", WebkitMask: "linear-gradient(to bottom, transparent 0%, black 30%)" }}>
          <Footer />
        </div>
      </div>
    </main>
  );
}
