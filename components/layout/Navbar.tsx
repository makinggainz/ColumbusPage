"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

const COMPACT_THRESHOLD = 80;

// ─────────────────────────────────────────────────────────────────────────────

export const Navbar = ({ theme = "light" }: { theme?: "light" | "dark" }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isManuallyToggled, setIsManuallyToggled] = useState(false);
    const [isScrolled, setIsScrolled] = useState(() =>
        typeof window !== "undefined" ? window.scrollY > 0 : false
    );
    const [hasScrolled, setHasScrolled] = useState(() =>
        typeof window !== "undefined" ? window.scrollY > 5 : false
    );
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
            if (y > 5) setHasScrolled(true);
            setIsCompactVisible(y > COMPACT_THRESHOLD);
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
    const handleMouseEnter = () => {};
    const handleMouseLeave = (e: React.MouseEvent) => {
        if (isManuallyToggled) return;
        const navBounds = navRef.current?.getBoundingClientRect();
        if (!navBounds) return;
        if (e.clientY <= navBounds.top) return;
        setIsMenuOpen(false);
    };
    const handleHamburgerClick = () => {};
    const handleNavMouseEnter = () => {
        if (isManuallyToggled && !isMenuOpen) setIsManuallyToggled(false);
        handleMouseEnter();
    };

    // ── Compact nav handlers ──────────────────────────────────────────
    const handleCompactMouseEnter = () => {};
    const handleCompactMouseLeave = (e: React.MouseEvent) => {
        if (isCompactManuallyToggled) return;
        const navBounds = compactNavRef.current?.getBoundingClientRect();
        if (!navBounds) return;
        if (e.clientY <= navBounds.top) return;
        setIsCompactMenuOpen(false);
    };
    const handleCompactHamburgerClick = () => {};
    const handleCompactNavMouseEnter = () => {
        if (isCompactManuallyToggled && !isCompactMenuOpen) setIsCompactManuallyToggled(false);
        handleCompactMouseEnter();
    };

    // ── Blend styles ──────────────────────────────────────────────────
    const navBlendStyle: React.CSSProperties = isMenuOpen
        ? { color: "#111111" }
        : isScrolled
        ? { mixBlendMode: "difference", color: "white" }
        : theme === "dark"
        ? { color: "white" }
        : { color: "#0A1344" };

    const compactNavBlendStyle: React.CSSProperties = theme === "dark"
        ? { color: "white" }
        : { color: "#111111" };

    // ── Dark theme tokens ─────────────────────────────────────────────
    const isDark = theme === "dark";

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
                style={{
                    ...navBlendStyle,
                    opacity: hasScrolled ? 1 : 0,
                    transform: hasScrolled ? "translateY(0)" : "translateY(-8px)",
                    transition: "opacity 1000ms ease, transform 1000ms ease",
                }}
                onMouseLeave={handleMouseLeave}
            >
                <div className="relative mx-auto w-full">
                    {/* Nav bar background pill — transparent by default, white when menu open */}
                    <div
                        className={`absolute inset-y-0 left-8 right-8 lg:left-10 lg:right-10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isMenuOpen ? "bg-white rounded-tl-xs rounded-tr-xs" : "bg-transparent rounded-xs"
                        }`}
                    />

                    <div className="relative px-8 lg:px-10">
                        <div className="grid h-14 md:h-17 grid-cols-[1fr_auto_1fr] items-center">
                            {/* Left: Logo */}
                            <Link href="/" className="flex w-fit shrink-0 items-center gap-2" onMouseEnter={handleNavMouseEnter}>
                                <div
                                    className="relative h-10 w-10 shrink-0"
                                    style={(isScrolled && !isMenuOpen) || (isDark && !isMenuOpen) ? { filter: "brightness(0) invert(1)" } : {}}
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
                                <div className={`hidden items-center gap-3 min-[1155px]:flex pointer-events-auto transition-opacity duration-300 ${!isScrolled && !isMenuOpen ? "opacity-70" : ""}`}>
                                    <Link href="#" className="text-md font-medium px-4 py-1.5 rounded-full border border-transparent hover:border-current/20 transition-all duration-300" onMouseEnter={handleNavMouseEnter}>
                                        Product
                                    </Link>
                                    <Link href="/use-cases" className="text-md font-medium px-4 py-1.5 rounded-full border border-transparent hover:border-current/20 transition-all duration-300" onMouseEnter={handleNavMouseEnter}>
                                        Use Cases
                                    </Link>
                                    <Link href="/technology" className="text-md font-medium px-4 py-1.5 rounded-full border border-transparent hover:border-current/20 transition-all duration-300" onMouseEnter={handleNavMouseEnter}>
                                        Technology
                                    </Link>
                                </div>
                            </div>

                            {/* Right: CTA + Hamburger */}
                            <div className="col-start-3 flex items-center justify-end gap-3">
                                <Link
                                    href="/maps-gpt"
                                    className={`hidden min-[1155px]:flex items-center justify-center px-6 py-3.5 text-md font-semibold leading-none rounded-full border transition-opacity duration-300 hover:opacity-70 ${
                                        isScrolled
                                            ? "border-current bg-transparent"
                                            : isDark
                                            ? "border-white/50 bg-transparent text-white"
                                            : "border-[#0A1344] bg-transparent text-[#0A1344]"
                                    }`}
                                    onMouseEnter={handleNavMouseEnter}
                                >
                                    Start Now
                                </Link>
                                <button
                                    onClick={handleHamburgerClick}
                                    onMouseEnter={handleNavMouseEnter}
                                    className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${isDark && !isMenuOpen ? "border-white/50" : "border-current"}`}
                                    aria-label="Toggle menu"
                                >
                                    <div className={`absolute h-px w-5.5 bg-current transform-gpu transition-all duration-300 ease-in-out ${isMenuOpen ? "rotate-45" : "-translate-y-1.5"}`} />
                                    <div className={`absolute h-px w-5.5 bg-current transition-all duration-200 ${isMenuOpen ? "opacity-0" : "opacity-100"}`} />
                                    <div className={`absolute h-px w-5.5 bg-current transform-gpu transition-all duration-300 ease-in-out ${isMenuOpen ? "-rotate-45" : "translate-y-1.5"}`} />
                                </button>
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

            {/* ── Blur gradient background for compact nav ── */}
            <div
                className={`fixed top-0 left-0 right-0 pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isCompactVisible ? "translate-y-0" : "-translate-y-full"
                }`}
                style={{
                    zIndex: 49,
                    height: "62px",
                    background: isDark ? "rgba(6, 8, 20, 0.88)" : "rgba(248, 249, 252, 0.88)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.07)",
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
                <div className="relative mx-auto w-full">
                    <div
                        className={`absolute inset-y-0 left-8 right-8 lg:left-10 lg:right-10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isCompactMenuOpen ? "rounded-tl-xs rounded-tr-xs" : ""
                        }`}
                    />

                    <div className="relative px-8 lg:px-10">
                        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center">
                            {/* Left: Logo */}
                            <Link href="/" className="flex w-fit shrink-0 items-center gap-2" onMouseEnter={handleCompactNavMouseEnter}>
                                <div
                                    className="relative h-8 w-8 shrink-0"
                                    style={isDark ? { filter: "brightness(0) invert(1)" } : {}}
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
                                <div className="hidden items-center gap-3 min-[1155px]:flex pointer-events-auto">
                                    <Link href="#" className="text-sm font-medium px-3.5 py-1.5 rounded-full border border-transparent hover:border-current/20 transition-all duration-300" onMouseEnter={handleCompactNavMouseEnter}>
                                        Product
                                    </Link>
                                    <Link href="/use-cases" className="text-sm font-medium px-3.5 py-1.5 rounded-full border border-transparent hover:border-current/20 transition-all duration-300" onMouseEnter={handleCompactNavMouseEnter}>
                                        Use Cases
                                    </Link>
                                    <Link href="/technology" className="text-sm font-medium px-3.5 py-1.5 rounded-full border border-transparent hover:border-current/20 transition-all duration-300" onMouseEnter={handleCompactNavMouseEnter}>
                                        Technology
                                    </Link>
                                </div>
                            </div>

                            {/* Right: CTA + Hamburger */}
                            <div className="col-start-3 flex items-center justify-end gap-2">
                                <Link
                                    href="/maps-gpt"
                                    className={`hidden min-[1155px]:flex items-center justify-center h-10 px-4 text-sm font-semibold leading-none rounded-full border transition-opacity duration-300 hover:opacity-70 ${
                                        isDark
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
                                    className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${isDark && !isCompactMenuOpen ? "border-white/30" : "border-current"}`}
                                    aria-label="Toggle menu"
                                >
                                    <div className={`absolute h-px w-4.5 bg-current transform-gpu transition-all duration-300 ease-in-out ${isCompactMenuOpen ? "rotate-45" : "-translate-y-1.25"}`} />
                                    <div className={`absolute h-px w-4.5 bg-current transition-all duration-200 ${isCompactMenuOpen ? "opacity-0" : "opacity-100"}`} />
                                    <div className={`absolute h-px w-4.5 bg-current transform-gpu transition-all duration-300 ease-in-out ${isCompactMenuOpen ? "-rotate-45" : "translate-y-1.25"}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </nav>
        </>
    );
};
