"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

import { ScrambleText } from "@/components/ui/ScrambleText";

const COMPACT_THRESHOLD = 10;
const NAV_BREAKPOINT = 900;

const menuItems = [
    { label: "Our Mission", href: "/our-mission" },
    { label: "Columbus Pro", href: "/enterprise" },
    { label: "MapsGPT", href: "/maps-gpt" },
    { label: "Use Cases", href: "/use-cases" },
    { label: "Technology", href: "/technology" },
];

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
    // Links only appear once hero CTA has scrolled out of view
    const [showLinks, setShowLinks] = useState(false);
    const [footerInView, setFooterInView] = useState(false);
    const [isWideScreen, setIsWideScreen] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth >= NAV_BREAKPOINT : true
    );
    const navRef = useRef<HTMLElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleReveal = () => setHasScrolled(true);
        window.addEventListener("hero-reveal", handleReveal);

        // Background + resize on any scroll
        const handleScroll = () => {
            const y = window.scrollY;
            if (y > 5) setHasScrolled(true);
            setIsCompact(y > COMPACT_THRESHOLD);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });

        // Track viewport width for hamburger/nav-links breakpoint
        const handleResize = () => setIsWideScreen(window.innerWidth >= NAV_BREAKPOINT);
        handleResize(); // Correct SSR default on mount
        window.addEventListener("resize", handleResize);

        // Nav links appear only after hero CTA leaves viewport
        const cta = document.getElementById("hero-cta");
        let ctaObs: IntersectionObserver | undefined;
        if (cta) {
            ctaObs = new IntersectionObserver(
                ([entry]) => setShowLinks(!entry.isIntersecting),
                { threshold: 0 }
            );
            ctaObs.observe(cta);
        }

        // Hide navbar when footer is in view
        const footer = document.querySelector("[data-footer]");
        let footerObs: IntersectionObserver | undefined;
        if (footer) {
            footerObs = new IntersectionObserver(
                ([entry]) => setFooterInView(entry.isIntersecting),
                { threshold: 0.5 }
            );
            footerObs.observe(footer);
        }

        return () => {
            ctaObs?.disconnect();
            footerObs?.disconnect();
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
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
        const relatedTarget = e.relatedTarget as Element | null;
        if (dropdownRef.current?.contains(relatedTarget)) return;
        const navBounds = navRef.current?.getBoundingClientRect();
        if (!navBounds) return;
        if (e.clientY <= navBounds.top) return;
        setIsMenuOpen(false);
    };
    const handleDropdownMouseLeave = (e: React.MouseEvent) => {
        if (isManuallyToggled) return;
        const relatedTarget = e.relatedTarget as Element | null;
        if (navRef.current?.contains(relatedTarget)) return;
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

    const dropdownHeadingClass = isDark ? "text-white/40" : "text-[#0A1344]/50";
    const dropdownBodyClass    = isDark ? "text-white/65" : "text-[#0A1344]/70";
    const dropdownLinkClass    = isDark ? "text-white"    : "text-[#0A1344]";
    const dropdownSubheadClass = isDark ? "text-white/40" : "text-gray-500";
    const dropdownSocialClass  = isDark ? "text-white hover:text-white/70" : "text-gray-900 hover:text-primary";
    const dropdownNavLinkClass = isDark ? "text-white"    : "text-[#0A1344]";

    const t = "500ms cubic-bezier(0.22, 1, 0.36, 1)";

    // ── Nav link style (Anthropic-style underline hover) ────────────────
    const navLinkClass = "nav-link-underline px-3 py-1.5";
    const navLinkInline = (compact: boolean): React.CSSProperties => ({
        fontSize: compact ? 14 : 15,
        fontWeight: 400,
        letterSpacing: "-0.0025em",
        color: "#111111",
        transition: `font-size ${t}`,
    });

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
                    opacity: footerInView ? 0 : hasScrolled ? 1 : 0,
                    transform: footerInView ? "translateY(-12px)" : hasScrolled ? "translateY(0)" : "translateY(-8px)",
                    pointerEvents: footerInView ? "none" : undefined,
                    transition: `opacity 600ms ease, transform 600ms ease, color ${t}`,
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
                    {/* White background when dropdown is open — always full width, only opacity transitions */}
                    <div
                        className={`absolute inset-y-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isMenuOpen ? "opacity-100" : "opacity-0"
                        }`}
                        style={{
                            left: "calc(-50vw + 50%)",
                            right: "calc(-50vw + 50%)",
                            background: "white",
                        }}
                    />

                    <div className="relative px-8 min-[1287px]:px-0">
                        <div
                            className="flex items-center justify-between"
                            style={{
                                height: isCompact ? 56 : 68,
                                paddingTop: isCompact ? 0 : 12,
                                transition: `height ${t}, padding-top ${t}`,
                            }}
                        >
                            {/* ── Left: Logo ── */}
                            <div className="flex items-center">
                                <Link href="/" className="flex w-fit shrink-0 items-center gap-2" onMouseEnter={handleNavMouseEnter}>
                                    <div
                                        className="relative shrink-0"
                                        style={{
                                            width: isCompact ? 30 : 40,
                                            height: isCompact ? 30 : 40,
                                            transition: `width ${t}, height ${t}, filter ${t}`,
                                            filter: (isDark && !isMenuOpen) ? "brightness(0) invert(1)" : "none",
                                        }}
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
                                    <span
                                        className="brand-wordmark font-medium leading-none whitespace-nowrap"
                                        style={{
                                            fontSize: isCompact ? 20 : 24,
                                            letterSpacing: "-0.02em",
                                            transition: `font-size ${t}`,
                                        }}
                                    >
                                        Columbus Earth
                                    </span>
                                </Link>
                            </div>

                            {/* ── Right: Nav Links + CTA + Hamburger ── */}
                            <div className="flex items-center">

                                {/* Desktop nav links — appear after hero CTA leaves viewport */}
                                <div
                                    className="hidden min-[900px]:flex items-center gap-5"
                                    style={{
                                        maxWidth: showLinks ? 600 : 0,
                                        overflow: "hidden",
                                        opacity: showLinks ? 1 : 0,
                                        clipPath: showLinks ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                                        pointerEvents: showLinks ? "auto" : "none",
                                        paddingRight: 16,
                                        marginRight: 16,
                                        transition: `opacity 300ms ease, clip-path 400ms cubic-bezier(0.22, 1, 0.36, 1)`,
                                    }}
                                >
                                    {[
                                        { label: "Product", href: "/enterprise" },
                                        { label: "Use Cases", href: "/use-cases" },
                                        { label: "Technology", href: "/technology" },
                                    ].map((link) => (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className={navLinkClass}
                                            style={{ ...navLinkInline(isCompact), whiteSpace: "nowrap" }}
                                            onMouseEnter={handleNavMouseEnter}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>

                                {/* Start Now — appears after hero CTA leaves viewport */}
                                <Link
                                    href="/maps-gpt"
                                    className="group hidden min-[900px]:flex items-center justify-between gap-3 leading-none whitespace-nowrap hover:opacity-90 transition-opacity"
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 500,
                                        height: 45,
                                        width: showLinks ? 145 : 0,
                                        opacity: showLinks ? 1 : 0,
                                        overflow: "hidden",
                                        pointerEvents: showLinks ? "auto" : "none",
                                        paddingLeft: 20,
                                        paddingRight: 16,
                                        transition: `width ${t}, opacity 300ms ease`,
                                        backgroundColor: "#000000",
                                        color: "white",
                                    }}
                                >
                                    <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Start Now</span>
                                    <svg
                                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                                        width="10" height="18" viewBox="0 0 7 12" fill="none"
                                        stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                    >
                                        <path d="M1 1l5 5-5 5" />
                                    </svg>
                                </Link>

                                {/* Hamburger — hides only when nav links are visible (wide screen + scrolled past CTA) */}
                                <button
                                    onClick={handleHamburgerClick}
                                    onMouseEnter={handleNavMouseEnter}
                                    className="relative flex items-center justify-center rounded-none transition-all duration-300"
                                    style={{
                                        width: (showLinks && isWideScreen) ? 0 : 30,
                                        height: 45,
                                        opacity: (showLinks && isWideScreen) ? 0 : 1,
                                        overflow: "hidden",
                                        pointerEvents: (showLinks && isWideScreen) ? "none" : "auto",
                                        transition: `width ${t}, opacity 120ms ease`,
                                    }}
                                    aria-label="Toggle menu"
                                >
                                    <div
                                        className="absolute h-px bg-current transform-gpu"
                                        style={{
                                            width: 22,
                                            transform: isMenuOpen ? "rotate(45deg)" : "translateY(-6px)",
                                            transition: `transform 300ms ease-in-out`,
                                        }}
                                    />
                                    <div
                                        className={`absolute h-px bg-current ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
                                        style={{ width: 22, transition: `opacity 200ms ease` }}
                                    />
                                    <div
                                        className="absolute h-px bg-current transform-gpu"
                                        style={{
                                            width: 22,
                                            transform: isMenuOpen ? "rotate(-45deg)" : "translateY(6px)",
                                            transition: `transform 300ms ease-in-out`,
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </nav>

            {/* ── Dropdown (outside nav so fixed positioning isn't broken by nav's transform) ── */}
            <div
                ref={dropdownRef}
                className={`fixed left-0 right-0 max-md:bottom-0 z-50 overflow-y-auto transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isMenuOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-6 pointer-events-none"
                }`}
                style={{ ...dropdownBg, top: isCompact ? 56 : 68 }}
                onMouseLeave={handleDropdownMouseLeave}
            >
                <div className="mx-auto w-full px-6 md:px-8 min-[1287px]:px-0 py-8 md:py-12" style={{ maxWidth: 1287, transitionDelay: isMenuOpen ? "150ms" : "0ms" }}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                        <div
                            className={`md:col-span-5 space-y-6 md:space-y-8 transition-opacity duration-500 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
                            style={{ transitionDelay: isMenuOpen ? "200ms" : "0ms" }}
                        >
                            <div>
                                <h4 className={`text-[13px] font-medium tracking-[0.08em] uppercase mb-3 md:mb-4 ${dropdownHeadingClass}`}>
                                    <ScrambleText text="COLUMBUS EARTH" isActive={isMenuOpen} delay={300} />
                                </h4>
                                <p className={`text-[16px] leading-[1.6] max-w-md ${dropdownBodyClass}`}>
                                    Columbus Earth Inc. is a spatial frontier AI company building the first production
                                    Large Geospatial Model to answer the most difficult questions about our planet.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-6 md:gap-8">
                                <div>
                                    <h4 className={`text-[13px] font-medium tracking-[0.08em] uppercase mb-2 ${dropdownSubheadClass}`}>
                                        <ScrambleText text="CONTACT" isActive={isMenuOpen} delay={450} />
                                    </h4>
                                    <a href="mailto:contact@columbus.earth" className={`text-[16px] font-medium block transition-colors duration-300 break-all hover:text-[#2563EB] ${dropdownLinkClass}`}>
                                        contact@columbus.earth
                                    </a>
                                </div>
                                <div>
                                    <h4 className={`text-[13px] font-medium tracking-[0.08em] uppercase mb-2 ${dropdownSubheadClass}`}>
                                        <ScrambleText text="SOCIAL" isActive={isMenuOpen} delay={550} />
                                    </h4>
                                    <a href="https://www.linkedin.com/company/columbusearth/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className={`text-[16px] font-medium block transition-colors duration-300 hover:text-[#2563EB] ${dropdownSocialClass}`}>
                                        LinkedIn
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block md:col-span-3"></div>
                        <div className="md:col-span-4 space-y-4 md:space-y-6">
                            <h4
                                className={`text-[13px] font-medium tracking-[0.08em] uppercase mb-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${dropdownSubheadClass} ${
                                    isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                }`}
                                style={{ transitionDelay: isMenuOpen ? "250ms" : "0ms" }}
                            >
                                <ScrambleText text="COMPANY" isActive={isMenuOpen} delay={400} />
                            </h4>
                            <ul className="space-y-4">
                                {menuItems.map((item, index) => (
                                    <li
                                        key={item.href}
                                        className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                            isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                                        }`}
                                        style={{ transitionDelay: isMenuOpen ? `${320 + index * 70 + index * index * 8}ms` : "0ms" }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={closeMenu}
                                            className={`group relative text-xl font-medium transition-all duration-300 flex items-center ${dropdownNavLinkClass}`}
                                        >
                                            <span className="transition-all duration-300 ease-in-out group-hover:translate-x-1">{item.label}</span>
                                            <svg className="ml-3 shrink-0 transition-all duration-300 ease-in-out group-hover:translate-x-1 stroke-[#0A1344] group-hover:stroke-[#2563EB]" width="9" height="16" viewBox="0 0 7 12" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 1l5 5-5 5" />
                                            </svg>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
