"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

import { ScrambleText } from "@/components/ui/ScrambleText";
import { geist } from "@/lib/typography";

const COMPACT_THRESHOLD = 10;

// ─────────────────────────────────────────────────────────────────────────────

export const Navbar = ({ theme = "light" }: { theme?: "light" | "dark" }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isManuallyToggled, setIsManuallyToggled] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(() =>
        typeof window !== "undefined" ? window.scrollY > 5 : false
    );
    const [isCompact, setIsCompact] = useState(() =>
        typeof window !== "undefined" ? window.scrollY > COMPACT_THRESHOLD : false
    );
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            if (y > 5) setHasScrolled(true);
            setIsCompact(y > COMPACT_THRESHOLD);
        };
        const handleReveal = () => setHasScrolled(true);
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("hero-reveal", handleReveal);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("hero-reveal", handleReveal);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Close dropdown when mouse leaves nav area
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

    // ── Handlers ────────────────────────────────────────────────────────
    const handleMouseEnter = () => {
        if (!isManuallyToggled) setIsMenuOpen(true);
    };
    const handleMouseLeave = (e: React.MouseEvent) => {
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
    const closeMenu = () => {
        setIsMenuOpen(false);
        setIsManuallyToggled(false);
    };

    // ── Theme ───────────────────────────────────────────────────────────
    const isDark = theme === "dark";

    // Color: always direct colors, no mix-blend-mode to avoid flash on transition
    const navColor = isMenuOpen
        ? "#111111"
        : isCompact
        ? (isDark ? "white" : "#0A1344")
        : isDark
        ? "white"
        : "#0A1344";

    // ── Dropdown tokens ─────────────────────────────────────────────────
    const dropdownBg = isDark
        ? { background: "rgba(6, 8, 20, 0.96)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }
        : { background: "rgba(248, 249, 252, 0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" };

    const dropdownBodyClass    = isDark ? "text-white/65" : "text-[#0A1344]/70";
    const dropdownLinkClass    = isDark ? "text-white"    : "text-[#0A1344]";
    const dropdownSubheadClass = isDark ? "text-white/40" : "text-gray-500";
    const dropdownNavLinkClass = isDark ? "text-white"    : "text-[#0A1344]";
    const dropdownHoverBg      = isDark ? "hover:bg-white/[0.06]" : "hover:bg-black/[0.04]";
    const dropdownDivider      = isDark ? "border-white/10" : "border-[#0A1344]/10";

    const t = "500ms cubic-bezier(0.22, 1, 0.36, 1)";

    return (
        <>
            {/* ── Backdrop overlay (dropdown open) ── */}
            <div
                className={`fixed inset-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isMenuOpen
                        ? "opacity-100 backdrop-blur-md bg-black/10"
                        : "opacity-0 pointer-events-none"
                }`}
            />

            {/* ══════════════ NAVBAR ══════════════ */}
            <nav
                ref={navRef}
                className="header-font fixed top-0 left-0 right-0 z-50"
                style={{
                    color: navColor,
                    opacity: hasScrolled ? 1 : 0,
                    transform: hasScrolled ? "translateY(0)" : "translateY(-8px)",
                    transition: `opacity 1000ms ease, transform 1000ms ease, color ${t}`,
                }}
                onMouseLeave={handleMouseLeave}
            >
                {/* Frosted glass background — fades in on compact */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: isDark ? "rgba(6, 8, 20, 0.85)" : "rgba(255, 255, 255, 0.82)",
                        backdropFilter: "blur(20px) saturate(1.2)",
                        WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                        borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
                        opacity: isCompact && !isMenuOpen ? 1 : 0,
                        transition: `opacity ${t}`,
                    }}
                />

                <div className="relative mx-auto w-full" style={{ maxWidth: 1287 }}>
                    {/* White pill background when dropdown is open */}
                    <div
                        className={`absolute inset-y-0 left-(--container-padding) right-(--container-padding) transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isMenuOpen ? "bg-white rounded-tl-[20px] rounded-tr-[20px]" : "bg-transparent rounded-[20px]"
                        }`}
                        style={{
                            top: isCompact ? 0 : undefined,
                            left: isCompact && !isMenuOpen ? 0 : undefined,
                            right: isCompact && !isMenuOpen ? 0 : undefined,
                        }}
                    />

                    <div className="relative px-[calc(var(--container-padding)+18px)]">
                        <div
                            className="flex items-center justify-between"
                            style={{
                                height: isCompact ? 56 : 68,
                                paddingTop: isCompact ? 0 : 12,
                                transition: `height ${t}, padding-top ${t}`,
                            }}
                        >
                            {/* ── Left: Logo + Nav Links ── */}
                            <div className="flex items-center gap-6">
                                <Link href="/" className="flex w-fit shrink-0 items-center gap-2" onMouseEnter={handleNavMouseEnter}>
                                    <div
                                        className="relative shrink-0"
                                        style={{
                                            width: isCompact ? 28 : 34,
                                            height: isCompact ? 28 : 34,
                                            transition: `width ${t}, height ${t}, filter ${t}`,
                                            filter: (isDark && !isMenuOpen) ? "brightness(0) invert(1)" : "none",
                                        }}
                                    >
                                        <Image
                                            src="/logobueno.png"
                                            alt="Columbus Logo"
                                            fill
                                            sizes="34px"
                                            className="object-contain"
                                            priority
                                        />
                                    </div>
                                </Link>

                                {/* Desktop nav links — inline next to logo */}
                                <div className={`hidden min-[900px]:flex items-center gap-1`}>
                                    <Link
                                        href="#"
                                        className="font-medium px-3 py-1.5 rounded-full hover:bg-current/[0.06] transition-all duration-200"
                                        style={{ fontSize: isCompact ? 14 : 15, transition: `font-size ${t}` }}
                                        onMouseEnter={handleNavMouseEnter}
                                    >
                                        Product
                                    </Link>
                                    <Link
                                        href="/use-cases"
                                        className="font-medium px-3 py-1.5 rounded-full hover:bg-current/[0.06] transition-all duration-200"
                                        style={{ fontSize: isCompact ? 14 : 15, transition: `font-size ${t}` }}
                                        onMouseEnter={handleNavMouseEnter}
                                    >
                                        Use Cases
                                    </Link>
                                    <Link
                                        href="/technology"
                                        className="font-medium px-3 py-1.5 rounded-full hover:bg-current/[0.06] transition-all duration-200"
                                        style={{ fontSize: isCompact ? 14 : 15, transition: `font-size ${t}` }}
                                        onMouseEnter={handleNavMouseEnter}
                                    >
                                        Technology
                                    </Link>
                                    <Link
                                        href="/our-mission"
                                        className="font-medium px-3 py-1.5 rounded-full hover:bg-current/[0.06] transition-all duration-200"
                                        style={{ fontSize: isCompact ? 14 : 15, transition: `font-size ${t}` }}
                                        onMouseEnter={handleNavMouseEnter}
                                    >
                                        Company
                                    </Link>
                                </div>
                            </div>

                            {/* ── Right: CTA buttons ── */}
                            <div className="flex items-center gap-3">
                                {/* Start Now — always visible on desktop, dark pill CTA */}
                                <Link
                                    href="/maps-gpt"
                                    className={`hidden min-[900px]:inline-flex items-center justify-center font-semibold leading-none rounded-none transition-all duration-200 ${
                                        isDark && !isMenuOpen
                                            ? "bg-white text-[#0A1344] hover:bg-white/90"
                                            : "bg-[#0A1344] text-white hover:bg-[#0A1344]/85"
                                    }`}
                                    style={{
                                        fontSize: 14,
                                        height: 40,
                                        paddingLeft: 20,
                                        paddingRight: 20,
                                        transition: `background-color 200ms ease`,
                                    }}
                                    onMouseEnter={handleNavMouseEnter}
                                >
                                    Start Now →
                                </Link>

                                {/* Hamburger — mobile only */}
                                <button
                                    onClick={handleHamburgerClick}
                                    onMouseEnter={handleNavMouseEnter}
                                    className={`min-[900px]:hidden relative flex items-center justify-center rounded-full border border-transparent transition-all duration-300 ${isDark && !isMenuOpen ? "hover:border-white/50" : "hover:border-current"}`}
                                    style={{
                                        width: isCompact ? 38 : 44,
                                        height: isCompact ? 38 : 44,
                                        transition: `width ${t}, height ${t}`,
                                    }}
                                    aria-label="Toggle menu"
                                >
                                    <div
                                        className="absolute h-px bg-current transform-gpu"
                                        style={{
                                            width: isCompact ? 16 : 20,
                                            transform: isMenuOpen ? "rotate(45deg)" : `translateY(${isCompact ? -4 : -5}px)`,
                                            transition: `width ${t}, transform 300ms ease-in-out`,
                                        }}
                                    />
                                    <div
                                        className={`absolute h-px bg-current ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
                                        style={{
                                            width: isCompact ? 16 : 20,
                                            transition: `width ${t}, opacity 200ms ease`,
                                        }}
                                    />
                                    <div
                                        className="absolute h-px bg-current transform-gpu"
                                        style={{
                                            width: isCompact ? 16 : 20,
                                            transform: isMenuOpen ? "rotate(-45deg)" : `translateY(${isCompact ? 4 : 5}px)`,
                                            transition: `width ${t}, transform 300ms ease-in-out`,
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Dropdown ── */}
                    <div
                        className={`absolute top-full left-(--container-padding) right-(--container-padding) rounded-bl-[20px] rounded-br-[20px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isMenuOpen
                                ? "opacity-100 translate-y-0 pointer-events-auto"
                                : "opacity-0 -translate-y-6 pointer-events-none"
                        }`}
                        style={dropdownBg}
                    >
                        <div className={`px-8 py-8 ${geist.className}`}>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-8">
                                {/* Products */}
                                <div
                                    className={`md:col-span-5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                        isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                    }`}
                                    style={{ transitionDelay: isMenuOpen ? "200ms" : "0ms" }}
                                >
                                    <h4 className={`text-xs font-semibold tracking-widest uppercase mb-3 ${dropdownSubheadClass}`}>
                                        <ScrambleText text="PRODUCTS" isActive={isMenuOpen} delay={250} />
                                    </h4>
                                    <div className="space-y-1">
                                        <Link
                                            href="/maps-gpt"
                                            onClick={closeMenu}
                                            className={`group flex items-center justify-between p-4 -mx-2 rounded-2xl transition-all duration-300 ${dropdownHoverBg} ${dropdownNavLinkClass}`}
                                        >
                                            <div>
                                                <div className="text-lg font-semibold">MapsGPT</div>
                                                <div className={`text-sm mt-0.5 ${dropdownBodyClass}`}>AI-powered geospatial answers</div>
                                            </div>
                                            <span className="opacity-0 group-hover:opacity-40 transition-all duration-300 group-hover:translate-x-1 text-lg mr-2">→</span>
                                        </Link>
                                        <Link
                                            href="/market-spy"
                                            onClick={closeMenu}
                                            className={`group flex items-center justify-between p-4 -mx-2 rounded-2xl transition-all duration-300 ${dropdownHoverBg} ${dropdownNavLinkClass}`}
                                        >
                                            <div>
                                                <div className="text-lg font-semibold">Columbus Market Spy</div>
                                                <div className={`text-sm mt-0.5 ${dropdownBodyClass}`}>Real-time market intelligence</div>
                                            </div>
                                            <span className="opacity-0 group-hover:opacity-40 transition-all duration-300 group-hover:translate-x-1 text-lg mr-2">→</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Explore */}
                                <div
                                    className={`md:col-span-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                        isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                    }`}
                                    style={{ transitionDelay: isMenuOpen ? "280ms" : "0ms" }}
                                >
                                    <h4 className={`text-xs font-semibold tracking-widest uppercase mb-3 ${dropdownSubheadClass}`}>
                                        <ScrambleText text="EXPLORE" isActive={isMenuOpen} delay={350} />
                                    </h4>
                                    <div className="space-y-1">
                                        <Link
                                            href="/use-cases"
                                            onClick={closeMenu}
                                            className={`group flex items-center justify-between py-2.5 px-4 -mx-2 rounded-xl transition-all duration-300 ${dropdownHoverBg} font-medium ${dropdownNavLinkClass}`}
                                        >
                                            Use Cases
                                            <span className="opacity-0 group-hover:opacity-40 transition-all duration-300 text-sm mr-2">→</span>
                                        </Link>
                                        <Link
                                            href="/technology"
                                            onClick={closeMenu}
                                            className={`group flex items-center justify-between py-2.5 px-4 -mx-2 rounded-xl transition-all duration-300 ${dropdownHoverBg} font-medium ${dropdownNavLinkClass}`}
                                        >
                                            Technology
                                            <span className="opacity-0 group-hover:opacity-40 transition-all duration-300 text-sm mr-2">→</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Company */}
                                <div
                                    className={`md:col-span-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                        isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                    }`}
                                    style={{ transitionDelay: isMenuOpen ? "360ms" : "0ms" }}
                                >
                                    <h4 className={`text-xs font-semibold tracking-widest uppercase mb-3 ${dropdownSubheadClass}`}>
                                        <ScrambleText text="COMPANY" isActive={isMenuOpen} delay={450} />
                                    </h4>
                                    <div className="space-y-1">
                                        <Link
                                            href="/our-mission"
                                            onClick={closeMenu}
                                            className={`group flex items-center justify-between py-2.5 px-4 -mx-2 rounded-xl transition-all duration-300 ${dropdownHoverBg} font-medium ${dropdownNavLinkClass}`}
                                        >
                                            Our Mission
                                            <span className="opacity-0 group-hover:opacity-40 transition-all duration-300 text-sm mr-2">→</span>
                                        </Link>
                                        <a
                                            href="mailto:contact@columbus.earth"
                                            className={`group flex items-center justify-between py-2.5 px-4 -mx-2 rounded-xl transition-all duration-300 ${dropdownHoverBg} font-medium ${dropdownLinkClass}`}
                                        >
                                            Contact
                                            <span className="opacity-0 group-hover:opacity-40 transition-all duration-300 text-sm mr-2">→</span>
                                        </a>
                                        <a
                                            href="https://www.linkedin.com/company/columbusearth/about/?viewAsMember=true"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`group flex items-center justify-between py-2.5 px-4 -mx-2 rounded-xl transition-all duration-300 ${dropdownHoverBg} font-medium ${dropdownLinkClass}`}
                                        >
                                            LinkedIn
                                            <span className="opacity-0 group-hover:opacity-40 transition-all duration-300 text-sm mr-2">↗</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Tagline */}
                            <div
                                className={`mt-8 pt-5 border-t ${dropdownDivider} transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                    isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                                }`}
                                style={{ transitionDelay: isMenuOpen ? "450ms" : "0ms" }}
                            >
                                <p className={`text-sm leading-relaxed max-w-lg ${dropdownBodyClass}`}>
                                    The spatial frontier AI company building the first production Large Geospatial Model.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};
