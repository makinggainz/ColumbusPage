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
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  // Fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
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
          opacity:    visible ? 1 : 0,
          filter:     visible ? "blur(0px)" : "blur(6px)",
          transform:  visible ? "translateY(0)" : "translateY(-6px)",
          transition: "opacity 600ms ease, filter 600ms ease, transform 600ms ease, background 300ms ease, border-color 300ms ease",
          background:  scrolled ? "#FFFFFF" : "transparent",
          borderBottom: scrolled
            ? "1px solid #E4E4E7"
            : "1px solid transparent",
        }}
      >
        <div className="mx-auto w-full max-w-screen-xl px-6 md:px-10">
          <div className="flex h-14 items-center justify-between">

            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="relative h-7 w-7 shrink-0">
                <Image
                  src="/logobueno.png"
                  alt="Columbus"
                  fill
                  sizes="28px"
                  className="object-contain"
                  priority
                />
              </div>
              <span
                className="text-[#09090B] font-medium leading-none"
                style={{ fontSize: "15px", letterSpacing: "-0.01em" }}
              >
                Columbus Earth
              </span>
            </Link>

            {/* Center: Desktop links */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#71717A] hover:text-[#09090B] transition-colors duration-200"
                  style={{ fontSize: "14px", fontWeight: 400, letterSpacing: "-0.005em" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right: CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <Link
                href="/platform"
                className="hidden md:flex items-center justify-center h-11 px-6 bg-[#09090B] text-white text-sm font-medium hover:bg-[#09090B]/90 transition-colors"
              >
                Start Now
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative flex h-9 w-9 items-center justify-center md:hidden"
                aria-label="Toggle menu"
              >
                <span
                  className="absolute block h-px w-5 bg-[#09090B] transition-all duration-300"
                  style={{
                    transform: menuOpen ? "rotate(45deg)" : "translateY(-5px)",
                    opacity: 1,
                  }}
                />
                <span
                  className="absolute block h-px bg-[#09090B] transition-all duration-200"
                  style={{
                    width: menuOpen ? 0 : 20,
                    opacity: menuOpen ? 0 : 1,
                  }}
                />
                <span
                  className="absolute block h-px w-5 bg-[#09090B] transition-all duration-300"
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
          background: "#FFFFFF",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transform: menuOpen ? "translateY(0)" : "translateY(-12px)",
        }}
      >
        {/* Top bar to match nav height */}
        <div className="h-14 shrink-0" />

        {/* Links */}
        <div className="flex flex-col justify-center flex-1 px-8 gap-1">
          {mobileLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-[#71717A] hover:text-[#09090B] transition-colors duration-200 py-4 border-b border-[#E4E4E7]"
              style={{
                fontSize: "clamp(22px, 5vw, 30px)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                transitionDelay: menuOpen ? `${i * 40}ms` : "0ms",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 400ms ease ${i * 40}ms, transform 400ms ease ${i * 40}ms, color 200ms ease`,
              }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/platform"
            onClick={() => setMenuOpen(false)}
            className="mt-8 flex items-center justify-center h-12 bg-[#09090B] text-white font-medium hover:bg-[#09090B]/90 transition-colors"
            style={{ fontSize: "15px" }}
          >
            Start Now
          </Link>
        </div>

        {/* Bottom: contact */}
        <div className="px-8 pb-12 text-[#A1A1AA]" style={{ fontSize: "13px" }}>
          contact@columbus.earth
        </div>
      </div>
    </>
  );
};
