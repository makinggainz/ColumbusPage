"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

import { ScrambleText } from "@/components/ui/ScrambleText";
import glassStyles from "@/components/ui/GlassButton.module.css";
import { PRODUCTS } from "@/lib/products";
import { useDeferredVideoLoad } from "@/lib/useDeferredVideoLoad";

const COMPACT_THRESHOLD = 10;
const NAV_BREAKPOINT = 900;
/** Tighter end of the range: column width is midpoint between full measured width and this (px). */
const DROPDOWN_LEFT_COL_MAX_WIDTH_PX = 352;

// ─────────────────────────────────────────────────────────────────────────────

export const Navbar = ({ theme = "light", wide = false }: { theme?: "light" | "dark"; wide?: boolean }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    /* Tracks what triggered the dropdown. "products" means the user
       hovered the Products nav link — in that case the dropdown hides
       the COLUMBUS EARTH / CONTACT / SOCIAL column and shows the product
       cards centered in its place. "company" means the user hovered the
       Company nav link — the left column stays visible and the right
       area shows a company image plus Blog/Company links. Any other
       trigger (logo hover, hamburger, etc.) falls back to the default
       dropdown layout. */
    const [hoverKind, setHoverKind] = useState<"products" | "company" | "use-cases" | null>(null);
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
    const [island2Reached, setIsland2Reached] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === "/";
    const isProductsPage = pathname === "/products/mapsgpt";
    const isUseCasesPage = pathname === "/products/enterprise" || pathname === "/columbus-solutions" || pathname === "/research-applications";
    const isEnterprisePage = pathname === "/products/enterprise";
    const isContactPage = pathname === "/contact";
    const showWordmarkOnMobile = pathname === "/" || pathname === "/mission" || pathname === "/contact";
    const navRef = useRef<HTMLElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigationCooldownRef = useRef(false);
    /* Refs used to compute dropdown column alignment. The dropdown mirrors
       the navbar's x-structure — left column ends at PRODUCTS_LEFT − GAP,
       right column spans PRODUCTS_LEFT → CTA_RIGHT. See
       design-system/navbar-dropdown.md for the full spec. */
    const productsLinkRef = useRef<HTMLAnchorElement | null>(null);
    const companyLinkRef = useRef<HTMLAnchorElement | null>(null);
    const useCasesLinkRef = useRef<HTMLAnchorElement | null>(null);
    const ctaRef = useRef<HTMLAnchorElement | null>(null);
    const productsColRef = useRef<HTMLDivElement | null>(null);
    const leftColRef = useRef<HTMLDivElement | null>(null);
    const elioVideoRef = useRef<HTMLVideoElement | null>(null);
    const [elioHovered, setElioHovered] = useState(false);
    const [productsAlign, setProductsAlign] = useState<
        { padLeft: number; padRight: number; leftMaxWidth: number } | null
    >(null);
    /* Company-hover only: image is shifted left (anchored to the Mission/Vision/Blog ul),
       Mission/Vision/Blog ul is absolute-positioned to align with the Company nav link,
       the CONTACT/SOCIAL dl's bottom is pulled up to match the image bottom,
       and extraMb shrinks the dropdown further so the image-bottom-to-dropdown-bottom
       gap matches the default (cards-bottom-to-dropdown-bottom) gap. */
    const [companyAlign, setCompanyAlign] = useState<
        { imageMl: number; ulLeft: number; dlMb: number; extraMb: number } | null
    >(null);

    // Sync scroll state before first paint to prevent navbar flash on reload
    useLayoutEffect(() => {
        let scrolled = window.scrollY > 5;
        try {
            if (sessionStorage.getItem("navbar-scrolled") === "true") scrolled = true;
        } catch {}
        if (scrolled) setHasScrolled(true);
        // Pages without a hero entrance animation: navbar visible immediately
        if (!isHomePage && !isProductsPage) setHasScrolled(true);
        setIsCompact(window.scrollY > COMPACT_THRESHOLD);
    }, []);

    // Close dropdown on route change and suppress hover reopening briefly
    useEffect(() => {
        setIsMenuOpen(false);
        setIsManuallyToggled(false);
        navigationCooldownRef.current = true;
        const t = setTimeout(() => { navigationCooldownRef.current = false; }, 400);
        return () => clearTimeout(t);
    }, [pathname]);

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
                // Cache the scroll threshold beyond which hero is fully past
                const heroBottom = heroOuter.offsetTop + heroOuter.offsetHeight;
                heroTransitionHandler = () => {
                    // Cheap check: skip expensive getBoundingClientRect when well past hero
                    if (window.scrollY > heroBottom) return;
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

        // Homepage: show navbar border once vertical grid lines reach full opacity (~192px into Island 2)
        const island2 = document.querySelector("[data-island-2]");
        let island2Obs: IntersectionObserver | undefined;
        if (island2) {
            island2Obs = new IntersectionObserver(
                ([entry]) => {
                    // Show border when island 2 enters, keep it unless user scrolls back above it
                    if (entry.isIntersecting) {
                        setIsland2Reached(true);
                    } else if (entry.boundingClientRect.top > 0) {
                        // Only hide if island 2 is below the viewport (scrolled back up)
                        setIsland2Reached(false);
                    }
                },
                { threshold: 0, rootMargin: "-192px 0px 0px 0px" }
            );
            island2Obs.observe(island2);
        }

        return () => {
            ctaObs?.disconnect();
            footerObs?.disconnect();
            bgTriggerObs?.disconnect();
            island2Obs?.disconnect();
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

    // Use-cases & enterprise page: navbar visible immediately (no hero entrance animation)
    useEffect(() => {
        if (!isUseCasesPage && !isEnterprisePage) return;
        setHasScrolled(true);
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

    // Close dropdown when mouse leaves nav area (desktop only — touch-emulated mousemove must be ignored)
    useEffect(() => {
        let lastTouchTime = 0;
        const onTouch = () => { lastTouchTime = Date.now(); };
        const handleMouseMove = (e: MouseEvent) => {
            if (Date.now() - lastTouchTime < 500) return; // ignore touch-emulated mouse events
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
        window.addEventListener("touchstart", onTouch, { passive: true });
        window.addEventListener("mousemove", handleMouseMove);
        document.documentElement.addEventListener("mouseleave", handleMouseLeaveDocument);
        return () => {
            window.removeEventListener("touchstart", onTouch);
            window.removeEventListener("mousemove", handleMouseMove);
            document.documentElement.removeEventListener("mouseleave", handleMouseLeaveDocument);
        };
    }, [isMenuOpen, isManuallyToggled]);

    /* Measure the navbar's x-anchors and compute padding/width values.
       The right column spans col-start-1 / col-span-12 (full grid width);
       its inline paddings push content to align with navbar anchors:
         - left column max-width  = PRODUCTS_LEFT − GRID_LEFT − GAP
         - right column padLeft   = PRODUCTS_LEFT − GRID_LEFT
         - right column padRight  = GRID_RIGHT − CTA_RIGHT
       See design-system/navbar-dropdown.md for the full zone model. */
    useEffect(() => {
        const GAP = 40; // minimum gap between left-zone end and right-zone start
        const compute = () => {
            const link = productsLinkRef.current;
            const cta = ctaRef.current;
            const col = productsColRef.current;
            const leftCol = leftColRef.current;
            if (!link || !cta || !col || !leftCol) return;
            const l = link.getBoundingClientRect();
            const c = cta.getBoundingClientRect();
            const k = col.getBoundingClientRect();
            const lc = leftCol.getBoundingClientRect();
            const padLeft = Math.max(0, l.left - k.left);
            const padRight = Math.max(0, k.right - c.right);
            const leftMaxWidth = Math.max(0, l.left - lc.left - GAP);
            setProductsAlign((prev) => {
                if (
                    prev
                    && Math.abs(prev.padLeft - padLeft) < 0.5
                    && Math.abs(prev.padRight - padRight) < 0.5
                    && Math.abs(prev.leftMaxWidth - leftMaxWidth) < 0.5
                ) return prev;
                return { padLeft, padRight, leftMaxWidth };
            });
            /* Company-hover alignment. Pulls the image left to the dropdown's
               left content edge (image.left = leftCol.left), absolute-positions
               the Mission/Vision/Blog ul to align with the Company nav link,
               and lifts the CONTACT/SOCIAL dl up so its bottom matches the
               image bottom. */
            const company = companyLinkRef.current;
            if (company) {
                const cl = company.getBoundingClientRect();
                const NAV_LINK_PX = 12; // matches navLinkClass's `px-3`
                const COMPANY_IMAGE_WIDTH = 350; // matches image's max-w-[350px]
                const COMPANY_IMAGE_GAP_TO_UL = 24; // small gap between image and the Mission/Vision/Blog ul
                // Image rendered height: 350 * (10/16) = 218.75 ≈ 219px (max-w-[350px] aspect-[16/10]).
                const COMPANY_IMAGE_HEIGHT = 219;
                const ulLeft = cl.left - (k.left + padLeft) + NAV_LINK_PX;
                const imageMl = ulLeft - COMPANY_IMAGE_GAP_TO_UL - COMPANY_IMAGE_WIDTH;
                // Predict the leftCol bottom (= grid row bottom = productsCol bottom)
                // in the company-hover state instead of measuring it. Direct measurement
                // is unreliable because productsCol's padding is 0 in products-hover and
                // padLeft+padRight in company-hover. That padding controls the cards
                // content width, the cards have aspect-[16/10] images, so the cards'
                // rendered height — and therefore productsCol.height and lc.bottom —
                // depend on hoverKind. If we measure during products-hover at a narrow
                // viewport we capture the taller layout (cards at full 760), bake that
                // into extraMb, and the dropdown clips the company image when the user
                // transitions to company. Calculating from padLeft/padRight (which are
                // independent of current hoverKind) avoids that.
                const CARDS_GAP = 24;            // gap-6 between the two product cards
                const CARDS_MAX_WIDTH = 760;     // md:max-w-[760px] on the cards grid
                const CARDS_TEXT_BLOCK = 72.5;   // mt-5 (20) + h5 leading-[1.2]@20px (24) + mt-1.5 (6) + p leading-[1.5]@15px (22.5)
                const EYEBROW_BLOCK = 35.5;      // h4 (line-height 1.5 inherited @ 13px = 19.5) + mb-4 (16)
                const productsColOuter = k.right - k.left;
                const productsColContentInCompany = productsColOuter - padLeft - padRight;
                const cardsGridWidth = Math.min(productsColContentInCompany, CARDS_MAX_WIDTH);
                const cardWidth = (cardsGridWidth - CARDS_GAP) / 2;
                const cardImageHeight = cardWidth * (10 / 16);
                const cardHeight = cardImageHeight + CARDS_TEXT_BLOCK;
                const productsColHeightInCompany = EYEBROW_BLOCK + cardHeight;
                const expectedLcBottom = k.top + productsColHeightInCompany;
                const imBottomAtRest = k.top + COMPANY_IMAGE_HEIGHT;
                const dlMb = Math.max(0, expectedLcBottom - imBottomAtRest);
                const extraMb = Math.max(0, expectedLcBottom - imBottomAtRest - 20);
                setCompanyAlign((prev) => {
                    if (
                        prev
                        && Math.abs(prev.imageMl - imageMl) < 0.5
                        && Math.abs(prev.ulLeft - ulLeft) < 0.5
                        && Math.abs(prev.dlMb - dlMb) < 0.5
                        && Math.abs(prev.extraMb - extraMb) < 0.5
                    ) return prev;
                    return { imageMl, ulLeft, dlMb, extraMb };
                });
            }
        };
        compute();
        // Re-measure after the dropdown's open animation (refs need to be mounted).
        const t = window.setTimeout(compute, 50);
        window.addEventListener("resize", compute);
        return () => {
            window.clearTimeout(t);
            window.removeEventListener("resize", compute);
        };
    }, [isMenuOpen, isCompact, isWideScreen]);

    /* Deferred Elio video preload — shared with the hero Products popup.
       Keeps preload="none" until the menu opens, then schedules .load()
       during the next idle window after the entrance animation. */
    useDeferredVideoLoad(elioVideoRef, isMenuOpen);

    // ── Handlers ────────────────────────────────────────────────────────
    const handleMouseEnter = () => {
        if (!isManuallyToggled && !navigationCooldownRef.current) setIsMenuOpen(true);
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
        setHoverKind(null);
    };

    // ── Theme ───────────────────────────────────────────────────────────
    const isDark = theme === "dark";

    const navColor = isMenuOpen
        ? (isUseCasesPage && isDark ? "white" : "#111111")
        : isCompact
        ? (isDark ? "white" : "#0A1344")
        : isDark
        ? "white"
        : "#0A1344";

    // ── Dropdown tokens ─────────────────────────────────────────────────
    const dropdownBg = isDark
        ? { background: "rgba(6, 8, 20, 0.96)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }
        : { background: "rgba(248, 249, 252, 0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" };

    const dropdownHeadingClass = isDark ? "text-white/40" : "text-[#0A1344]/50";
    const dropdownBodyClass    = isDark ? "text-white/65" : "text-[#0A1344]/70";
    const dropdownLinkClass    = isDark ? "text-white"    : "text-[#0A1344]";
    const dropdownSubheadClass = isDark ? "text-white/40" : "text-gray-500";
    const dropdownSocialClass  = isDark ? "text-white hover:text-white/70" : "text-gray-900 hover:text-primary";
    const dropdownNavLinkClass = isDark ? "text-white"    : "text-[#0A1344]";

    const t = "500ms cubic-bezier(0.22, 1, 0.36, 1)";

    // ── Nav link style (Anthropic-style underline hover) ────────────────
    const navLinkClass = "group/nav flex items-center gap-2 px-3 py-1.5 cursor-pointer";
    const navLinkInline = (compact: boolean): React.CSSProperties => ({
        fontSize: compact ? 14 : 15,
        fontWeight: 400,
        letterSpacing: "-0.0025em",
        ...(wide ? {} : { color: isDark ? "white" : isEnterprisePage ? "#0A1344" : "#111111" }),
        transition: `font-size ${t}`,
    });

    // On products page: nav links at top or after white bg; CTA also shows after hero transition
    const linksVisible = wide
        ? hasScrolled && (!heroTransitionStarted || bgTriggerPassed)
        : showLinks;
    const ctaVisible = isContactPage ? false : wide
        ? hasScrolled && (!heroTransitionStarted || !inHeroTransition || bgTriggerPassed)
        : showLinks;

    return (
        <>
            {/* ── Backdrop overlay (dropdown open) ── */}
            <div
                className={`fixed inset-0 z-1040 ${
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
                        ? "opacity 400ms cubic-bezier(0.05, 0.7, 0.1, 1) 50ms, backdrop-filter 500ms cubic-bezier(0.05, 0.7, 0.1, 1) 50ms, -webkit-backdrop-filter 500ms cubic-bezier(0.05, 0.7, 0.1, 1) 50ms"
                        : "opacity 350ms ease 50ms, backdrop-filter 350ms ease, -webkit-backdrop-filter 350ms ease",
                }}
            />

            {/* ══════════════ NAVBAR ══════════════ */}
            <nav
                ref={navRef}
                className="header-font fixed top-0 left-0 right-0 z-1050"
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
                        background: isEnterprisePage && isDark ? "rgba(14, 16, 28, 0.95)" : isDark ? "rgba(6, 8, 20, 0.85)" : "rgba(255, 255, 255, 0.82)",
                        backdropFilter: "blur(20px) saturate(1.2)",
                        WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                        borderBottom: isProductsPage ? "none" : (isHomePage && !island2Reached) ? "none" : isEnterprisePage ? "1px solid rgba(255,255,255,0.10)" : isDark ? "1px solid rgba(255,255,255,0.06)" : isHomePage ? "1px solid rgba(37, 99, 235, 0.3)" : "1px solid rgba(0,0,0,0.06)",
                        opacity: (isProductsPage ? bgTriggerPassed : isCompact) && !isMenuOpen ? 1 : 0,
                        transition: `opacity ${t}`,
                    }}
                />

                <div className="relative mx-auto w-full" style={{ maxWidth: wide ? 1408 : 1287 }}>
                    {/* (navbar bg when dropdown open is now part of the dropdown itself) */}

                    <div className={`relative ${wide ? "px-6 min-[1408px]:px-0" : "px-6 min-[1287px]:px-0"}`}>
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
                                <Link href="/" className="flex w-fit shrink-0 items-center gap-2 cursor-pointer" onMouseEnter={isWideScreen ? () => { setHoverKind(null); handleNavMouseEnter(); } : undefined}>
                                    <div
                                        data-navbar-logo
                                        className="relative shrink-0"
                                        style={{
                                            width: isProductsPage ? (isCompact ? 36 : 40) : (isCompact ? 42 : 46),
                                            height: isProductsPage ? (isCompact ? 36 : 40) : (isCompact ? 42 : 46),
                                            transition: `width ${t}, height ${t}, filter ${t}, opacity 0.4s ease`,
                                            filter: (isDark && (!isMenuOpen || isUseCasesPage)) ? "brightness(0) invert(1)" : "none",
                                            opacity: hasScrolled ? 1 : 0,
                                        }}
                                    >
                                        <Image
                                            src="/logobueno.png"
                                            alt="Columbus Logo"
                                            fill
                                            sizes="46px"
                                            className="object-contain"
                                            priority
                                        />
                                    </div>
                                    <span
                                        className={`brand-wordmark font-semibold leading-none whitespace-nowrap ${wide && !bgTriggerPassed ? glassStyles.glassTextStatic : ""}`}
                                        style={{
                                            fontFamily: "var(--font-hero)",
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
                                    {([
                                        { label: "Products", href: "/products/enterprise", hasDropdown: true, kind: "products" as const },
                                        { label: "Research", href: "/technology" },
                                        { label: "Use Cases", href: "/columbus-solutions", hasDropdown: true, kind: "use-cases" as const },
                                        { label: "Company", href: "/mission", hasDropdown: true, kind: "company" as const },
                                    ] as const).map((link, i) => (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            ref={
                                                (link as { kind?: "products" | "company" | "use-cases" }).kind === "products"
                                                    ? productsLinkRef
                                                    : (link as { kind?: "products" | "company" | "use-cases" }).kind === "company"
                                                    ? companyLinkRef
                                                    : (link as { kind?: "products" | "company" | "use-cases" }).kind === "use-cases"
                                                    ? useCasesLinkRef
                                                    : undefined
                                            }
                                            className={navLinkClass}
                                            style={{
                                                ...navLinkInline(isCompact),
                                                whiteSpace: "nowrap",
                                                opacity: linksVisible ? 1 : 0,
                                                transform: linksVisible ? "translateX(0)" : "translateX(8px)",
                                                filter: linksVisible ? "blur(0px)" : "blur(4px)",
                                                transition: `opacity 350ms ease ${i * 80}ms, transform 400ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 80}ms, filter 350ms ease ${i * 80}ms, font-size ${t}`,
                                            }}
                                            onMouseEnter={
                                                (link as { hasDropdown?: boolean }).hasDropdown
                                                    ? () => {
                                                          setHoverKind((link as { kind?: "products" | "company" | "use-cases" }).kind ?? null);
                                                          handleNavMouseEnter();
                                                      }
                                                    : undefined
                                            }
                                        >
                                            {/* Wrap the label so the hover-underline is positioned
                                                relative to the text itself (not the px-3 padded link
                                                area). Underline animates width 0 → 100% on hover,
                                                same easing + duration as the research-blog row line
                                                in the /technology page. */}
                                            <span className={`relative inline-block ${wide && !bgTriggerPassed ? glassStyles.glassTextStatic : ""}`}>
                                                {link.label}
                                                {/* Underline stays at full width while the dropdown
                                                    triggered by THIS link is open — so moving the
                                                    mouse from the link into the dropdown keeps the
                                                    visual link "active". */}
                                                {(() => {
                                                    const linkKind = (link as { kind?: "products" | "company" | "use-cases" }).kind;
                                                    const linkIsActive =
                                                        isMenuOpen &&
                                                        !!linkKind &&
                                                        hoverKind === linkKind;
                                                    return (
                                                        <span
                                                            aria-hidden
                                                            className={`pointer-events-none absolute left-0 -bottom-1 h-px ${linkIsActive ? "w-full" : "w-0 group-hover/nav:w-full"} bg-[#0066CC]`}
                                                            style={{ transition: "width 500ms cubic-bezier(0.22, 1, 0.36, 1)" }}
                                                        />
                                                    );
                                                })()}
                                            </span>
                                            {/* Arrow chevron — Products + Use Cases (Company keeps dropdown hover, no arrow). */}
                                            {((link as { kind?: "products" | "company" | "use-cases" }).kind === "products" || (link as { kind?: "products" | "company" | "use-cases" }).kind === "use-cases") && (() => {
                                                const linkKind = (link as { kind?: "products" | "company" | "use-cases" }).kind;
                                                const flipped = isMenuOpen && !!linkKind && hoverKind === linkKind;
                                                const crossfade = "opacity 140ms ease-out";
                                                return (
                                                    <span
                                                        aria-hidden
                                                        style={{
                                                            position: "relative",
                                                            display: "inline-block",
                                                            width: 12,
                                                            height: 7,
                                                            lineHeight: 0,
                                                        }}
                                                    >
                                                        {/* Down chevron — visible when closed */}
                                                        <svg
                                                            width="12" height="7" viewBox="0 0 12 7" fill="none"
                                                            stroke="#0066CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                                            style={{
                                                                position: "absolute",
                                                                inset: 0,
                                                                opacity: flipped ? 0 : 1,
                                                                transition: crossfade,
                                                            }}
                                                        >
                                                            <path d="M1 1l5 5 5-5" />
                                                        </svg>
                                                        {/* Up chevron — visible when the dropdown is open */}
                                                        <svg
                                                            width="12" height="7" viewBox="0 0 12 7" fill="none"
                                                            stroke="#0066CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                                            style={{
                                                                position: "absolute",
                                                                inset: 0,
                                                                opacity: flipped ? 1 : 0,
                                                                transition: crossfade,
                                                            }}
                                                        >
                                                            <path d="M1 6l5-5 5 5" />
                                                        </svg>
                                                    </span>
                                                );
                                            })()}
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
                                        ["--cta-right" as string]: wide ? "52px" : "56px",
                                    }}>
                                        <Link
                                            href="/contact"
                                            ref={ctaRef}
                                            className={`group flex items-center justify-between leading-none whitespace-nowrap transition-all duration-300 cursor-pointer ${isUseCasesPage ? (isDark ? "hover:bg-white!" : "hover:opacity-90") : "hover:opacity-90"} ${wide ? glassStyles.btn : ""}`}
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                height: isProductsPage ? 45 : 36,
                                                gap: isWideScreen ? 12 : 6,
                                                width: ctaVisible ? (isProductsPage ? 145 : 131.28) : 0,
                                                opacity: (!isWideScreen && isMenuOpen) ? 0 : ctaVisible ? 1 : 0,
                                                overflow: "hidden",
                                                pointerEvents: (!isWideScreen && isMenuOpen) ? "none" : ctaVisible ? "auto" : "none",
                                                paddingLeft: ctaVisible ? 20 : 0,
                                                paddingRight: ctaVisible ? 16 : 0,
                                                marginRight: 0,
                                                transition: `width ${t}, opacity 300ms ease, padding ${t}, background-color 300ms ease, color 300ms ease`,
                                                ...(wide
                                                    ? { backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }
                                                    : isEnterprisePage
                                                    ? { backgroundColor: isDark ? "rgba(255,255,255,0.95)" : "rgba(0, 0, 0, 0.05)", color: isDark ? "#0A1344" : "#0A1344", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }
                                                    : isUseCasesPage
                                                    ? { backgroundColor: isDark ? "rgba(255, 255, 255, 0.10)" : "#000000", color: isDark ? "white" : "white" }
                                                    : { backgroundColor: "#000000", color: "white" }),
                                            }}
                                        >
                                            <span
                                                className={`transition-colors duration-300 ${wide ? (isProductsPage ? "text-black" : isMenuOpen ? "text-black" : "text-white") : isUseCasesPage && isDark ? "group-hover:text-black!" : ""} group-hover:text-[#2563EB]`}
                                                style={{
                                                    opacity: ctaVisible ? 1 : 0,
                                                    filter: ctaVisible ? "blur(0px)" : "blur(4px)",
                                                    transition: ctaVisible
                                                        ? "opacity 200ms ease 450ms, color 300ms, filter 300ms ease 450ms"
                                                        : "opacity 100ms ease, filter 100ms ease",
                                                }}
                                            >Start Now</span>
                                            <svg
                                                className="transition-all duration-300 ease-in-out group-hover:translate-x-1"
                                                width="10" height="18" viewBox="0 0 7 12" fill="none"
                                                stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                                style={{
                                                    opacity: ctaVisible ? 1 : 0,
                                                    filter: ctaVisible ? "blur(0px)" : "blur(4px)",
                                                    transition: ctaVisible
                                                        ? "opacity 200ms ease 500ms, translate 300ms ease-in-out, filter 300ms ease 500ms"
                                                        : "opacity 80ms ease, translate 300ms ease-in-out, filter 80ms ease",
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
                                        className={`relative flex items-center justify-center transition-all duration-300 cursor-pointer ${wide ? glassStyles.togglePill : "rounded-none"}`}
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
                                                    className="absolute bg-current transform-gpu"
                                                    style={{
                                                        width: 22,
                                                        height: 2,
                                                        opacity: barsOpacity,
                                                        transform: isMenuOpen ? "rotate(45deg)" : "translateY(-4px)",
                                                        transition: `transform 300ms ease-in-out, ${barsTransition}`,
                                                    }}
                                                />
                                                <div
                                                    className="absolute bg-current transform-gpu"
                                                    style={{
                                                        width: 22,
                                                        height: 2,
                                                        opacity: barsOpacity,
                                                        transform: isMenuOpen ? "rotate(-45deg)" : "translateY(4px)",
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
                className={`fixed left-0 right-0 max-[899px]:bottom-0 overflow-hidden max-[899px]:flex max-[899px]:flex-col`}
                style={{
                    ...dropdownBg,
                    zIndex: 1045,
                    top: 0,
                    maxHeight: isMenuOpen ? "100dvh" : "0px",
                    opacity: isMenuOpen ? 1 : 0,
                    pointerEvents: isMenuOpen ? "auto" : "none",
                    borderBottom: isMenuOpen ? (isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)") : "none",
                    borderRadius: 0,
                    willChange: "max-height, opacity",
                    transition: isMenuOpen
                        ? "max-height 500ms cubic-bezier(0.05, 0.7, 0.1, 1), opacity 200ms ease"
                        : "max-height 400ms cubic-bezier(0.3, 0, 0.8, 0.15), opacity 250ms ease 200ms",
                }}
                onMouseLeave={handleDropdownMouseLeave}
            >
                {/* Desktop layout kicks in at the navbar's 900px breakpoint
                    (NAV_BREAKPOINT). Below that, the navbar is in hamburger
                    mode and the dropdown stacks single-column with max-[899px]
                    classes — keeping both surfaces in lockstep. */}
                <div className={`mx-auto w-full px-6 min-[900px]:px-8 ${wide ? "min-[1408px]:px-0" : "min-[1287px]:px-0"} pt-4 pb-2 min-[900px]:pb-0`} style={{ maxWidth: wide ? 1408 : 1287, paddingTop: isWideScreen ? (isCompact ? 84 : 96) : (isCompact ? 72 : 88), ...(isWideScreen && { marginBottom: -24 - (hoverKind === "company" && companyAlign ? companyAlign.extraMb : 0) }), transition: "margin-bottom 350ms cubic-bezier(0.05, 0.7, 0.1, 1)" }}>
                    <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-8 min-[900px]:gap-12">
                        <div
                            ref={leftColRef}
                            className="min-[900px]:col-start-1 min-[900px]:col-span-5 min-[900px]:row-start-1 flex flex-col relative z-10"
                            style={{
                                opacity: !isMenuOpen ? 0 : (hoverKind === "products" || hoverKind === "use-cases") ? 0 : 1,
                                transform: !isMenuOpen
                                    ? "translateY(8px) scale(0.99)"
                                    : (hoverKind === "products" || hoverKind === "use-cases")
                                    ? "translateX(-12px)"
                                    : "translateY(0) translateX(0) scale(1)",
                                transition: !isMenuOpen
                                    ? "opacity 150ms ease, transform 150ms ease"
                                    : "opacity 350ms cubic-bezier(0.05, 0.7, 0.1, 1), transform 400ms cubic-bezier(0.05, 0.7, 0.1, 1)",
                                pointerEvents: (hoverKind === "products" || hoverKind === "use-cases") ? "none" : "auto",
                                ...((hoverKind !== "products" && hoverKind !== "use-cases") && productsAlign && isWideScreen
                                    ? {
                                        maxWidth: Math.round(
                                            (productsAlign.leftMaxWidth
                                                + Math.min(
                                                    productsAlign.leftMaxWidth,
                                                    DROPDOWN_LEFT_COL_MAX_WIDTH_PX
                                                ))
                                                / 2
                                        ),
                                        justifySelf: "start",
                                        minWidth: 0,
                                    }
                                    : {}),
                            }}
                        >
                            <h4 className={`text-[12px] font-medium tracking-[0.1em] uppercase mb-4 ${dropdownHeadingClass}`}>
                                <ScrambleText text="COLUMBUS EARTH" isActive={isMenuOpen} delay={200} />
                            </h4>
                            <p className={`text-[15px] leading-[1.55] ${dropdownBodyClass}`}>
                                Columbus Earth Inc. is a spatial frontier AI company building the first production
                                Large Geospatial Model to answer the most difficult questions about our planet.
                            </p>
                            <dl
                                className="mt-7 min-[900px]:mt-auto flex flex-wrap gap-x-12 gap-y-4"
                                style={{
                                    ...(isWideScreen && {
                                        marginBottom: hoverKind === "company" && companyAlign ? companyAlign.dlMb : 14,
                                    }),
                                    transition: "margin-bottom 350ms cubic-bezier(0.05, 0.7, 0.1, 1)",
                                }}
                            >
                                <div>
                                    <dt className={`text-[11px] font-medium tracking-[0.1em] uppercase mb-1.5 ${dropdownSubheadClass}`}>
                                        <ScrambleText text="CONTACT" isActive={isMenuOpen} delay={300} />
                                    </dt>
                                    <dd>
                                        <a href="mailto:contact@columbus.earth" className={`text-[15px] font-medium block transition-colors duration-300 break-all hover:text-[#2563EB] ${dropdownLinkClass}`}>
                                            contact@columbus.earth
                                        </a>
                                    </dd>
                                </div>
                                <div>
                                    <dt className={`text-[11px] font-medium tracking-[0.1em] uppercase mb-1.5 ${dropdownSubheadClass}`}>
                                        <ScrambleText text="SOCIAL" isActive={isMenuOpen} delay={350} />
                                    </dt>
                                    <dd>
                                        <a href="https://www.linkedin.com/company/columbusearth/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className={`text-[15px] font-medium block transition-colors duration-300 hover:text-[#2563EB] ${dropdownSocialClass}`}>
                                            LinkedIn
                                        </a>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                        <div className="hidden min-[900px]:block min-[900px]:col-span-1"></div>
                        <div
                            ref={productsColRef}
                            className="min-[900px]:col-start-1 min-[900px]:col-span-12 min-[900px]:row-start-1 space-y-6 min-[900px]:space-y-6 min-[900px]:pointer-events-none [&_h4]:min-[900px]:pointer-events-auto [&_a]:min-[900px]:pointer-events-auto"
                            style={{
                                ...(productsAlign && isWideScreen
                                    ? {
                                        paddingLeft: (hoverKind === "products" || hoverKind === "use-cases") ? 0 : productsAlign.padLeft,
                                        paddingRight: (hoverKind === "products" || hoverKind === "use-cases") ? 0 : productsAlign.padRight,
                                    }
                                    : {}),
                                transition: "padding 450ms cubic-bezier(0.05, 0.7, 0.1, 1)",
                            }}
                        >
                            {/* ── Right-side content group ── */}
                            <div className="relative">
                                {/* Eyebrow — visible only when hoverKind is null (logo / default).
                                    Uses opacity only (no max-height collapse) so the reserved
                                    row height matches Company / Products hovers — dropdown
                                    panel height stays consistent across triggers. */}
                                <div
                                    className="hidden min-[900px]:block overflow-hidden"
                                    aria-hidden={hoverKind !== null}
                                    style={{
                                        opacity: !isMenuOpen ? 0 : hoverKind !== null ? 0 : 1,
                                        transform: !isMenuOpen
                                            ? "translateY(8px)"
                                            : hoverKind !== null
                                            ? "translateY(-4px)"
                                            : "translateY(0)",
                                        transition: !isMenuOpen
                                            ? "opacity 150ms ease, transform 150ms ease"
                                            : "opacity 300ms cubic-bezier(0.05, 0.7, 0.1, 1), transform 400ms cubic-bezier(0.05, 0.7, 0.1, 1)",
                                    }}
                                >
                                    <h4 className={`text-[13px] font-medium tracking-[0.08em] uppercase mb-4 ${dropdownSubheadClass}`}>
                                        <ScrambleText text="PRODUCTS" isActive={isMenuOpen && hoverKind === null} delay={250} />
                                    </h4>
                                </div>
                                {/* Mobile-only eyebrow kept separate (no collapse needed) */}
                                <h4 className={`min-[900px]:hidden text-[13px] font-medium tracking-[0.08em] uppercase mb-4 ${dropdownSubheadClass}`}>
                                    <ScrambleText text="PRODUCTS" isActive={isMenuOpen} delay={250} />
                                </h4>

                                {/* ── Company-hover layout (desktop) ── image on the left of
                                    the padded content area, two stacked links on the right.
                                    Absolutely positioned on top of the cards grid so the two
                                    variants can crossfade. Occupies only when hovered. */}
                                <div
                                    className="hidden min-[900px]:flex absolute inset-0 items-start gap-10"
                                    aria-hidden={hoverKind !== "company"}
                                    style={{
                                        opacity: hoverKind === "company" && isMenuOpen ? 1 : 0,
                                        pointerEvents: hoverKind === "company" && isMenuOpen ? "auto" : "none",
                                        transform: hoverKind === "company" && isMenuOpen ? "translateY(0)" : "translateY(6px)",
                                        transition: "opacity 350ms cubic-bezier(0.05, 0.7, 0.1, 1), transform 400ms cubic-bezier(0.05, 0.7, 0.1, 1)",
                                    }}
                                >
                                    {/* Width matches one product-card column: (720 − gap-5) / 2 ≈ 350px */}
                                    <div
                                        className={`relative aspect-[16/10] w-full max-w-[350px] shrink-0 overflow-hidden ${isDark ? "bg-white/5" : "bg-[#F5F5F5]"}`}
                                        style={{
                                            marginLeft: hoverKind === "company" && companyAlign ? companyAlign.imageMl : 0,
                                            transition: "margin-left 350ms cubic-bezier(0.05, 0.7, 0.1, 1)",
                                        }}
                                    >
                                        <Image
                                            src="/CEHQ.png"
                                            alt="Columbus Earth HQ"
                                            fill
                                            sizes="(min-width: 768px) 350px, 100vw"
                                            className="object-cover"
                                        />
                                    </div>
                                    <ul
                                        className="flex flex-col gap-5 pt-2 min-w-[120px]"
                                        style={{
                                            ...(hoverKind === "company" && companyAlign && isWideScreen && {
                                                position: "absolute",
                                                left: companyAlign.ulLeft,
                                                top: 0,
                                            }),
                                            transition: "left 350ms cubic-bezier(0.05, 0.7, 0.1, 1)",
                                        }}
                                    >
                                        {[
                                            { label: "Mission", href: "/mission" },
                                            { label: "Vision", href: "/mission" },
                                            { label: "Blog", href: "/blog" },
                                        ].map((item) => (
                                            <li key={item.label} className="pointer-events-auto">
                                                <Link
                                                    href={item.href}
                                                    onClick={closeMenu}
                                                    className={`group inline-flex items-center gap-3 text-[20px] font-medium tracking-[-0.005em] cursor-pointer ${dropdownNavLinkClass}`}
                                                >
                                                    <span className="transition-colors duration-300 group-hover:text-[#2563EB]">{item.label}</span>
                                                    <svg
                                                        className="shrink-0 transition-all duration-300 ease-in-out group-hover:translate-x-1"
                                                        width="9" height="16" viewBox="0 0 7 12" fill="none"
                                                        stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                                    >
                                                        <path d="M1 1l5 5-5 5" />
                                                    </svg>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* ── Use-cases cards (desktop) — absolutely positioned
                                    on top of the products grid; fades in when the user
                                    hovers Use Cases. Two cards: an empty bordered box for
                                    Columbus Business Use cases, and a bordered box
                                    with a globe diagram for Research Applications. Plain
                                    text labels sit below each card. */}
                                <div
                                    className="hidden min-[900px]:flex absolute inset-0 justify-center"
                                    aria-hidden={hoverKind !== "use-cases"}
                                    style={{
                                        opacity: hoverKind === "use-cases" && isMenuOpen ? 1 : 0,
                                        pointerEvents: hoverKind === "use-cases" && isMenuOpen ? "auto" : "none",
                                        transform: hoverKind === "use-cases" && isMenuOpen ? "translateY(0)" : "translateY(6px)",
                                        transition: "opacity 350ms cubic-bezier(0.05, 0.7, 0.1, 1), transform 400ms cubic-bezier(0.05, 0.7, 0.1, 1)",
                                    }}
                                >
                                    <div className="grid grid-cols-2 gap-6 w-full max-w-[580px]">
                                        {[
                                            {
                                                title: "Columbus Business Use cases",
                                                href: "/columbus-solutions",
                                                icon: (
                                                    <Image
                                                        src="/logobueno.png"
                                                        alt=""
                                                        width={140}
                                                        height={140}
                                                        className="w-1/2 h-1/2 max-w-[140px] object-contain"
                                                        style={{ filter: isDark ? "brightness(0) invert(1)" : undefined }}
                                                    />
                                                ),
                                            },
                                            {
                                                title: "Research Applications",
                                                href: "/research-applications",
                                                icon: (
                                                    <Image
                                                        src="/TechnologyPageImages/lgm-globe-icon.png"
                                                        alt=""
                                                        width={140}
                                                        height={140}
                                                        className="w-1/2 h-1/2 max-w-[140px] object-contain"
                                                        style={{ filter: isDark ? "brightness(0) invert(1)" : undefined }}
                                                    />
                                                ),
                                            },
                                        ].map((item, index) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={closeMenu}
                                                className="group flex flex-col cursor-pointer pointer-events-auto"
                                                style={{
                                                    opacity: hoverKind === "use-cases" && isMenuOpen ? 1 : 0,
                                                    transform: hoverKind === "use-cases" && isMenuOpen
                                                        ? "translateY(0) scale(1)"
                                                        : "translateY(12px) scale(0.98)",
                                                    transition: hoverKind === "use-cases" && isMenuOpen
                                                        ? `opacity 400ms cubic-bezier(0.05, 0.7, 0.1, 1) ${100 + index * 60}ms, transform 450ms cubic-bezier(0.05, 0.7, 0.1, 1) ${100 + index * 60}ms`
                                                        : `opacity 120ms ease ${(1 - index) * 25}ms, transform 120ms ease ${(1 - index) * 25}ms`,
                                                }}
                                            >
                                                <div
                                                    className={`relative aspect-square flex items-center justify-center transition-colors duration-300 ${isDark ? "text-white/80 group-hover:text-white" : "text-[#0A1344] group-hover:text-[#2563EB]"}`}
                                                    style={{
                                                        border: `1px solid ${isDark ? "rgba(255,255,255,0.35)" : "rgba(10,19,68,0.7)"}`,
                                                    }}
                                                >
                                                    {item.icon}
                                                </div>
                                                <h5 className={`mt-5 text-[20px] font-medium tracking-[-0.005em] leading-[1.2] ${dropdownNavLinkClass}`}>
                                                    {item.title}
                                                </h5>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* ── Products cards (desktop) — shown in default + products
                                    modes; crossfades out when company mode engages. Cards
                                    are capped at 760px and centred via mx-auto. */}
                                <div
                                    className={`hidden min-[900px]:grid grid-cols-2 gap-6 mx-auto min-[900px]:max-w-[760px] ${(hoverKind === "company" || hoverKind === "use-cases") ? "[&_a]:pointer-events-none!" : ""}`}
                                    style={{
                                        opacity: (hoverKind === "company" || hoverKind === "use-cases") ? 0 : 1,
                                        pointerEvents: (hoverKind === "company" || hoverKind === "use-cases") ? "none" : "auto",
                                        transition: "opacity 350ms cubic-bezier(0.05, 0.7, 0.1, 1)",
                                    }}
                                >
                                    {PRODUCTS.map((item, index) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={closeMenu}
                                            className="flex flex-col cursor-pointer"
                                            onMouseEnter={item.video ? () => {
                                                setElioHovered(true);
                                                elioVideoRef.current?.play();
                                            } : undefined}
                                            onMouseLeave={item.video ? () => {
                                                setElioHovered(false);
                                                if (elioVideoRef.current) {
                                                    elioVideoRef.current.pause();
                                                    elioVideoRef.current.currentTime = 0;
                                                }
                                            } : undefined}
                                            style={{
                                                opacity: isMenuOpen ? 1 : 0,
                                                transform: isMenuOpen
                                                    ? "translateY(0) scale(1)"
                                                    : "translateY(12px) scale(0.98)",
                                                transition: isMenuOpen
                                                    ? `opacity 400ms cubic-bezier(0.05, 0.7, 0.1, 1) ${200 + index * 60}ms, transform 450ms cubic-bezier(0.05, 0.7, 0.1, 1) ${200 + index * 60}ms`
                                                    : `opacity 120ms ease ${(1 - index) * 25}ms, transform 120ms ease ${(1 - index) * 25}ms`,
                                            }}
                                        >
                                            <div className={`relative overflow-hidden aspect-[16/10] ${isDark ? "bg-white/5" : "bg-[#F5F5F5]"}`}>
                                                <Image
                                                    src={item.img}
                                                    alt={item.title}
                                                    fill
                                                    sizes="(min-width: 768px) 360px, 100vw"
                                                    className="object-cover object-top-left"
                                                    style={{
                                                        opacity: item.video && elioHovered ? 0 : 1,
                                                        transition: "opacity 250ms ease",
                                                    }}
                                                />
                                                {item.screenshot && (
                                                    <>
                                                        <div
                                                            className="absolute inset-0 pointer-events-none"
                                                            style={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", zIndex: 1 }}
                                                        />
                                                        <div
                                                            className="absolute overflow-hidden"
                                                            style={{
                                                                left: "5%",
                                                                bottom: 0,
                                                                width: "90%",
                                                                height: "85%",
                                                                borderRadius: "8px 8px 0 0",
                                                                boxShadow: "0 -4px 30px rgba(0,0,0,0.25)",
                                                                zIndex: 2,
                                                            }}
                                                        >
                                                            <Image
                                                                src={item.screenshot}
                                                                alt={`${item.title} Interface`}
                                                                fill
                                                                className="object-cover object-top"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                                {item.video && (
                                                    <video
                                                        ref={elioVideoRef}
                                                        src={item.video}
                                                        loop
                                                        muted
                                                        playsInline
                                                        preload="none"
                                                        className="absolute inset-0 w-full h-full object-cover object-top-left"
                                                        style={{
                                                            opacity: elioHovered ? 1 : 0,
                                                            transition: "opacity 250ms ease",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <h5 className={`mt-5 text-[20px] font-medium tracking-[-0.005em] leading-[1.2] ${dropdownNavLinkClass}`}>
                                                {item.title}
                                            </h5>
                                            <p className={`mt-1.5 text-[15px] leading-[1.5] ${isDark ? "text-white/55" : "text-[#0A1344]/55"}`}>
                                                {item.subtitle}
                                            </p>
                                        </Link>
                                    ))}
                                </div>

                                {/* Mobile — text list (unchanged) */}
                                <ul className="space-y-4 min-[900px]:hidden">
                                    {[
                                        { label: "MapsGPT", href: "/products/mapsgpt" },
                                        { label: "Columbus", href: "/products/enterprise" },
                                    ].map((item, index) => (
                                        <li
                                            key={item.href}
                                            style={{
                                                opacity: isMenuOpen ? 1 : 0,
                                                transform: isMenuOpen
                                                    ? "translateY(0) scale(1)"
                                                    : "translateY(12px) scale(0.97)",
                                                transition: isMenuOpen
                                                    ? `opacity 350ms cubic-bezier(0.05, 0.7, 0.1, 1) ${200 + index * 50}ms, transform 400ms cubic-bezier(0.05, 0.7, 0.1, 1) ${200 + index * 50}ms`
                                                    : `opacity 120ms ease ${(1 - index) * 25}ms, transform 120ms ease ${(1 - index) * 25}ms`,
                                            }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={closeMenu}
                                                className={`group relative text-xl font-medium transition-all duration-300 flex items-center cursor-pointer ${dropdownNavLinkClass}`}
                                            >
                                                <span className="transition-all duration-300 ease-in-out group-hover:translate-x-1">{item.label}</span>
                                                <svg className="ml-3 shrink-0 transition-all duration-300 ease-in-out group-hover:translate-x-1" width="9" height="16" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 1l5 5-5 5" />
                                                </svg>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* ── Company group — mobile only ── */}
                            <div className="min-[900px]:hidden">
                                <h4
                                    className={`text-[13px] font-medium tracking-[0.08em] uppercase mb-4 ${dropdownSubheadClass}`}
                                    style={{
                                        opacity: isMenuOpen ? 1 : 0,
                                        transform: isMenuOpen ? "translateY(0)" : "translateY(8px)",
                                        transition: isMenuOpen
                                            ? "opacity 350ms ease 330ms, transform 400ms cubic-bezier(0.05, 0.7, 0.1, 1) 330ms"
                                            : "opacity 150ms ease, transform 150ms ease",
                                    }}
                                >
                                    <ScrambleText text="COMPANY" isActive={isMenuOpen} delay={400} />
                                </h4>
                                <ul className="space-y-4">
                                    {[
                                        { label: "Research", href: "/technology" },
                                        { label: "Columbus Solutions", href: "/columbus-solutions" },
                                        { label: "Research Applications", href: "/research-applications" },
                                        { label: "Our Mission", href: "/mission" },
                                        { label: "Vision", href: "/mission" },
                                        { label: "Blog", href: "/blog" },
                                    ].map((item, index, arr) => (
                                        <li
                                            key={item.href + item.label}
                                            className="pointer-events-auto"
                                            style={{
                                                opacity: isMenuOpen ? 1 : 0,
                                                transform: isMenuOpen
                                                    ? "translateY(0) scale(1)"
                                                    : "translateY(12px) scale(0.97)",
                                                transition: isMenuOpen
                                                    ? `opacity 350ms cubic-bezier(0.05, 0.7, 0.1, 1) ${350 + index * 50}ms, transform 400ms cubic-bezier(0.05, 0.7, 0.1, 1) ${350 + index * 50}ms`
                                                    : `opacity 120ms ease ${(arr.length - 1 - index) * 25}ms, transform 120ms ease ${(arr.length - 1 - index) * 25}ms`,
                                            }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={closeMenu}
                                                className={`group relative text-xl font-medium flex items-center cursor-pointer ${dropdownNavLinkClass}`}
                                            >
                                                <span className="transition-colors duration-300 group-hover:text-[#2563EB]">{item.label}</span>
                                                <svg className="ml-3 shrink-0 transition-all duration-300 ease-in-out group-hover:translate-x-1" width="9" height="16" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 1l5 5-5 5" />
                                                </svg>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ── Mobile bottom CTA (mapsgpt — glass pill, content-width) ── */}
                    {isProductsPage && (
                        <div
                            className="min-[900px]:hidden pt-6"
                            style={{
                                opacity: isMenuOpen ? 1 : 0,
                                transform: isMenuOpen ? "translateY(0)" : "translateY(12px)",
                                transition: isMenuOpen
                                    ? "opacity 350ms cubic-bezier(0.05, 0.7, 0.1, 1) 500ms, transform 400ms cubic-bezier(0.05, 0.7, 0.1, 1) 500ms"
                                    : "opacity 120ms ease, transform 120ms ease",
                            }}
                        >
                            <Link
                                href="/maps-gpt"
                                onClick={closeMenu}
                                className={`group flex items-center justify-center gap-3 w-full font-medium text-[16px] transition-colors duration-300 cursor-pointer hover:opacity-90 ${glassStyles.btn}`}
                                style={{
                                    height: 60,
                                    borderRadius: 999,
                                    backdropFilter: "blur(6px)",
                                    WebkitBackdropFilter: "blur(6px)",
                                }}
                            >
                                <span className="text-black">Start Now</span>
                                <svg
                                    className="transition-all duration-300 ease-in-out group-hover:translate-x-1"
                                    width="10" height="18" viewBox="0 0 7 12" fill="none"
                                    stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <path d="M1 1l5 5-5 5" />
                                </svg>
                            </Link>
                        </div>
                    )}
                </div>

                {/* ── Mobile bottom CTA (all other pages — full-width, viewport bottom) ── */}
                {!isProductsPage && (
                    <div
                        className="min-[900px]:hidden mt-auto"
                        style={{
                            opacity: isMenuOpen ? 1 : 0,
                            transition: isMenuOpen
                                ? "opacity 350ms cubic-bezier(0.05, 0.7, 0.1, 1) 500ms"
                                : "opacity 120ms ease",
                        }}
                    >
                        <Link
                            href="/contact"
                            onClick={closeMenu}
                            className="group flex items-center justify-center gap-3 w-full font-medium text-[16px] transition-colors duration-300 cursor-pointer hover:opacity-90"
                            style={{
                                height: 60,
                                backgroundColor: isDark ? "#FFFFFF" : "#000000",
                                color: isDark ? "#000000" : "white",
                                borderRadius: 0,
                            }}
                        >
                            Start Now
                            <svg
                                className="transition-all duration-300 ease-in-out group-hover:translate-x-1"
                                width="10" height="18" viewBox="0 0 7 12" fill="none"
                                stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            >
                                <path d="M1 1l5 5-5 5" />
                            </svg>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};
