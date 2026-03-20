"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Product",     href: "#" },
  { label: "Use Cases",   href: "/use-cases" },
  { label: "Technology",  href: "/technology" },
  { label: "Our Mission", href: "/our-mission" },
];

const mobileLinks = [
  { label: "Product",              href: "#" },
  { label: "Use Cases",            href: "/use-cases" },
  { label: "Technology",           href: "/technology" },
  { label: "Our Mission",          href: "/our-mission" },
  { label: "Columbus Market Spy",  href: "/market-spy" },
  { label: "MapsGPT",             href: "/maps-gpt" },
];

export const Navbar = ({ theme }: { theme?: "light" | "dark" } = {}) => {
  const [visible,   setVisible]   = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  // Fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Nav bar ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          height: 44,
          opacity:    visible ? 1 : 0,
          filter:     visible ? "blur(0px)" : "blur(6px)",
          transform:  visible ? "translateY(0)" : "translateY(-6px)",
          transition: "opacity 600ms ease, filter 600ms ease, transform 600ms ease",
          background: "rgba(251,251,253,0.8)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <div className="mx-auto w-full max-w-[1024px] px-4 md:px-6 h-full">
          <div className="flex h-full items-center justify-between">

            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="relative h-[18px] w-[18px] shrink-0">
                <Image
                  src="/logobueno.png"
                  alt="Columbus"
                  fill
                  sizes="18px"
                  className="object-contain"
                  priority
                />
              </div>
              <span
                className="leading-none"
                style={{
                  color: "#1D1D1F",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                Columbus
              </span>
            </Link>

            {/* Center: Desktop links */}
            <div className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-opacity duration-200"
                  style={{
                    color: "#1D1D1F",
                    fontSize: 12,
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    opacity: 0.8,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.8"; }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right: CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <Link
                href="/platform"
                className="hidden md:flex items-center justify-center rounded-full bg-[#0071E3] text-white hover:bg-[#0077ED] transition-colors"
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  paddingLeft: 14,
                  paddingRight: 14,
                  paddingTop: 4,
                  paddingBottom: 4,
                }}
              >
                Start Now
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative flex h-[44px] w-[44px] items-center justify-center md:hidden"
                aria-label="Toggle menu"
              >
                <span
                  className="absolute block h-px w-[15px] transition-all duration-300"
                  style={{
                    backgroundColor: "#1D1D1F",
                    transform: menuOpen ? "rotate(45deg)" : "translateY(-4px)",
                  }}
                />
                <span
                  className="absolute block h-px transition-all duration-200"
                  style={{
                    backgroundColor: "#1D1D1F",
                    width: menuOpen ? 0 : 15,
                    opacity: menuOpen ? 0 : 1,
                  }}
                />
                <span
                  className="absolute block h-px w-[15px] transition-all duration-300"
                  style={{
                    backgroundColor: "#1D1D1F",
                    transform: menuOpen ? "rotate(-45deg)" : "translateY(4px)",
                  }}
                />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ── Mobile full-screen menu ── */}
      <div
        className="fixed inset-0 z-40 flex flex-col md:hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          background: "#FFFFFF",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transform: menuOpen ? "translateY(0)" : "translateY(-12px)",
        }}
      >
        {/* Top bar to match nav height */}
        <div className="h-[44px] shrink-0" />

        {/* Links */}
        <div className="flex flex-col justify-center flex-1 px-12 gap-0">
          {mobileLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="transition-colors duration-200 py-3"
              style={{
                color: "#1D1D1F",
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "-0.015em",
                lineHeight: 1.2,
                borderBottom: "1px solid rgba(0,0,0,0.08)",
                transitionDelay: menuOpen ? `${i * 40}ms` : "0ms",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 400ms ease ${menuOpen ? i * 40 : 0}ms, transform 400ms ease ${menuOpen ? i * 40 : 0}ms, color 200ms ease`,
              }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/platform"
            onClick={() => setMenuOpen(false)}
            className="mt-10 flex items-center justify-center rounded-full bg-[#0071E3] text-white font-normal hover:bg-[#0077ED] transition-colors"
            style={{ fontSize: 17, height: 50 }}
          >
            Start Now
          </Link>
        </div>

        {/* Bottom: contact */}
        <div className="px-12 pb-12" style={{ color: "#6E6E73", fontSize: 12 }}>
          contact@columbus.earth
        </div>
      </div>
    </>
  );
};
