"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

import { ScrambleText } from "@/components/ui/ScrambleText";
import glassStyles from "@/components/ui/GlassButton.module.css";

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

export const Navbar = ({ theme = "light", wide = false }: { theme?: "light" | "dark"; wide?: boolean }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isManuallyToggled, setIsManuallyToggled] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isCompact, setIsCompact] = useState(false);
    // Links only appear once hero CTA has scrolled out of view (or immediately on products page)
    const [showLinks, setShowLinks] = useState(false);
    const [inHeroTransition, setInHeroTransition] = useState(false);
    const [heroTransitionStarted, setHeroTransitionStarted] = useState(false);
    const [footerInView, setFooterInView] = useState(false);
    const [isWideScreen, setIsWideScreen] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth >= NAV_BREAKPOINT : true
    );
    const [bgTriggerPassed, setBgTriggerPassed] = useState(false);
    const pathname = usePathname();
    const isProductsPage = pathname === "/mapsgpt";
    const showWordmarkOnMobile = pathname === "/" || pathname === "/our-mission" || pathname === "/contact";
    const navRef = useRef<HTMLElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Sync scroll state before first paint to prevent navbar flash on reload
    useLayoutEffect(() => {
        let scrolled = window.scrollY > 5;
        try {
            if (sessionStorage.getItem("navbar-scrolled") === "true") scrolled = true;
        } catch {}
        if (scrolled) setHasScrolled(true);
        setIsCompact(window.scrollY > COMPACT_THRESHOLD);
    }, []);

    useEffect(() => {
        const handleReveal = () => setHasScrolled(true);
        window.addEventListener("hero-reveal", handleReveal);

        // Background + resize on any scroll
        const handleScroll = () => {
            const y = window.scrollY;
            if (y > 5) {
                setHasScrolled(true);
                try { sessionStorage.setItem("navbar-scrolled", "true"); } catch {}
            } else {
                try { sessionStorage.setItem("navbar-scrolled", "false"); } catch {}
            }
            setIsCompact(y > COMPACT_THRESHOLD);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });

        // Track viewport width for hamburger/nav-links breakpoint
        const handleResize = () => setIsWideScreen(window.innerWidth >= NAV_BREAKPOINT);
        handleResize(); // Correct SSR default on mount
        window.addEventListener("resize", handleResize);

        // Nav links appear only after hero CTA leaves viewport (non-products pages)
        const cta = document.getElementById("hero-cta");
        let ctaObs: IntersectionObserver | undefined;
        if (cta) {
            ctaObs = new IntersectionObserver(
                ([entry]) => setShowLinks(!entry.isIntersecting),
                { threshold: 0 }
            );
            ctaObs.observe(cta);
        } else {
            setShowLinks(true);
        }

        // Products page: track hero transition scroll zone to hide/show links
        let heroTransitionHandler: (() => void) | undefined;
        if (wide) {
            const heroOuter = document.querySelector<HTMLElement>("[data-hero-outer]");
            if (heroOuter) {
                heroTransitionHandler = () => {
                    const rect = heroOuter.getBoundingClientRect();
                    const extraPx = window.innerHeight * 2;
                    const raw = Math.max(0, Math.min(1, -rect.top / extraPx));
                    const transitioning = raw > 0.05 && raw < 0.95;
                    setInHeroTransition(transitioning);
                    if (transitioning) setHeroTransitionStarted(true);
                    if (raw <= 0.05) setHeroTransitionStarted(false);
                };
                window.addEventListener("scroll", heroTransitionHandler, { passive: true });
            }
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

        // Products page: show navbar bg only when "We work with data" section enters view
        const bgTrigger = document.querySelector("[data-navbar-bg-trigger]");
        let bgTriggerObs: IntersectionObserver | undefined;
        if (bgTrigger) {
            bgTriggerObs = new IntersectionObserver(
                ([entry]) => setBgTriggerPassed(entry.boundingClientRect.top <= 0),
                { threshold: 0 }
            );
            bgTriggerObs.observe(bgTrigger);
        }

        return () => {
            ctaObs?.disconnect();
            footerObs?.disconnect();
            bgTriggerObs?.disconnect();
            if (heroTransitionHandler) window.removeEventListener("scroll", heroTransitionHandler);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("hero-reveal", handleReveal);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Enable transitions after first paint (rAF fires after paint, so useLayoutEffect
    // state updates render with transition:"none" → navbar appears instantly on reload)
    const [navMounted, setNavMounted] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setNavMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    // Products page: show navbar after entrance animation completes (phone slides in at t=1500ms)
    useEffect(() => {
        if (!isProductsPage || window.scrollY > 5) return;
        const t = setTimeout(() => { if (window.scrollY <= 5) setHasScrolled(true); }, 1700);
        return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Polling fallback for late scroll restoration (mobile, slow devices, private browsing)
    useEffect(() => {
        const sync = () => {
            if (window.scrollY > 5) setHasScrolled(true);
            setIsCompact(window.scrollY > COMPACT_THRESHOLD);
        };
        const t1 = setTimeout(sync, 100);
        const t2 = setTimeout(sync, 300);
        const t3 = setTimeout(sync, 1000);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
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
        // Close dropdown when mouse leaves the browser window entirely
        const handleMouseLeaveDocument = () => {
            if (isMenuOpen) {
                setIsMenuOpen(false);
                setIsManuallyToggled(false);
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        document.documentElement.addEventListener("mouseleave", handleMouseLeaveDocument);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.documentElement.removeEventListener("mouseleave", handleMouseLeaveDocument);
        };
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
        ...(wide ? {} : { color: "#111111" }),
        transition: `font-size ${t}`,
    });

    // On products page: nav links at top or after white bg; CTA also shows after hero transition
    const linksVisible = wide
        ? hasScrolled && (!heroTransitionStarted || bgTriggerPassed)
        : showLinks;
    const ctaVisible = wide
        ? hasScrolled && (!heroTransitionStarted || !inHeroTransition || bgTriggerPassed)
        : showLinks;

    return (
        <>
            {/* ── Backdrop overlay (dropdown open) ── */}
            <div
                className={`fixed inset-0 z-40 ${
                    isMenuOpen
                        ? "pointer-events-auto"
                        : "pointer-events-none"
                }`}
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    backdropFilter: isMenuOpen ? "blur(12px)" : "blur(0px)",
                    WebkitBackdropFilter: isMenuOpen ? "blur(12px)" : "blur(0px)",
                    opacity: isMenuOpen ? 1 : 0,
                    transition: isMenuOpen
                        ? "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1) 100ms, backdrop-filter 600ms cubic-bezier(0.16, 1, 0.3, 1) 100ms, -webkit-backdrop-filter 600ms cubic-bezier(0.16, 1, 0.3, 1) 100ms"
                        : "opacity 400ms ease 50ms, backdrop-filter 400ms ease, -webkit-backdrop-filter 400ms ease",
                }}
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
                    transition: navMounted ? `opacity 600ms ease, transform 600ms ease, color ${t}` : "none",
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
                        opacity: (isProductsPage ? bgTriggerPassed : isCompact) && !isMenuOpen ? 1 : 0,
                        transition: `opacity ${t}`,
                    }}
                />

                <div className="relative mx-auto w-full" style={{ maxWidth: wide ? 1408 : 1287 }}>
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

                    <div className={`relative ${wide ? "px-8 min-[1408px]:px-0" : "px-8 min-[1287px]:px-0"}`}>
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
                                <Link href="/" className="flex w-fit shrink-0 items-center gap-2" onMouseEnter={isWideScreen ? handleNavMouseEnter : undefined}>
                                    <div
                                        data-navbar-logo
                                        className="relative shrink-0"
                                        style={{
                                            width: isCompact ? 36 : 40,
                                            height: isCompact ? 36 : 40,
                                            transition: `width ${t}, height ${t}, filter ${t}, opacity 0.4s ease`,
                                            filter: (isDark && !isMenuOpen) ? "brightness(0) invert(1)" : "none",
                                            opacity: hasScrolled ? 1 : 0,
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
                                        className={`brand-wordmark font-medium leading-none whitespace-nowrap ${wide && !bgTriggerPassed ? glassStyles.glassTextStatic : ""}`}
                                        style={{
                                            fontSize: isCompact ? 20 : 24,
                                            letterSpacing: "-0.02em",
                                            transition: `font-size ${t}, opacity 0.4s ease`,
                                            opacity: (!isWideScreen && !showWordmarkOnMobile) ? 0 : hasScrolled && (!ctaVisible || isWideScreen) ? 1 : 0,
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
                                        pointerEvents: linksVisible ? "auto" : "none",
                                        paddingRight: linksVisible ? 16 : 0,
                                        marginRight: linksVisible ? 16 : 0,
                                        transition: `padding-right 400ms cubic-bezier(0.22, 1, 0.36, 1), margin-right 400ms cubic-bezier(0.22, 1, 0.36, 1)`,
                                    }}
                                >
                                    {[
                                        { label: "Product", href: "/enterprise" },
                                        { label: "Use Cases", href: "/use-cases" },
                                        { label: "Technology", href: "/technology" },
                                    ].map((link, i) => (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className={`${navLinkClass} ${wide ? glassStyles.glassTextStatic : ""}`}
                                            style={{
                                                ...navLinkInline(isCompact),
                                                whiteSpace: "nowrap",
                                                opacity: linksVisible ? 1 : 0,
                                                transform: linksVisible ? "translateX(0)" : "translateX(8px)",
                                                transition: `opacity 350ms ease ${i * 80}ms, transform 400ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 80}ms, font-size ${t}`,
                                            }}
                                            onMouseEnter={handleNavMouseEnter}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>

                                {/* CTA + Hamburger wrapper — isolates hamburger from CTA width animation */}
                                <div className="relative flex items-center" style={{ flexShrink: 0 }}>

                                    {/* Start Now — appears after hero CTA leaves viewport */}
                                    {/* Position wrapper: on mobile products page, absolutely positioned to keep CTA
                                        out of flex flow so it can't push the hamburger. On desktop, display:contents
                                        makes this wrapper invisible to layout so the Link flows normally. */}
                                    <div className="navbar-cta-wrapper" style={{
                                        ["--cta-right" as string]: wide ? "52px" : "46px",
                                    }}>
                                        <Link
                                            href="/maps-gpt"
                                            className={`group flex items-center justify-between leading-none whitespace-nowrap hover:opacity-90 transition-opacity ${wide ? glassStyles.btn : ""}`}
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                height: 45,
                                                gap: isWideScreen ? 12 : 6,
                                                width: ctaVisible ? 145 : 0,
                                                opacity: ctaVisible ? 1 : 0,
                                                overflow: "hidden",
                                                pointerEvents: ctaVisible ? "auto" : "none",
                                                paddingLeft: ctaVisible ? 20 : 0,
                                                paddingRight: ctaVisible ? 16 : 0,
                                                marginRight: 0,
                                                transition: `width ${t}, opacity 300ms ease, padding ${t}`,
                                                ...(wide
                                                    ? { backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }
                                                    : { backgroundColor: "#000000", color: "white" }),
                                            }}
                                        >
                                            <span
                                                className={`transition-colors duration-300 ${wide ? (isProductsPage ? "text-black" : isMenuOpen ? "text-black" : "text-white") : ""} group-hover:text-[#2563EB]`}
                                                style={{
                                                    opacity: ctaVisible ? 1 : 0,
                                                    transition: ctaVisible
                                                        ? "opacity 200ms ease 450ms, color 300ms"
                                                        : "opacity 100ms ease",
                                                }}
                                            >Start Now</span>
                                            <svg
                                                className="transition-transform duration-300 group-hover:translate-x-0.5"
                                                width="10" height="18" viewBox="0 0 7 12" fill="none"
                                                stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                                style={{
                                                    opacity: ctaVisible ? 1 : 0,
                                                    transition: ctaVisible
                                                        ? "opacity 200ms ease 500ms, transform 300ms"
                                                        : "opacity 80ms ease",
                                                }}
                                            >
                                                <path d="M1 1l5 5-5 5" />
                                            </svg>
                                        </Link>
                                    </div>

                                    {/* Hamburger — hides when nav links are visible on desktop */}
                                    <button
                                        onClick={handleHamburgerClick}
                                        onMouseEnter={handleNavMouseEnter}
                                        className={`relative flex items-center justify-center transition-all duration-300 ${wide ? glassStyles.togglePill : "rounded-none"}`}
                                        style={{
                                            flexShrink: 0,
                                            ...(wide
                                                ? {
                                                    width: linksVisible && isWideScreen ? 0 : 45,
                                                    height: 45,
                                                    borderRadius: "999px",
                                                    transform: linksVisible && isWideScreen ? "scale(0)" : "scale(1)",
                                                    opacity: linksVisible && isWideScreen ? 0 : 1,
                                                    marginLeft: linksVisible && isWideScreen ? 0 : (isWideScreen && (linksVisible || ctaVisible) ? 16 : 0),
                                                    pointerEvents: linksVisible && isWideScreen ? "none" : "auto",
                                                    transition: `transform 400ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms cubic-bezier(0.22, 1, 0.36, 1), width 400ms cubic-bezier(0.22, 1, 0.36, 1), margin-left 400ms cubic-bezier(0.22, 1, 0.36, 1)`,
                                                }
                                                : {
                                                    width: (linksVisible && isWideScreen) ? 0 : 45,
                                                    height: 45,
                                                    opacity: (linksVisible && isWideScreen) ? 0 : 1,
                                                    pointerEvents: (linksVisible && isWideScreen) ? "none" : "auto",
                                                    transition: `width ${t}, opacity 120ms ease, margin-left ${t}`,
                                                }),
                                            overflow: "hidden",
                                        }}
                                        aria-label="Toggle menu"
                                    >
                                        {/* Bars delayed until container expansion finishes */}
                                        {(() => {
                                            const hamburgerHidden = linksVisible && isWideScreen && !wide;
                                            const barsOpacity = hamburgerHidden ? 0 : 1;
                                            const barsTransition = hamburgerHidden
                                                ? "opacity 80ms ease"
                                                : "opacity 200ms ease 450ms";
                                            return (<>
                                                <div
                                                    className="absolute h-px bg-current transform-gpu"
                                                    style={{
                                                        width: 22,
                                                        opacity: barsOpacity,
                                                        transform: isMenuOpen ? "rotate(45deg)" : "translateY(-6px)",
                                                        transition: `transform 300ms ease-in-out, ${barsTransition}`,
                                                    }}
                                                />
                                                <div
                                                    className="absolute h-px bg-current"
                                                    style={{
                                                        width: 22,
                                                        opacity: isMenuOpen ? 0 : barsOpacity,
                                                        transition: `${barsTransition}, ${isMenuOpen ? "opacity 200ms ease" : ""}`,
                                                    }}
                                                />
                                                <div
                                                    className="absolute h-px bg-current transform-gpu"
                                                    style={{
                                                        width: 22,
                                                        opacity: barsOpacity,
                                                        transform: isMenuOpen ? "rotate(-45deg)" : "translateY(6px)",
                                                        transition: `transform 300ms ease-in-out, ${barsTransition}`,
                                                    }}
                                                />
                                            </>);
                                        })()}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </nav>

            {/* ── Dropdown (outside nav so fixed positioning isn't broken by nav's transform) ── */}
            <div
                ref={dropdownRef}
                className="fixed left-0 right-0 max-md:bottom-0 z-50 overflow-y-auto"
                style={{
                    ...dropdownBg,
                    top: isCompact ? 56 : 68,
                    clipPath: isMenuOpen
                        ? "circle(150% at calc(100% - 48px) 0px)"
                        : "circle(0% at calc(100% - 48px) 0px)",
                    opacity: isMenuOpen ? 1 : 0,
                    pointerEvents: isMenuOpen ? "auto" : "none",
                    transition: isMenuOpen
                        ? "clip-path 750ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease"
                        : "clip-path 550ms cubic-bezier(0.4, 0, 0.2, 1) 80ms, opacity 300ms ease 250ms",
                }}
                onMouseLeave={handleDropdownMouseLeave}
            >
                <div className={`mx-auto w-full px-6 md:px-8 ${wide ? "min-[1408px]:px-0" : "min-[1287px]:px-0"} py-8 md:py-12`} style={{ maxWidth: wide ? 1408 : 1287 }}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                        <div
                            className="md:col-span-5 space-y-6 md:space-y-8"
                            style={{
                                opacity: isMenuOpen ? 1 : 0,
                                transform: isMenuOpen ? "translateY(0) scale(1)" : "translateY(12px) scale(0.98)",
                                transition: isMenuOpen
                                    ? "opacity 450ms ease 250ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 250ms"
                                    : "opacity 200ms ease, transform 200ms ease",
                            }}
                        >
                            <div>
                                <h4 className={`text-[13px] font-medium tracking-[0.08em] uppercase mb-3 md:mb-4 ${dropdownHeadingClass}`}>
                                    <ScrambleText text="COLUMBUS EARTH" isActive={isMenuOpen} delay={350} />
                                </h4>
                                <p className={`text-[16px] leading-[1.6] max-w-md ${dropdownBodyClass}`}>
                                    Columbus Earth Inc. is a spatial frontier AI company building the first production
                                    Large Geospatial Model to answer the most difficult questions about our planet.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-6 md:gap-8">
                                <div>
                                    <h4 className={`text-[13px] font-medium tracking-[0.08em] uppercase mb-2 ${dropdownSubheadClass}`}>
                                        <ScrambleText text="CONTACT" isActive={isMenuOpen} delay={500} />
                                    </h4>
                                    <a href="mailto:contact@columbus.earth" className={`text-[16px] font-medium block transition-colors duration-300 break-all hover:text-[#2563EB] ${dropdownLinkClass}`}>
                                        contact@columbus.earth
                                    </a>
                                </div>
                                <div>
                                    <h4 className={`text-[13px] font-medium tracking-[0.08em] uppercase mb-2 ${dropdownSubheadClass}`}>
                                        <ScrambleText text="SOCIAL" isActive={isMenuOpen} delay={600} />
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
                                className={`text-[13px] font-medium tracking-[0.08em] uppercase mb-4 ${dropdownSubheadClass}`}
                                style={{
                                    opacity: isMenuOpen ? 1 : 0,
                                    transform: isMenuOpen ? "translateY(0)" : "translateY(8px)",
                                    transition: isMenuOpen
                                        ? "opacity 400ms ease 300ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 300ms"
                                        : "opacity 150ms ease, transform 150ms ease",
                                }}
                            >
                                <ScrambleText text="COMPANY" isActive={isMenuOpen} delay={400} />
                            </h4>
                            <ul className="space-y-4">
                                {menuItems.map((item, index) => (
                                    <li
                                        key={item.href}
                                        style={{
                                            opacity: isMenuOpen ? 1 : 0,
                                            transform: isMenuOpen
                                                ? "translateY(0) scale(1)"
                                                : "translateY(16px) scale(0.96)",
                                            transition: isMenuOpen
                                                ? `opacity 400ms ease ${350 + index * 60}ms, transform 550ms cubic-bezier(0.16, 1, 0.3, 1) ${350 + index * 60}ms`
                                                : `opacity 150ms ease ${(menuItems.length - 1 - index) * 30}ms, transform 150ms ease ${(menuItems.length - 1 - index) * 30}ms`,
                                        }}
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
