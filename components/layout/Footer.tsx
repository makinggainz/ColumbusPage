"use client";

import { useState, useEffect, useRef } from "react";
import type { FC } from "react";
import Link from "next/link";
import { Mail, Linkedin } from "lucide-react";
import { BottleScene } from "@/components/layout/BottleScene";

export type FooterProps = {
  variant?: "default" | "compact";
  reveal?: boolean;
  theme?: "light" | "dark";
};

export const Footer: FC<FooterProps> = ({ variant = "default", reveal = false }) => {
  const [noteOpen, setNoteOpen] = useState(false);
  const [bottleOpened, setBottleOpened] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setFooterVisible(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (variant === "compact") {
    return (
      <footer data-navbar-theme="light" className="relative bg-[#F5F5F7] border-t border-[rgba(0,0,0,0.08)] py-10">
        <div className="max-w-[980px] mx-auto px-6 flex flex-col items-center text-center gap-5">
          <p className="text-[12px] text-[#6E6E73] max-w-md leading-relaxed">
            The frontier AI lab building the first production Universal Geospatial Model.
          </p>
          <div className="flex gap-4">
            <Mail size={16} className="cursor-pointer text-[#6E6E73] hover:text-[#1D1D1F] transition-colors" />
            <Linkedin size={16} className="cursor-pointer text-[#6E6E73] hover:text-[#1D1D1F] transition-colors" />
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      ref={footerRef}
      data-footer
      data-navbar-theme="light"
      className={`text-[#1D1D1F] overflow-hidden flex flex-col relative ${reveal ? "h-screen" : "min-h-screen"}`}
      style={{
        background: "#F9F9F9",
        ...(reveal ? { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 0 } as React.CSSProperties : {}),
      }}
    >
      {/* Mission text — top center, above the bottle */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-8 pt-24 pb-0 max-w-3xl mx-auto w-full"
        style={{
          opacity: bottleOpened ? 1 : 0,
          transform: bottleOpened ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          pointerEvents: bottleOpened ? "auto" : "none",
        }}
      >
        <p className="text-[15px] leading-relaxed mb-6" style={{ color: "rgba(29,29,31,0.5)" }}>
          We are a group of engineers, designers, and company builders developing
          foundation models and data collection innovations to power the
          geospatial intelligence systems of tomorrow.
        </p>
        <p className="text-[15px] leading-relaxed mb-12" style={{ color: "rgba(29,29,31,0.5)" }}>
          We're building foundation models that understand the physical world
          through geospatial reasoning. GeoContext-1 processes satellite imagery,
          terrain data, infrastructure networks, and temporal patterns to generate
          actionable intelligence across defence, climate, consumer and urban
          planning domains.
        </p>

        <div className="flex flex-col items-center gap-8 w-full" style={{ fontSize: 18, fontWeight: 500 }}>
          <Link href="/our-mission" className="hover:opacity-60 transition-opacity text-[#1D1D1F]">[ Our Mission ]</Link>
          <div className="flex justify-between w-full max-w-xl" style={{ paddingLeft: 28 }}>
            <Link href="#" className="hover:opacity-60 transition-opacity text-[#1D1D1F]">[ Product ]</Link>
            <Link href="/technology" className="hover:opacity-60 transition-opacity text-[#1D1D1F]">[ Technology ]</Link>
            <Link href="/use-cases" className="hover:opacity-60 transition-opacity text-[#1D1D1F]">[ Use Cases ]</Link>
          </div>
        </div>
      </div>

      {/* 3D Bottle scene */}
      <BottleScene onBottleClick={() => { setNoteOpen(true); setBottleOpened(true); }} visible={footerVisible} />

      {/* Note overlay — appears when bottle is clicked */}
      {noteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setNoteOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative max-w-md w-full mx-6 p-10 text-center"
            style={{
              background: "#faf5eb",
              borderRadius: 4,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              border: "1px solid rgba(160,140,100,0.2)",
              animation: "noteAppear 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <p className="text-[15px] text-[#8a7a5a] italic mb-6" style={{ fontFamily: "Georgia, serif" }}>
              Dear Explorer,
            </p>
            <p className="text-[28px] font-semibold text-[#3a3020] leading-snug mb-4" style={{ fontFamily: "Georgia, serif" }}>
              Thank you for reaching the end.
            </p>
            <p className="text-[15px] text-[#8a7a5a] leading-relaxed mb-8" style={{ fontFamily: "Georgia, serif" }}>
              Like Columbus, the best discoveries come to those who venture further than the rest.
            </p>
            <button
              onClick={() => setNoteOpen(false)}
              className="text-[13px] text-[#8a7a5a] hover:text-[#3a3020] transition-colors tracking-wide"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Footer content — fades in after bottle is opened */}
      <div
        className="relative z-10 w-full mt-auto transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          opacity: bottleOpened ? 1 : 0,
          transform: bottleOpened ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-8 pb-6 pt-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 items-start mb-12">
            <div>
              <h3 className="text-[24px] font-semibold text-[#1D1D1F] mb-3">Columbus Earth</h3>
              <p className="text-[14px] text-[#1D1D1F]/50 leading-relaxed mb-4 max-w-[260px]">
                The frontier AI lab building the first production Universal Geospatial Model.
              </p>
              <div className="flex gap-4">
                <a href="mailto:contact@columbus.earth"><Mail size={18} className="text-[#1D1D1F]/40 hover:text-[#1D1D1F] transition-colors" /></a>
                <a href="https://www.linkedin.com/company/columbusearth/about/" target="_blank" rel="noopener noreferrer"><Linkedin size={18} className="text-[#1D1D1F]/40 hover:text-[#1D1D1F] transition-colors" /></a>
              </div>
            </div>
            <FooterColumn title="Product" links={[
              { label: "Columbus Pro", href: "/platform" },
              { label: "Use Cases", href: "/use-cases" },
              { label: "MapsGPT", href: "/maps-gpt" },
            ]} />
            <FooterColumn title="Technology" links={[
              { label: "LGM vs LLM", href: "/technology" },
              { label: "Data Collection", href: "/technology" },
              { label: "Core Reasoning", href: "/technology" },
            ]} />
            <FooterColumn title="Company" links={[
              { label: "Our Mission", href: "/our-mission" },
              { label: "Careers", href: "/" },
              { label: "Legal", href: "/" },
            ]} />
          </div>
          <div className="border-t border-[#1D1D1F]/10 pt-4 pb-2 flex items-center justify-between text-[13px] text-[#1D1D1F]/30">
            <span>Columbus Earth &copy; 2026</span>
            <span>www.columbus.earth</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) => (
  <div>
    <p className="mb-4 text-[#1D1D1F] font-medium text-[17.5px] tracking-wide">
      {title}
    </p>
    <ul className="space-y-2 text-[17.5px] text-[#1D1D1F]/60">
      {links.map((link, i) => (
        <li key={i}>
          <Link
            href={link.href}
            className="hover:text-[#0A1344] cursor-pointer transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
