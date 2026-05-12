"use client";

import { useEffect, useState } from "react";

// MistX-style sticky nav for the route. Matches MistX --nav-height (72px on
// mobile, 100px desktop) and the white-backdrop slide-down past 80px scroll
// described in design-system §8.8.
export function MistxNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
      style={{
        height: "var(--mistx-nav-height, 72px)",
        background: scrolled ? "#F1F5FE" : "transparent",
        borderBottom: scrolled ? "1px solid #C7D7F8" : "1px solid transparent",
      }}
    >
      <div className="mistx-container h-full flex items-center justify-between">
        <a
          href="/"
          className="text-base font-medium tracking-tight"
          style={{ color: "#1f1f1f" }}
        >
          Columbus
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {[
            ["Problem", "#columbus-showcase"],
            ["Features", "#solutions"],
            ["Prompts", "#trust"],
            ["Demo", "#cta"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-sm transition-colors"
              style={{ color: "rgba(31,31,31,0.65)" }}
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          href="#cta"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm transition-colors"
          style={{
            background: "#1f1f1f",
            color: "#ffffff",
            borderRadius: 7,
          }}
        >
          Talk to founders
        </a>
      </div>
    </header>
  );
}
