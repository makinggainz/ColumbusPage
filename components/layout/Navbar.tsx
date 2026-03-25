"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

import { ScrambleText } from "@/components/ui/ScrambleText";

const COMPACT_THRESHOLD = 10;

const menuItems = [
    { label: "Our Mission", href: "/our-mission" },
    { label: "Columbus Market Spy", href: "/market-spy" },
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

                <div className="relative mx-auto w-full" style={{ maxWidth: 1280 }}>
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
                            {/* ── Left: Logo ── */}
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
                                    className="brand-wordmark font-medium leading-none"
                                    style={{
                                        fontSize: isCompact ? 20 : 24,
                                        letterSpacing: "-0.02em",
                                        transition: `font-size ${t}`,
                                    }}
                                >
                                    Columbus Earth
                                </span>
                            </Link>

                            {/* ── Right: Nav Links + CTA + Hamburger ── */}
                            <div className="flex items-center">
                                {/* Desktop nav links */}
                                <div
                                    className="hidden min-[1155px]:flex items-center"
                                    style={{
                                        gap: isCompact ? 4 : 8,
                                        marginRight: isCompact ? 16 : 0,
                                        transition: `gap ${t}, margin-right ${t}`,
                                    }}
                                >
                                    {[
                                        { label: "Product", href: "#" },
                                        { label: "Use Cases", href: "/use-cases" },
                                        { label: "Technology", href: "/technology" },
                                    ].map((link) => (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className={navLinkClass}
                                            style={navLinkInline(isCompact)}
                                            onMouseEnter={handleNavMouseEnter}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>

                                {/* Start Now — grows laterally into position */}
                                <Link
                                    href="/maps-gpt"
                                    className={`hidden min-[1155px]:flex items-center justify-center font-semibold leading-none rounded-none whitespace-nowrap ${
                                        isDark
                                            ? "bg-white text-[#0A1344] hover:bg-white/90"
                                            : "bg-[#0A1344] text-white hover:bg-[#0A1344]/85"
                                    }`}
                                    style={{
                                        fontSize: 14,
                                        height: 36,
                                        width: isCompact ? 120 : 0,
                                        opacity: isCompact ? 1 : 0,
                                        overflow: "hidden",
                                        pointerEvents: isCompact ? "auto" : "none",
                                        marginRight: isCompact ? 8 : 0,
                                        marginLeft: isCompact ? 8 : 0,
                                        transition: `width ${t}, opacity 300ms ease, margin ${t}`,
                                    }}
                                    onMouseEnter={handleNavMouseEnter}
                                >
                                    Start Now
                                </Link>

                                {/* Hamburger */}
                                <button
                                    onClick={handleHamburgerClick}
                                    onMouseEnter={handleNavMouseEnter}
                                    className={`relative flex items-center justify-center rounded-none border border-transparent transition-all duration-300 ${isDark && !isMenuOpen ? "hover:border-white/50" : "hover:border-current"}`}
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
                                            width: isCompact ? 16 : 22,
                                            transform: isMenuOpen ? "rotate(45deg)" : `translateY(${isCompact ? -4.5 : -6}px)`,
                                            transition: `width ${t}, transform 300ms ease-in-out`,
                                        }}
                                    />
                                    <div
                                        className={`absolute h-px bg-current ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
                                        style={{
                                            width: isCompact ? 16 : 22,
                                            transition: `width ${t}, opacity 200ms ease`,
                                        }}
                                    />
                                    <div
                                        className="absolute h-px bg-current transform-gpu"
                                        style={{
                                            width: isCompact ? 16 : 22,
                                            transform: isMenuOpen ? "rotate(-45deg)" : `translateY(${isCompact ? 4.5 : 6}px)`,
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
                        <div className="pl-7 pr-(--container-padding) py-12" style={{ transitionDelay: isMenuOpen ? "150ms" : "0ms" }}>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                                <div
                                    className={`md:col-span-5 space-y-8 transition-opacity duration-500 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
                                    style={{ transitionDelay: isMenuOpen ? "200ms" : "0ms" }}
                                >
                                    <div>
                                        <h4 className={`text-xs font-semibold tracking-widest uppercase mb-4 ${dropdownHeadingClass}`}>
                                            <ScrambleText text="COLUMBUS EARTH" isActive={isMenuOpen} delay={300} />
                                        </h4>
                                        <p className={`text-base leading-relaxed max-w-md ${dropdownBodyClass}`}>
                                            Columbus Earth Inc. is a spatial frontier AI company building the first production
                                            Large Geospatial Model to answer the most difficult questions about our planet.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <h4 className={`text-xs font-semibold tracking-wider uppercase mb-2 ${dropdownSubheadClass}`}>
                                                <ScrambleText text="CONTACT" isActive={isMenuOpen} delay={450} />
                                            </h4>
                                            <a href="mailto:contact@columbus.earth" className={`font-medium block transition-colors duration-300 ${dropdownLinkClass} hover:opacity-70`}>
                                                contact@columbus.earth
                                            </a>
                                        </div>
                                        <div>
                                            <h4 className={`text-xs font-semibold tracking-wider uppercase mb-2 ${dropdownSubheadClass}`}>
                                                <ScrambleText text="SOCIAL" isActive={isMenuOpen} delay={550} />
                                            </h4>
                                            <a href="https://www.linkedin.com/company/columbusearth/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className={`font-medium block transition-colors ${dropdownSocialClass}`}>
                                                LinkedIn
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-3"></div>
                                <div className="md:col-span-4 space-y-6">
                                    <h4
                                        className={`text-xs font-semibold tracking-wider uppercase mb-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${dropdownSubheadClass} ${
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
                                                    <span className="mr-3 transition-transform duration-300 ease-in-out group-hover:translate-x-1">+</span>
                                                    <span className="transition-all duration-300 ease-in-out group-hover:translate-x-1">{item.label}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};
