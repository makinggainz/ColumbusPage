"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

import { ScrambleText } from "@/components/ui/ScrambleText";

const COMPACT_THRESHOLD = 80;

const PRODUCTS = [
  {
    name: "MapsGPT",
    tagline: "Your AI guide for travel & local exploration",
    href: "/products",
    accent: "#59E1EB",
  },
  {
    name: "Columbus Enterprise",
    tagline: "Geospatial intelligence for organizations",
    href: "/enterprise",
    accent: "#818CF8",
  },
  {
    name: "Market Spy",
    tagline: "Real estate analytics, AI‑powered",
    href: "/market-spy",
    accent: "#34D399",
  },
];

const COMPANY_LINKS = [
  { label: "Our Mission", href: "/our-mission" },
  { label: "Technology",  href: "/technology"  },
  { label: "Use Cases",   href: "/use-cases"   },
  { label: "Research",    href: "/research"    },
  { label: "Careers",     href: "/careers"     },
];

// ── Shared dropdown markup ────────────────────────────────────────────────────
function DropdownContent({
  isOpen,
  isDark,
  onClose,
}: {
  isOpen: boolean;
  isDark?: boolean;
  onClose: () => void;
}) {
  const t = {
    label:       isDark ? "text-white/40"  : "text-black/35",
    name:        isDark ? "text-white"      : "text-[#111]",
    tagline:     isDark ? "text-white/50"  : "text-black/45",
    hoverRow:    isDark ? "hover:bg-white/[0.07]" : "hover:bg-black/[0.06]",
    ring:        isDark ? "ring-white/15"  : "ring-black/10",
    arrow:       isDark ? "text-white/30 group-hover:text-white/65" : "text-black/20 group-hover:text-black/55",
    divider:     isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)",
    link:        isDark ? "text-white/65 hover:text-white" : "text-black/60 hover:text-black",
    linkArrow:   isDark ? "text-white/20 group-hover:text-white/50" : "text-black/15 group-hover:text-black/45",
    borderTop:   isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
    sublabel:    isDark ? "text-white/35"  : "text-black/30",
    sublink:     isDark ? "text-white/60 hover:text-white" : "text-black/55 hover:text-black",
  };

  return (
    <div className="px-10 pt-9 pb-10">
      <div className="grid grid-cols-12 gap-10">

        {/* ── Left: Products ──────────────────────────────────────────── */}
        <div className="col-span-7">
          <p className={`text-[10px] font-semibold tracking-[0.16em] uppercase ${t.label} mb-7`}>
            <ScrambleText text="PRODUCTS" isActive={isOpen} delay={180} />
          </p>

          <div className="space-y-1">
            {PRODUCTS.map((p, i) => (
              <Link
                key={p.href}
                href={p.href}
                onClick={onClose}
                className={`group flex items-center gap-5 rounded-sm px-4 py-3.5 transition-colors duration-200 ${t.hoverRow}`}
                style={{
                  opacity:    isOpen ? 1 : 0,
                  transform:  isOpen ? "translateY(0)" : "translateY(10px)",
                  transition: `opacity 0.45s ease-out ${200 + i * 70}ms, transform 0.45s ease-out ${200 + i * 70}ms, background-color 0.2s`,
                }}
              >
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ring-[3px] ${t.ring}`}
                  style={{ backgroundColor: p.accent }}
                />
                <div className="flex-1 min-w-0">
                  <span className={`${t.name} font-semibold text-[15px] leading-none`}>
                    {p.name}
                  </span>
                  <p className={`${t.tagline} text-[13px] mt-1 leading-snug`}>
                    {p.tagline}
                  </p>
                </div>
                <span className={`${t.arrow} text-sm transition-colors duration-200 shrink-0`}>
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────────────────── */}
        <div className="col-span-1 flex justify-center">
          <div
            className="w-px self-stretch"
            style={{
              background: `linear-gradient(to bottom, transparent, ${t.divider} 20%, ${t.divider} 80%, transparent)`,
              opacity: isOpen ? 1 : 0,
              transition: `opacity 0.5s ease-out 300ms`,
            }}
          />
        </div>

        {/* ── Right: Company + Contact ────────────────────────────────── */}
        <div className="col-span-4 flex flex-col justify-between min-h-0">

          <div>
            <p className={`text-[10px] font-semibold tracking-[0.16em] uppercase ${t.label} mb-7`}>
              <ScrambleText text="COMPANY" isActive={isOpen} delay={280} />
            </p>
            <ul className="space-y-1">
              {COMPANY_LINKS.map((item, i) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center justify-between py-2 text-[15px] font-medium ${t.link} transition-colors duration-200`}
                    style={{
                      opacity:    isOpen ? 1 : 0,
                      transform:  isOpen ? "translateY(0)" : "translateY(8px)",
                      transition: `opacity 0.45s ease-out ${260 + i * 55}ms, transform 0.45s ease-out ${260 + i * 55}ms, color 0.2s`,
                    }}
                  >
                    <span>{item.label}</span>
                    <span className={`${t.linkArrow} transition-colors duration-200 text-xs`}>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="mt-8 pt-6 grid grid-cols-2 gap-6"
            style={{
              borderTop: `1px solid ${t.borderTop}`,
              opacity:    isOpen ? 1 : 0,
              transition: `opacity 0.5s ease-out 500ms`,
            }}
          >
            <div>
              <p className={`text-[10px] tracking-widest uppercase ${t.sublabel} mb-2`}>Contact</p>
              <a href="mailto:contact@columbus.earth" className={`${t.sublink} text-[13px] transition-colors duration-200 block`}>
                contact@columbus.earth
              </a>
            </div>
            <div>
              <p className={`text-[10px] tracking-widest uppercase ${t.sublabel} mb-2`}>Social</p>
              <a
                href="https://www.linkedin.com/company/columbusearth/about/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className={`${t.sublink} text-[13px] transition-colors duration-200 block`}
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isManuallyToggled, setIsManuallyToggled] = useState(false);
    const [isScrolled, setIsScrolled] = useState(() =>
        typeof window !== "undefined" ? window.scrollY > 0 : false
    );
    const [isNavHovered, setIsNavHovered] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const navRef = useRef<HTMLElement>(null);

    const [isCompactMenuOpen, setIsCompactMenuOpen] = useState(false);
    const [isCompactManuallyToggled, setIsCompactManuallyToggled] = useState(false);
    const [isCompactVisible, setIsCompactVisible] = useState(() =>
        typeof window !== "undefined" ? window.scrollY > COMPACT_THRESHOLD : false
    );
    const compactNavRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            setIsScrolled(y > 0);
            setIsCompactVisible(y > COMPACT_THRESHOLD);
            setIsScrolling(true);
            if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
            scrollTimerRef.current = setTimeout(() => setIsScrolling(false), 150);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!navRef.current) return;
            const navBounds = navRef.current.getBoundingClientRect();
            if (e.clientY > navBounds.bottom && isMenuOpen && isManuallyToggled) {
                setIsMenuOpen(false);
                setIsManuallyToggled(false);
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isMenuOpen, isManuallyToggled]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!compactNavRef.current) return;
            const navBounds = compactNavRef.current.getBoundingClientRect();
            if (e.clientY > navBounds.bottom && isCompactMenuOpen && isCompactManuallyToggled) {
                setIsCompactMenuOpen(false);
                setIsCompactManuallyToggled(false);
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isCompactMenuOpen, isCompactManuallyToggled]);

    // ── Primary nav handlers ──────────────────────────────────────────
    const handleMouseEnter = () => {
        if (!isManuallyToggled) setIsMenuOpen(true);
    };
    const handleMouseLeave = (e: React.MouseEvent) => {
        setIsNavHovered(false);
        if (isManuallyToggled) return;
        const navBounds = navRef.current?.getBoundingClientRect();
        if (!navBounds) return;
        if (e.clientY <= navBounds.top) return;
        setIsMenuOpen(false);
    };
    const handleHamburgerClick = () => {
        setIsManuallyToggled(true);
        setIsMenuOpen(!isMenuOpen);
    };
    const handleNavMouseEnter = () => {
        if (isManuallyToggled && !isMenuOpen) setIsManuallyToggled(false);
        handleMouseEnter();
    };

    // ── Compact nav handlers ──────────────────────────────────────────
    const handleCompactMouseEnter = () => {
        if (!isCompactManuallyToggled) setIsCompactMenuOpen(true);
    };
    const handleCompactMouseLeave = (e: React.MouseEvent) => {
        if (isCompactManuallyToggled) return;
        const navBounds = compactNavRef.current?.getBoundingClientRect();
        if (!navBounds) return;
        if (e.clientY <= navBounds.top) return;
        setIsCompactMenuOpen(false);
    };
    const handleCompactHamburgerClick = () => {
        setIsCompactManuallyToggled(true);
        setIsCompactMenuOpen(!isCompactMenuOpen);
    };
    const handleCompactNavMouseEnter = () => {
        if (isCompactManuallyToggled && !isCompactMenuOpen) setIsCompactManuallyToggled(false);
        handleCompactMouseEnter();
    };

    // ── Blend styles — invert by default, white when menu open ──────
    const navBlendStyle: React.CSSProperties = isMenuOpen
        ? { color: "white" }
        : { mixBlendMode: "difference", color: "white" };

    const compactNavBlendStyle: React.CSSProperties = isCompactMenuOpen
        ? { color: "white" }
        : { mixBlendMode: "difference", color: "white" };

    return (
        <>
            {/* ── Backdrop: primary nav ── */}
            <div
                className={`fixed inset-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isMenuOpen
                        ? "opacity-100 backdrop-blur-md bg-black/10"
                        : "opacity-0 pointer-events-none"
                }`}
            />

            {/* ══════════════ PRIMARY NAVBAR ══════════════ */}
            <nav
                ref={navRef}
                className="header-font absolute top-6 left-0 right-0 z-50"
                style={navBlendStyle}
                onMouseEnter={() => setIsNavHovered(true)}
                onMouseLeave={handleMouseLeave}
            >
                <div className="relative mx-auto w-full max-w-screen-2xl">
                    {/* Nav bar background pill — transparent by default, blur on hover */}
                    <div
                        className={`absolute inset-y-0 left-(--container-padding) right-(--container-padding) transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isMenuOpen ? "rounded-tl-xs rounded-tr-xs" : "rounded-xs"
                        }`}
                        style={{
                            background: isMenuOpen ? "rgba(10, 12, 22, 0.52)" : "transparent",
                            backdropFilter: (isNavHovered || isMenuOpen || isScrolling) ? "blur(40px)" : "none",
                            WebkitBackdropFilter: (isNavHovered || isMenuOpen || isScrolling) ? "blur(40px)" : "none",
                        }}
                    />

                    <div className="relative px-[calc(var(--container-padding)+18px)]">
                        <div className="grid h-14 md:h-17 grid-cols-[1fr_auto_1fr] items-center">
                            {/* Left: Logo */}
                            <Link href="/" className="flex w-fit shrink-0 items-center gap-2" onMouseEnter={handleNavMouseEnter}>
                                <div
                                    className="relative h-10 w-10 shrink-0"
                                    style={isMenuOpen ? { filter: "brightness(0) invert(1)" } : {}}
                                >
                                    <Image
                                        src="/logobueno.png"
                                        alt="Columbus Logo"
                                        fill
                                        sizes="40px"
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                                <span className="brand-wordmark text-2xl font-medium leading-none tracking-tight">
                                    Columbus Earth
                                </span>
                            </Link>

                            {/* Center: Navigation Links */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className={`hidden items-center gap-9 min-[1155px]:flex pointer-events-auto transition-opacity duration-300 ${!isScrolled && !isMenuOpen ? "opacity-70" : ""}`}>
                                    <Link href="#" className="group relative text-md font-medium transition-opacity duration-300 hover:opacity-70" onMouseEnter={handleNavMouseEnter}>
                                        Product
                                        <span className="absolute left-0 -bottom-1 h-px w-0 transition-all duration-300 group-hover:w-full bg-current" />
                                    </Link>
                                    <Link href="/use-cases" className="group relative text-md font-medium transition-opacity duration-300 hover:opacity-70" onMouseEnter={handleNavMouseEnter}>
                                        Use Cases
                                        <span className="absolute left-0 -bottom-1 h-px w-0 transition-all duration-300 group-hover:w-full bg-current" />
                                    </Link>
                                    <Link href="/technology" className="group relative text-md font-medium transition-opacity duration-300 hover:opacity-70" onMouseEnter={handleNavMouseEnter}>
                                        Technology
                                        <span className="absolute left-0 -bottom-1 h-px w-0 transition-all duration-300 group-hover:w-full bg-current" />
                                    </Link>
                                </div>
                            </div>

                            {/* Right: CTA + Hamburger */}
                            <div className="col-start-3 flex items-center justify-end gap-3">
                                <Link
                                    href="/maps-gpt"
                                    className={`hidden min-[1155px]:flex items-center justify-center px-6 py-3.5 text-md font-semibold leading-none rounded-none border transition-opacity duration-300 hover:opacity-70 ${
                                        isMenuOpen
                                            ? "border-white/30 bg-white/10 text-white"
                                            : "border-black/20 bg-black/5 text-[#111]"
                                    }`}
                                    onMouseEnter={handleNavMouseEnter}
                                >
                                    Start Now
                                </Link>
                                <button
                                    onClick={handleHamburgerClick}
                                    onMouseEnter={handleNavMouseEnter}
                                    className="relative flex h-11 w-11 items-center justify-center rounded-none border transition-all duration-300 border-current"
                                    aria-label="Toggle menu"
                                >
                                    <div className={`absolute h-px w-5.5 bg-current transform-gpu transition-all duration-300 ease-in-out ${isMenuOpen ? "rotate-45" : "-translate-y-1.5"}`} />
                                    <div className={`absolute h-px w-5.5 bg-current transition-all duration-200 ${isMenuOpen ? "opacity-0" : "opacity-100"}`} />
                                    <div className={`absolute h-px w-5.5 bg-current transform-gpu transition-all duration-300 ease-in-out ${isMenuOpen ? "-rotate-45" : "translate-y-1.5"}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Dropdown ── */}
                    <div
                        className={`absolute top-full left-(--container-padding) right-(--container-padding) overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isMenuOpen
                                ? "opacity-100 translate-y-0 pointer-events-auto"
                                : "opacity-0 -translate-y-6 pointer-events-none"
                        }`}
                        style={{
                            marginTop: "50px",
                            borderRadius: "23px",
                            border: "2px solid rgba(0,0,0,0.15)",
                            background: "rgba(10, 12, 22, 0.52)",
                            backdropFilter: "blur(40px)",
                            WebkitBackdropFilter: "blur(40px)",
                            boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
                        }}
                    >
                        <DropdownContent
                            isOpen={isMenuOpen}
                            isDark
                            onClose={() => { setIsMenuOpen(false); setIsManuallyToggled(false); }}
                        />
                    </div>
                </div>
            </nav>

            {/* ── Backdrop: compact nav ── */}
            <div
                className={`fixed inset-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isCompactMenuOpen
                        ? "opacity-100 backdrop-blur-md bg-black/10"
                        : "opacity-0 pointer-events-none"
                }`}
            />

            {/* ── Blur background for compact nav ── */}
            <div
                className={`fixed top-0 left-0 right-0 pointer-events-none transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isCompactVisible ? "translate-y-0" : "-translate-y-full"
                }`}
                style={{
                    zIndex: 49,
                    height: "62px",
                    background: "transparent",
                    backdropFilter: "blur(40px)",
                    WebkitBackdropFilter: "blur(40px)",
                }}
            />

            {/* ══════════════ COMPACT NAVBAR ══════════════ */}
            <nav
                ref={compactNavRef}
                className={`header-font fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isCompactVisible ? "translate-y-0" : "-translate-y-full"
                }`}
                style={compactNavBlendStyle}
                onMouseLeave={handleCompactMouseLeave}
            >
                <div className="relative mx-auto w-full max-w-screen-2xl">
                    {/* Nav bar background pill — transparent (compact bar handles bg) */}
                    <div
                        className={`absolute inset-y-0 left-(--container-padding) right-(--container-padding) transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isCompactMenuOpen ? "rounded-tl-xs rounded-tr-xs" : ""
                        }`}
                    />

                    <div className="relative px-[calc(var(--container-padding)+18px)]">
                        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center">
                            {/* Left: Logo */}
                            <Link href="/" className="flex w-fit shrink-0 items-center gap-2" onMouseEnter={handleCompactNavMouseEnter}>
                                <div
                                    className="relative h-8 w-8 shrink-0"
                                    style={isCompactMenuOpen ? { filter: "brightness(0) invert(1)" } : {}}
                                >
                                    <Image
                                        src="/logobueno.png"
                                        alt="Columbus Logo"
                                        fill
                                        sizes="32px"
                                        className="object-contain"
                                    />
                                </div>
                                <span className="brand-wordmark text-[23px] font-medium leading-none" style={{ letterSpacing: "-0.01em" }}>
                                    Columbus Earth
                                </span>
                            </Link>

                            {/* Center: Navigation Links */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="hidden items-center gap-7 min-[1155px]:flex pointer-events-auto">
                                    <Link href="#" className="group relative text-sm font-medium transition-opacity duration-300 hover:opacity-70" onMouseEnter={handleCompactNavMouseEnter}>
                                        Product
                                        <span className="absolute left-0 -bottom-0.5 h-px w-0 transition-all duration-300 group-hover:w-full bg-current" />
                                    </Link>
                                    <Link href="/use-cases" className="group relative text-sm font-medium transition-opacity duration-300 hover:opacity-70" onMouseEnter={handleCompactNavMouseEnter}>
                                        Use Cases
                                        <span className="absolute left-0 -bottom-0.5 h-px w-0 transition-all duration-300 group-hover:w-full bg-current" />
                                    </Link>
                                    <Link href="/technology" className="group relative text-sm font-medium transition-opacity duration-300 hover:opacity-70" onMouseEnter={handleCompactNavMouseEnter}>
                                        Technology
                                        <span className="absolute left-0 -bottom-0.5 h-px w-0 transition-all duration-300 group-hover:w-full bg-current" />
                                    </Link>
                                </div>
                            </div>

                            {/* Right: CTA + Hamburger */}
                            <div className="col-start-3 flex items-center justify-end gap-2">
                                <Link
                                    href="/maps-gpt"
                                    className={`hidden min-[1155px]:flex items-center justify-center h-10 px-4 text-sm font-semibold leading-none rounded-none border transition-opacity duration-300 hover:opacity-70 ${
                                        isCompactMenuOpen
                                            ? "border-white/30 bg-white/10 text-white"
                                            : "border-black/20 bg-black/5 text-[#111]"
                                    }`}
                                    onMouseEnter={handleCompactNavMouseEnter}
                                >
                                    Start Now
                                </Link>
                                <button
                                    onClick={handleCompactHamburgerClick}
                                    onMouseEnter={handleCompactNavMouseEnter}
                                    className="relative flex h-10 w-10 items-center justify-center rounded-none border border-current transition-all duration-300"
                                    aria-label="Toggle menu"
                                >
                                    <div className={`absolute h-px w-4.5 bg-current transform-gpu transition-all duration-300 ease-in-out ${isCompactMenuOpen ? "rotate-45" : "-translate-y-1.25"}`} />
                                    <div className={`absolute h-px w-4.5 bg-current transition-all duration-200 ${isCompactMenuOpen ? "opacity-0" : "opacity-100"}`} />
                                    <div className={`absolute h-px w-4.5 bg-current transform-gpu transition-all duration-300 ease-in-out ${isCompactMenuOpen ? "-rotate-45" : "translate-y-1.25"}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Dropdown ── */}
                    <div
                        className={`absolute top-full left-(--container-padding) right-(--container-padding) overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isCompactMenuOpen
                                ? "opacity-100 translate-y-0 pointer-events-auto"
                                : "opacity-0 -translate-y-6 pointer-events-none"
                        }`}
                        style={{
                            marginTop: "50px",
                            borderRadius: "23px",
                            border: "2px solid rgba(0,0,0,0.15)",
                            background: "rgba(10, 12, 22, 0.52)",
                            backdropFilter: "blur(40px)",
                            WebkitBackdropFilter: "blur(40px)",
                            boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
                        }}
                    >
                        <DropdownContent
                            isOpen={isCompactMenuOpen}
                            isDark
                            onClose={() => { setIsCompactMenuOpen(false); setIsCompactManuallyToggled(false); }}
                        />
                    </div>
                </div>
            </nav>
        </>
    );
};
