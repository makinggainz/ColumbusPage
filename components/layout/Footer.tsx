"use client";

import { useState, useEffect, useRef } from "react";
import type { FC } from "react";
import Link from "next/link";
import { Mail, Linkedin } from "lucide-react";
import { BottleScene } from "@/components/layout/BottleScene";

export type FooterProps = {
  variant?: "default" | "compact";
  reveal?: boolean;
  theme?: "light" | "dark" | "light-blue" | "technology";
};

export const Footer: FC<FooterProps> = ({ variant = "default", reveal = false, theme = "light" }) => {
  const isLight = theme === "light" || theme === "light-blue" || theme === "technology";
  const isTech = theme === "technology";
  const bgColor = theme === "dark" ? "#000000" : theme === "light-blue" ? "#F4F3EB" : isTech ? "#FFFFFF" : "#F9F9F9";
  const [noteOpen, setNoteOpen] = useState(false);
  const [bottleOpened, setBottleOpened] = useState(false);
  const [previouslyOpened, setPreviouslyOpened] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  // Persist bottle state across pages via localStorage
  useEffect(() => {
    try {
      if (localStorage.getItem("bottle-opened") === "true") {
        setBottleOpened(true);
        setPreviouslyOpened(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setFooterVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
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
      data-navbar-theme={theme === "dark" ? "dark" : "light"}
      className={`overflow-hidden flex flex-col relative ${theme === "dark" ? "text-white" : isTech ? "text-[#0A1344]" : "text-[#1D1D1F]"} ${reveal ? "h-screen" : "min-h-screen"}`}
      style={{
        background: bgColor,
        cursor: !bottleOpened ? "default" : undefined,
        ...(reveal ? { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 0 } as React.CSSProperties : {}),
      }}
      onClick={() => {
        if (!bottleOpened && !previouslyOpened) {
          setNoteOpen(true);
          setBottleOpened(true);
          try { localStorage.setItem("bottle-opened", "true"); } catch {}
        }
      }}
    >
      {/* Mission text — top center, above the bottle */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-8 pt-24 pb-0 max-w-3xl mx-auto w-full"
        style={{ pointerEvents: bottleOpened ? "auto" : "none" }}
      >
        <p
          className="text-[15px] leading-relaxed mb-6"
          style={{
            color: theme === "dark" ? "rgba(255,255,255,0.5)" : isTech ? "rgba(10,19,68,0.6)" : "rgba(29,29,31,0.6)",
            opacity: bottleOpened ? 1 : 0,
            transform: bottleOpened ? "translateY(0)" : "translateY(10px)",
            transition: previouslyOpened ? "none" : "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: previouslyOpened ? "0ms" : bottleOpened ? "100ms" : "0ms",
          }}
        >
          We are a group of engineers, designers, and company builders developing
          foundation models and data collection innovations to power the
          geospatial intelligence systems of tomorrow.
        </p>
        <p
          className="text-[15px] leading-relaxed mb-12"
          style={{
            color: theme === "dark" ? "rgba(255,255,255,0.5)" : isTech ? "rgba(10,19,68,0.6)" : "rgba(29,29,31,0.6)",
            opacity: bottleOpened ? 1 : 0,
            transform: bottleOpened ? "translateY(0)" : "translateY(10px)",
            transition: previouslyOpened ? "none" : "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: previouslyOpened ? "0ms" : bottleOpened ? "250ms" : "0ms",
          }}
        >
          We&apos;re building foundation models that understand the physical world
          through geospatial reasoning. GeoContext-1 processes satellite imagery,
          terrain data, infrastructure networks, and temporal patterns to generate
          actionable intelligence across defence, climate, consumer and urban
          planning domains.
        </p>
      </div>

      {/* 3D Bottle scene */}
      <BottleScene onBottleClick={() => { if (!previouslyOpened) { setNoteOpen(true); } setBottleOpened(true); try { localStorage.setItem("bottle-opened", "true"); } catch {} }} visible={footerVisible} dark={theme === "dark"} bg={theme === "light-blue" ? "#F4F3EB" : isTech ? "#FFFFFF" : undefined} waveRgb={theme === "light-blue" || isTech ? "10,19,68" : undefined} alreadyOpened={previouslyOpened} />

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
        className="relative z-10 w-full mt-auto"
        style={{
          opacity: bottleOpened ? 1 : 0,
          transform: bottleOpened ? "translateY(0)" : "translateY(20px)",
          pointerEvents: bottleOpened ? "auto" : "none",
          transition: previouslyOpened ? "none" : "all 1000ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-8 pb-6 pt-12">
          <div className="flex items-start justify-between mb-12">
            <div
              style={{
                opacity: bottleOpened ? 1 : 0,
                transform: bottleOpened ? "translateY(0)" : "translateY(12px)",
                transition: previouslyOpened ? "none" : "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                transitionDelay: previouslyOpened ? "0ms" : bottleOpened ? "400ms" : "0ms",
              }}
            >
              <h3 className="text-[70px] font-semibold mb-3" style={{ color: '#091344' }}>Columbus Earth</h3>
              <p className={`text-[17.5px] leading-snug mb-4 max-w-[400px] ${theme === "dark" ? "text-white/50" : isTech ? "text-[#0A1344]/50" : "text-[#1D1D1F]/50"}`}>
                The frontier AI lab building the first production Universal Geospatial Model.
              </p>
              <div className="flex gap-4">
                <a href="mailto:contact@columbus.earth"><Mail size={18} className={`transition-colors ${theme === "dark" ? "text-white/40 hover:text-white" : isTech ? "text-[#0A1344]/40 hover:text-[#0066CC]" : "text-[#1D1D1F]/40 hover:text-[#1D1D1F]"}`} /></a>
                <a href="https://www.linkedin.com/company/columbusearth/about/" target="_blank" rel="noopener noreferrer"><Linkedin size={18} className={`transition-colors ${theme === "dark" ? "text-white/40 hover:text-white" : isTech ? "text-[#0A1344]/40 hover:text-[#0066CC]" : "text-[#1D1D1F]/40 hover:text-[#1D1D1F]"}`} /></a>
              </div>
            </div>
            <div className="flex gap-8 md:gap-12 mt-[30px]">
              {[
                <FooterColumn key="product" theme={theme} title="Product" links={[
                  { label: "Columbus Pro", href: "/products/enterprise" },
                  { label: "Elio", href: "/" },
                  { label: "Use Cases", href: "/use-cases" },
                ]} />,
                <FooterColumn key="technology" theme={theme} title="Technology" links={[
                  { label: "Foundation Model", href: "/technology" },
                  { label: "Timeline", href: "/technology" },
                  { label: "Research", href: "/technology" },
                  { label: "Results", href: "/technology" },
                  { label: "Blog", href: "/blog" },
                ]} />,
                <FooterColumn key="company" theme={theme} title="Company" links={[
                  { label: "Our mission", href: "/mission" },
                  { label: "Our vision", href: "/mission" },
                  { label: "Blog", href: "/blog" },
                ]} />,
              ].map((col, i) => (
                <div
                  key={i}
                  style={{
                    opacity: bottleOpened ? 1 : 0,
                    transform: bottleOpened ? "translateY(0)" : "translateY(12px)",
                    transition: previouslyOpened ? "none" : "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                    transitionDelay: previouslyOpened ? "0ms" : bottleOpened ? `${520 + i * 120}ms` : "0ms",
                  }}
                >
                  {col}
                </div>
              ))}
            </div>
          </div>
          <div
            className={`pt-4 pb-2 flex items-center justify-between text-[13px] ${theme === "dark" ? "text-white/30" : isTech ? "text-[#0A1344]/40" : "text-[#1D1D1F]/40"}`}
            style={{
              opacity: bottleOpened ? 1 : 0,
              transition: previouslyOpened ? "none" : "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDelay: previouslyOpened ? "0ms" : bottleOpened ? "900ms" : "0ms",
            }}
          >
            <span>Columbus Earth &copy; 2026</span>
            <div className="flex items-center gap-6">
              <span>Website made by hand, no AI.</span>
              <span>www.columbus.earth</span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

const FooterColumn = ({
  title,
  links,
  theme = "light",
}: {
  title: string;
  links: { label: string; href: string }[];
  theme?: "light" | "dark" | "light-blue" | "technology";
}) => {
  const isTech = theme === "technology";
  return (
    <div>
      <p className={`mb-4 font-medium text-[17.5px] tracking-wide ${theme === "dark" ? "text-white" : isTech ? "text-[#0A1344]" : "text-[#1D1D1F]"}`}>
        {title}
      </p>
      <ul className={`space-y-2 text-[17.5px] ${theme === "dark" ? "text-white/60" : isTech ? "text-[#0A1344]/60" : "text-[#1D1D1F]/60"}`}>
        {links.map((link, i) => (
          <li key={i}>
            <Link
              href={link.href}
              className={`cursor-pointer transition-colors ${theme === "dark" ? "hover:text-white" : isTech ? "hover:text-[#0066CC]" : "hover:text-[#0A1344]"}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
