"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { ScrambleText } from "@/components/ui/ScrambleText";

// Scroll threshold (px) at which the compact nav replaces the primary nav
const COMPACT_THRESHOLD = 80;

export const Navbar = () => {
    // ── Primary navbar state ──────────────────────────────────────────
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isManuallyToggled, setIsManuallyToggled] = useState(false);
    const [isScrolled, setIsScrolled] = useState(() =>
        typeof window !== "undefined" ? window.scrollY > 0 : false
    );
    const navRef = useRef<HTMLElement>(null);

    // ── Compact navbar state ──────────────────────────────────────────
    const [isCompactMenuOpen, setIsCompactMenuOpen] = useState(false);
    const [isCompactManuallyToggled, setIsCompactManuallyToggled] = useState(false);
    const [isCompactVisible, setIsCompactVisible] = useState(() =>
        typeof window !== "undefined" ? window.scrollY > COMPACT_THRESHOLD : false
    );
    const compactNavRef = useRef<HTMLElement>(null);

    // ── Scroll listener ───────────────────────────────────────────────
    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            setIsScrolled(y > 0);
            setIsCompactVisible(y > COMPACT_THRESHOLD);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ── Primary nav: close menu when mouse leaves ─────────────────────
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

    // ── Compact nav: close menu when mouse leaves ─────────────────────
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

    const menuItems = [
        { label: "Our Mission", href: "/our-mission" },
        { label: "Columbus Market Spy", href: "/market-spy" },
        { label: "MapsGPT", href: "/maps-gpt" },
        { label: "Use Cases", href: "/use-cases" },
        { label: "Technology", href: "/technology" },
    ];

    // ── Primary nav handlers ──────────────────────────────────────────
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

    // ── Blend styles ──────────────────────────────────────────────────
    const navBlendStyle: React.CSSProperties = isMenuOpen
        ? { color: "#0A1344" }
        : { mixBlendMode: "difference", color: "white" };

    const compactNavBlendStyle: React.CSSProperties = isCompactMenuOpen
        ? { color: "#0A1344" }
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
                onMouseEnter={handleNavMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="relative mx-auto w-full max-w-screen-2xl">
                    <div className={`absolute inset-y-0 left-(--container-padding) right-(--container-padding) transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isMenuOpen ? "bg-white rounded-tl-xs rounded-tr-xs" : "bg-transparent"
                    }`} />

                    <div className="relative px-[calc(var(--container-padding)+18px)]">
                        <div className="grid h-14 md:h-17 grid-cols-[1fr_auto_1fr] items-center">
                            {/* Left: Logo */}
                            <Link href="/" className="flex shrink-0 items-center gap-2">
                                <div
                                    className="relative h-10 w-10 shrink-0"
                                    style={isMenuOpen ? {} : { filter: "brightness(0) invert(1)" }}
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
                                <div className="hidden items-center gap-9 min-[1155px]:flex pointer-events-auto">
                                    <Link href="#" className="group relative text-md font-medium transition-opacity duration-300 hover:opacity-70">
                                        Product
                                        <span className="absolute left-0 -bottom-1 h-px w-0 transition-all duration-300 group-hover:w-full bg-current" />
                                    </Link>
                                    <Link href="/use-cases" className="group relative text-md font-medium transition-opacity duration-300 hover:opacity-70">
                                        Use Cases
                                        <span className="absolute left-0 -bottom-1 h-px w-0 transition-all duration-300 group-hover:w-full bg-current" />
                                    </Link>
                                    <Link href="/technology" className="group relative text-md font-medium transition-opacity duration-300 hover:opacity-70">
                                        Technology
                                        <span className="absolute left-0 -bottom-1 h-px w-0 transition-all duration-300 group-hover:w-full bg-current" />
                                    </Link>
                                </div>
                            </div>

                            {/* Right: CTA + Hamburger */}
                            <div className="col-start-3 flex items-center justify-end gap-3">
                                <Link
                                    href="/maps-gpt"
                                    className="hidden min-[1155px]:flex items-center justify-center px-6 py-3.5 text-md font-semibold leading-none rounded-none border border-current transition-opacity duration-300 hover:opacity-70"
                                >
                                    Start Now
                                </Link>
                                <button
                                    onClick={handleHamburgerClick}
                                    className="relative flex h-11 w-11 items-center justify-center rounded-none border border-current transition-all duration-300"
                                    aria-label="Toggle menu"
                                >
                                    <div className={`absolute h-px w-5.5 bg-current transform-gpu transition-all duration-300 ease-in-out ${isMenuOpen ? "rotate-45" : "-translate-y-1.5"}`} />
                                    <div className={`absolute h-px w-5.5 bg-current transition-all duration-200 ${isMenuOpen ? "opacity-0" : "opacity-100"}`} />
                                    <div className={`absolute h-px w-5.5 bg-current transform-gpu transition-all duration-300 ease-in-out ${isMenuOpen ? "-rotate-45" : "translate-y-1.5"}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mega Menu Dropdown */}
                    <div
                        className={`absolute top-full left-(--container-padding) right-(--container-padding) rounded-bl-xs rounded-br-xs transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isMenuOpen
                                ? "opacity-100 translate-y-0 bg-white pointer-events-auto"
                                : "opacity-0 -translate-y-10 pointer-events-none"
                        }`}
                    >
                        <div className="pl-7 pr-(--container-padding) py-12" style={{ transitionDelay: isMenuOpen ? "150ms" : "0ms" }}>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                                <div
                                    className={`md:col-span-5 space-y-8 transition-opacity duration-500 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
                                    style={{ transitionDelay: isMenuOpen ? "200ms" : "0ms" }}
                                >
                                    <div>
                                        <h4 className="text-xs font-semibold text-[#0A1344]/50 tracking-widest uppercase mb-4">
                                            <ScrambleText text="COLUMBUS EARTH" isActive={isMenuOpen} delay={300} />
                                        </h4>
                                        <p className="text-[#0A1344]/70 text-base leading-relaxed max-w-md">
                                            Columbus Earth Inc. is a spatial frontier AI company building the first production
                                            Large Geospatial Model to answer the most difficult questions about our planet.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-2">
                                                <ScrambleText text="CONTACT" isActive={isMenuOpen} delay={450} />
                                            </h4>
                                            <a href="mailto:contact@columbus.earth" className="text-[#0A1344] font-medium block transition-colors duration-300 hover:text-[#0A1344]/70">
                                                contact@columbus.earth
                                            </a>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-2">
                                                <ScrambleText text="SOCIAL" isActive={isMenuOpen} delay={550} />
                                            </h4>
                                            <a href="https://www.linkedin.com/company/columbusearth/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-primary font-medium block transition-colors">
                                                LinkedIn
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-3"></div>
                                <div className="md:col-span-4 space-y-6">
                                    <h4
                                        className={`text-xs font-semibold text-gray-500 tracking-wider uppercase mb-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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
                                                    onClick={() => { setIsMenuOpen(false); setIsManuallyToggled(false); }}
                                                    className="group relative text-xl font-medium text-[#0A1344] transition-all duration-300 flex items-center"
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

            {/* ── Backdrop: compact nav ── */}
            <div
                className={`fixed inset-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isCompactMenuOpen
                        ? "opacity-100 backdrop-blur-md bg-black/10"
                        : "opacity-0 pointer-events-none"
                }`}
            />

            {/* ── Blur gradient background for compact nav ──
                 Separate from the nav so it doesn't interfere with mix-blend-mode.
                 Spans top-0 to 10px below the nav bottom edge (h-10/h-11 + 10px).
                 Fades from full blur at top to transparent at the bottom edge. */}
            <div
                className={`fixed top-0 left-0 right-0 pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isCompactVisible ? "translate-y-0" : "-translate-y-full"
                }`}
                style={{
                    zIndex: 49,
                    height: "62px", /* h-16 (64px) nav, button bottom at 52px, +10px */
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                }}
            />

            {/* ══════════════ COMPACT NAVBAR ══════════════ */}
            <nav
                ref={compactNavRef}
                className={`header-font fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isCompactVisible ? "translate-y-0" : "-translate-y-full"
                }`}
                style={compactNavBlendStyle}
                onMouseEnter={handleCompactNavMouseEnter}
                onMouseLeave={handleCompactMouseLeave}
            >
                <div className="relative mx-auto w-full max-w-screen-2xl">
                    {/* Pill — only shown when compact menu open */}
                    <div className={`absolute inset-y-0 left-(--container-padding) right-(--container-padding) transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isCompactMenuOpen ? "bg-white rounded-tl-xs rounded-tr-xs" : "bg-transparent"
                    }`} />

                    <div className="relative px-[calc(var(--container-padding)+18px)]">
                        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center">
                            {/* Left: Logo */}
                            <Link href="/" className="flex shrink-0 items-center gap-2">
                                <div
                                    className="relative h-8 w-8 shrink-0"
                                    style={isCompactMenuOpen ? {} : { filter: "brightness(0) invert(1)" }}
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
                                    <Link href="#" className="group relative text-sm font-medium transition-opacity duration-300 hover:opacity-70">
                                        Product
                                        <span className="absolute left-0 -bottom-0.5 h-px w-0 transition-all duration-300 group-hover:w-full bg-current" />
                                    </Link>
                                    <Link href="/use-cases" className="group relative text-sm font-medium transition-opacity duration-300 hover:opacity-70">
                                        Use Cases
                                        <span className="absolute left-0 -bottom-0.5 h-px w-0 transition-all duration-300 group-hover:w-full bg-current" />
                                    </Link>
                                    <Link href="/technology" className="group relative text-sm font-medium transition-opacity duration-300 hover:opacity-70">
                                        Technology
                                        <span className="absolute left-0 -bottom-0.5 h-px w-0 transition-all duration-300 group-hover:w-full bg-current" />
                                    </Link>
                                </div>
                            </div>

                            {/* Right: CTA + Hamburger */}
                            <div className="col-start-3 flex items-center justify-end gap-2">
                                <Link
                                    href="/maps-gpt"
                                    className="hidden min-[1155px]:flex items-center justify-center h-10 px-4 text-sm font-semibold leading-none rounded-none border border-current transition-opacity duration-300 hover:opacity-70"
                                >
                                    Start Now
                                </Link>
                                <button
                                    onClick={handleCompactHamburgerClick}
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

                    {/* Mega Menu Dropdown */}
                    <div
                        className={`absolute top-full left-(--container-padding) right-(--container-padding) rounded-bl-xs rounded-br-xs transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isCompactMenuOpen
                                ? "opacity-100 translate-y-0 bg-white pointer-events-auto"
                                : "opacity-0 -translate-y-10 pointer-events-none"
                        }`}
                    >
                        <div className="pl-7 pr-(--container-padding) py-12" style={{ transitionDelay: isCompactMenuOpen ? "150ms" : "0ms" }}>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                                <div
                                    className={`md:col-span-5 space-y-8 transition-opacity duration-500 ${isCompactMenuOpen ? "opacity-100" : "opacity-0"}`}
                                    style={{ transitionDelay: isCompactMenuOpen ? "200ms" : "0ms" }}
                                >
                                    <div>
                                        <h4 className="text-xs font-semibold text-[#0A1344]/50 tracking-widest uppercase mb-4">
                                            <ScrambleText text="COLUMBUS EARTH" isActive={isCompactMenuOpen} delay={300} />
                                        </h4>
                                        <p className="text-[#0A1344]/70 text-base leading-relaxed max-w-md">
                                            Columbus Earth Inc. is a spatial frontier AI company building the first production
                                            Large Geospatial Model to answer the most difficult questions about our planet.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-2">
                                                <ScrambleText text="CONTACT" isActive={isCompactMenuOpen} delay={450} />
                                            </h4>
                                            <a href="mailto:contact@columbus.earth" className="text-[#0A1344] font-medium block transition-colors duration-300 hover:text-[#0A1344]/70">
                                                contact@columbus.earth
                                            </a>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-2">
                                                <ScrambleText text="SOCIAL" isActive={isCompactMenuOpen} delay={550} />
                                            </h4>
                                            <a href="https://www.linkedin.com/company/columbusearth/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-primary font-medium block transition-colors">
                                                LinkedIn
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-3"></div>
                                <div className="md:col-span-4 space-y-6">
                                    <h4
                                        className={`text-xs font-semibold text-gray-500 tracking-wider uppercase mb-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                            isCompactMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                        }`}
                                        style={{ transitionDelay: isCompactMenuOpen ? "250ms" : "0ms" }}
                                    >
                                        <ScrambleText text="COMPANY" isActive={isCompactMenuOpen} delay={400} />
                                    </h4>
                                    <ul className="space-y-4">
                                        {menuItems.map((item, index) => (
                                            <li
                                                key={item.href}
                                                className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                                    isCompactMenuOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                                                }`}
                                                style={{ transitionDelay: isCompactMenuOpen ? `${320 + index * 70 + index * index * 8}ms` : "0ms" }}
                                            >
                                                <Link
                                                    href={item.href}
                                                    onClick={() => { setIsCompactMenuOpen(false); setIsCompactManuallyToggled(false); }}
                                                    className="group relative text-xl font-medium text-[#0A1344] transition-all duration-300 flex items-center"
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
