"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { ScrambleText } from "@/components/ui/ScrambleText";

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isManuallyToggled, setIsManuallyToggled] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDarkSection, setIsDarkSection] = useState(false);
    const [isBrandCta, setIsBrandCta] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Detect if a dark-background section is currently behind the navbar.
    // Mark sections with data-navbar-theme="dark" to activate dark mode.
    useEffect(() => {
        const checkSection = () => {
            if (!navRef.current) return;
            const navBottom = navRef.current.getBoundingClientRect().bottom;
            const darkSections = document.querySelectorAll('[data-navbar-theme="dark"]');
            const isOverDark = Array.from(darkSections).some((el) => {
                const rect = el.getBoundingClientRect();
                return rect.top < navBottom && rect.bottom > 0;
            });
            const lightOverrides = document.querySelectorAll('[data-navbar-theme="light"]');
            const isOverLight = Array.from(lightOverrides).some((el) => {
                const rect = el.getBoundingClientRect();
                return rect.top < navBottom && rect.bottom > 0;
            });
            setIsDarkSection(isOverDark && !isOverLight);

            const brandCtaEls = document.querySelectorAll('[data-navbar-cta="brand"]');
            const overBrand = Array.from(brandCtaEls).some((el) => {
                const rect = el.getBoundingClientRect();
                return rect.top < navBottom && rect.bottom > 0;
            });
            setIsBrandCta(overBrand);
        };

        window.addEventListener("scroll", checkSection, { passive: true });
        checkSection();
        return () => window.removeEventListener("scroll", checkSection);
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

    const menuItems = [
        { label: "Our Mission", href: "/our-mission" },
        { label: "Columbus Market Spy", href: "/market-spy" },
        { label: "MapsGPT", href: "/maps-gpt" },
        { label: "Use Cases", href: "/use-cases" },
        { label: "Technology", href: "/technology" },
    ];

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

    // Pill background style — matches devin.ai's approach:
    // light: subtle white tint + 10px blur + hairline border
    // dark: near-invisible cool gradient + 10px blur + hairline white border
    const pillBg = isMenuOpen
        ? "bg-white rounded-tl-xs rounded-tr-xs"
        : !isScrolled
            ? "bg-transparent"
            : isDarkSection
                ? "backdrop-blur-[10px] bg-gradient-to-b from-[#def4ff]/[0.04] via-[#abbcc5]/[0.05] to-[#5d676d]/[0.10] rounded-xl"
                : "backdrop-blur-[10px] bg-white/20 rounded-xl";

    // Text and interactive element colors
    const dark = isDarkSection && !isMenuOpen;
    const wordmarkColor  = dark ? "text-white"        : "text-[#0A1344]";
    const linkColor      = dark ? "text-white/80"     : "text-[#0a1628]";
    const linkHover      = dark ? "hover:text-white"  : "hover:text-[#0A1344]";
    const underlineColor = dark ? "bg-white"          : "bg-[#0A1344]";
    const startNowClass  = isBrandCta
        ? "bg-[#0A1344] text-white border border-[#0A1344] hover:bg-[#0A1344]/90"
        : dark
            ? "backdrop-blur-sm bg-white/10 border border-white/30 text-white hover:bg-white/20"
            : "border border-[#0A1344]/85 bg-white text-[#0A1344] hover:bg-gray-50";
    const hamburgerClosedClass = dark
        ? "backdrop-blur-sm bg-white/10 border border-white/30 hover:bg-white/20"
        : "bg-white border border-[#0a1628]/85 hover:bg-[#0A1344]/5";
    const hamburgerLineColor = dark ? "bg-white" : "bg-[#0A1344]";

    return (
        <>
            {/* Backdrop blur overlay */}
            <div
                className={`fixed inset-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isMenuOpen
                        ? "opacity-100 backdrop-blur-md bg-black/10"
                        : "opacity-0 pointer-events-none"
                }`}
            />

            <nav
                ref={navRef}
                className="header-font fixed top-6 left-0 right-0 z-50"
                onMouseEnter={handleNavMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Constrained wrapper — aligns pill and content to the same max-width box */}
                <div className="relative mx-auto w-full max-w-screen-2xl">
                    {/* Pill background */}
                    <div className={`absolute inset-y-0 left-(--container-padding) right-(--container-padding) transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${pillBg}`} />

                    <div className="relative z-50 px-[calc(var(--container-padding)+18px)]">
                        <div className="grid h-14 md:h-17 grid-cols-[1fr_auto_1fr] items-center">
                            {/* Left: Logo */}
                            <Link href="/" className="flex shrink-0 items-center gap-2">
                                <div className="relative h-10 w-10 shrink-0">
                                    <Image
                                        src="/logobueno.png"
                                        alt="Columbus Logo"
                                        fill
                                        sizes="40px"
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                                <span className={`brand-wordmark text-2xl font-medium leading-none tracking-tight transition-colors duration-500 ${wordmarkColor}`}>
                                    Columbus Earth
                                </span>
                            </Link>

                            {/* Center: Navigation Links */}
                            <div className="hidden items-center gap-9 min-[1155px]:flex">
                                <Link
                                    href="#"
                                    className={`group relative text-md font-medium transition-colors duration-300 ${linkColor} ${linkHover}`}
                                >
                                    Product
                                    <span className={`absolute left-0 -bottom-1 h-px w-0 transition-all duration-300 group-hover:w-full ${underlineColor}`} />
                                </Link>
                                <Link
                                    href="/use-cases"
                                    className={`group relative text-md font-medium transition-colors duration-300 ${linkColor} ${linkHover}`}
                                >
                                    Use Cases
                                    <span className={`absolute left-0 -bottom-1 h-px w-0 transition-all duration-300 group-hover:w-full ${underlineColor}`} />
                                </Link>
                                <Link
                                    href="/technology"
                                    className={`group relative text-md font-medium transition-colors duration-300 ${linkColor} ${linkHover}`}
                                >
                                    Technology
                                    <span className={`absolute left-0 -bottom-1 h-px w-0 transition-all duration-300 group-hover:w-full ${underlineColor}`} />
                                </Link>
                            </div>

                            {/* Right: CTA + Hamburger */}
                            <div className="col-start-3 flex items-center justify-end gap-3">
                                <Link
                                    href="/maps-gpt"
                                    className={`hidden min-[1155px]:flex items-center justify-center px-6 py-3.5 text-md font-semibold leading-none transition-colors duration-500 rounded-none ${startNowClass}`}
                                >
                                    Start Now
                                </Link>
                                <button
                                    onClick={handleHamburgerClick}
                                    className={`relative flex h-11 w-11 items-center justify-center rounded-none transition-all duration-300 ${
                                        isMenuOpen
                                            ? "bg-[#0A1344] border border-[#0A1344]"
                                            : hamburgerClosedClass
                                    }`}
                                    aria-label="Toggle menu"
                                >
                                    {/* Top Line */}
                                    <div
                                        className={`absolute h-px w-5.5 transform-gpu transition-all duration-300 ease-in-out ${
                                            isMenuOpen
                                                ? "rotate-45 bg-white"
                                                : `-translate-y-1.5 ${hamburgerLineColor}`
                                        }`}
                                    />
                                    {/* Middle Line */}
                                    <div
                                        className={`absolute h-px w-5.5 transition-all duration-200 ${
                                            isMenuOpen ? "opacity-0 bg-white" : `opacity-100 ${hamburgerLineColor}`
                                        }`}
                                    />
                                    {/* Bottom Line */}
                                    <div
                                        className={`absolute h-px w-5.5 transform-gpu transition-all duration-300 ease-in-out ${
                                            isMenuOpen
                                                ? "-rotate-45 bg-white"
                                                : `translate-y-1.5 ${hamburgerLineColor}`
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mega Menu Dropdown — inside wrapper so edges align with pill */}
                    <div
                        className={`absolute top-full left-(--container-padding) right-(--container-padding) rounded-bl-xs rounded-br-xs transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isMenuOpen
                                ? "opacity-100 translate-y-0 bg-white pointer-events-auto"
                                : "opacity-0 -translate-y-10 pointer-events-none"
                        }`}
                    >
                    <div
                        className="px-(--container-padding) py-12"
                        style={{ transitionDelay: isMenuOpen ? "150ms" : "0ms" }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                            {/* Column 1: Description */}
                            <div
                                className={`md:col-span-5 space-y-8 transition-opacity duration-500 ${
                                    isMenuOpen ? "opacity-100" : "opacity-0"
                                }`}
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
                                        <a
                                            href="mailto:contact@columbus.earth"
                                            className="text-[#0A1344] font-medium block transition-colors duration-300 hover:text-[#0A1344]/70"
                                        >
                                            contact@columbus.earth
                                        </a>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-2">
                                            <ScrambleText text="SOCIAL" isActive={isMenuOpen} delay={550} />
                                        </h4>
                                        <a
                                            href="https://www.linkedin.com/company/columbusearth/about/?viewAsMember=true"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-900 hover:text-primary font-medium block transition-colors"
                                        >
                                            LinkedIn
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Spacer */}
                            <div className="md:col-span-3"></div>

                            {/* Column 2: Company Links */}
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
                                            style={{
                                                transitionDelay: isMenuOpen
                                                    ? `${320 + index * 70 + index * index * 8}ms`
                                                    : "0ms",
                                            }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    setIsManuallyToggled(false);
                                                }}
                                                className="group relative text-xl font-medium text-[#0A1344] transition-all duration-300 flex items-center"
                                            >
                                                <span className="mr-3 transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                                                    +
                                                </span>
                                                <span className="transition-all duration-300 ease-in-out group-hover:translate-x-1">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                </div>{/* end max-w-screen-2xl wrapper */}
            </nav>
        </>
    );
};
