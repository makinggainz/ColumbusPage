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
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          height: 64,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 600ms ease, transform 600ms ease, background 400ms ease, border-color 400ms ease",
          background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.08)" : "1px solid transparent",
        }}
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10 h-full">
          <div className="flex h-full items-center justify-between">

            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div
                className="relative h-[32px] w-[32px] shrink-0"
              >
                <Image
                  src="/logobueno.png"
                  alt="Columbus"
                  fill
                  sizes="32px"
                  className="object-contain"
                  priority
                />
              </div>
              <span
                className="leading-none text-[#1D1D1F]"
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                Columbus
              </span>
            </Link>

            {/* Center: Desktop links */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#1D1D1F]/50 hover:text-[#1D1D1F] transition-colors duration-200"
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    letterSpacing: "0.01em",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right: CTA + Hamburger */}
            <div className="flex items-center gap-4">
              <Link
                href="/platform"
                className="hidden md:flex items-center justify-center text-[#1D1D1F] hover:bg-[#1D1D1F] hover:text-white transition-all duration-300"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 8,
                  paddingBottom: 8,
                  borderRadius: 100,
                  border: "1px solid rgba(0,0,0,0.2)",
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
                  className="absolute block h-[1.5px] w-[20px] bg-[#1D1D1F] transition-all duration-300"
                  style={{
                    transform: menuOpen ? "rotate(45deg)" : "translateY(-5px)",
                  }}
                />
                <span
                  className="absolute block h-[1.5px] bg-[#1D1D1F] transition-all duration-200"
                  style={{
                    width: menuOpen ? 0 : 20,
                    opacity: menuOpen ? 0 : 1,
                  }}
                />
                <span
                  className="absolute block h-[1.5px] w-[20px] bg-[#1D1D1F] transition-all duration-300"
                  style={{
                    transform: menuOpen ? "rotate(-45deg)" : "translateY(5px)",
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
          background: "#000000",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transform: menuOpen ? "translateY(0)" : "translateY(-12px)",
        }}
      >
        <div className="h-[64px] shrink-0" />

        <div className="flex flex-col justify-center flex-1 px-8 gap-0">
          {mobileLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-4"
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 32,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 400ms ease ${menuOpen ? i * 50 : 0}ms, transform 400ms ease ${menuOpen ? i * 50 : 0}ms`,
              }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/platform"
            onClick={() => setMenuOpen(false)}
            className="mt-10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
            style={{
              fontSize: 16,
              fontWeight: 500,
              height: 52,
              borderRadius: 100,
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            Start Now
          </Link>
        </div>

        <div className="px-8 pb-10" style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
          contact@columbus.earth
        </div>
      </div>
    </>
  );
};
