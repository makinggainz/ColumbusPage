"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { ScrambleText } from "@/components/ui/ScrambleText";
import glassStyles from "@/components/ui/GlassButton.module.css";

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

    // Pill background
    const pillBg = isMenuOpen
        ? "bg-white rounded-tl-xs rounded-tr-xs"
        : !isScrolled
            ? "bg-transparent"
            : "bg-transparent"; // glass effect applied via CSS Module below
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
            : "backdrop-blur-sm bg-white/70 border border-[#0A1344]/85 text-[#0A1344] hover:bg-white/90";
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
                {/* Row: logo on left, CTA+hamburger on right */}
                <div className="relative flex items-stretch h-14.5 pl-[clamp(20px,6.944vw,100px)] pr-[clamp(20px,6.944vw,100px)]">

                    {/* Pill background — glass on scroll, white when menu open */}
                    <div
                        className={`absolute top-0 bottom-0 right-[clamp(13px,calc(6.944vw-7px),93px)] left-[calc(50%-201px)] rounded-l-full rounded-r-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${pillBg} ${isScrolled && !isMenuOpen ? glassStyles.navPill : ''}`}
                        style={isScrolled && !isMenuOpen ? {
                            background: isDarkSection
                                ? 'linear-gradient(-75deg, rgba(5,10,35,0.3), rgba(5,10,35,0.45), rgba(5,10,35,0.3))'
                                : 'linear-gradient(-75deg, #ffffff0d, #fff3, #ffffff0d)',
                        } : undefined}
                    />

                    {/* Left: Logo — no background */}
                    <Link href="/" className="flex shrink-0 items-center gap-2 pr-8 z-50">
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

                    {/* Center: Navigation Links — absolutely centered in the full nav width */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                        <div className="hidden items-center gap-11.25 min-[1155px]:flex pointer-events-auto">
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
                    </div>

                    {/* Right: CTA + Hamburger */}
                    <div className="flex items-center gap-3 ml-auto z-50">
                        {isBrandCta ? (
                            <div className="hidden min-[1155px]:block">
                                <Link
                                    href="/maps-gpt"
                                    className={glassStyles.btn}
                                    style={{
                                        background: '#0A1344',
                                        boxShadow: 'none',
                                    }}
                                >
                                    <span style={{ color: 'white', fontSize: '1.0625rem', fontWeight: 600 }}>Start Now</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="hidden min-[1155px]:block">
                                <Link
                                    href="/maps-gpt"
                                    className={glassStyles.btn}
                                    style={{
                                        background: dark
                                            ? 'linear-gradient(-75deg, rgba(255,255,255,0.08), rgba(255,255,255,0.15), rgba(255,255,255,0.08))'
                                            : 'linear-gradient(-75deg, rgba(255,255,255,0.7), rgba(255,255,255,0.85), rgba(255,255,255,0.7))',
                                        boxShadow: dark
                                            ? 'inset 0 1px 2px rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.25)'
                                            : 'inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(10,19,68,0.05), 0 2px 10px rgba(10,19,68,0.08), 0 0 0 1px rgba(10,19,68,0.14)',
                                    }}
                                >
                                    <span style={{ color: dark ? 'white' : '#0A1344', fontSize: '1.0625rem', fontWeight: 600 }}>Start Now</span>
                                </Link>
                            </div>
                        )}
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

                {/* Mega Menu Dropdown */}
                <div
                    className={`absolute top-full left-[calc(50%-201px)] right-[clamp(13px,calc(6.944vw-7px),93px)] rounded-bl-xs rounded-br-xs transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isMenuOpen
                            ? "opacity-100 translate-y-0 bg-white pointer-events-auto"
                            : "opacity-0 -translate-y-10 pointer-events-none"
                    }`}
                >
                    <div
                        className={`absolute top-full left-(--container-padding) right-(--container-padding) rounded-bl-xs rounded-br-xs transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isMenuOpen
                                ? "opacity-100 translate-y-0 bg-white pointer-events-auto"
                                : "opacity-0 -translate-y-10 pointer-events-none"
                        }`}
                    >
                    <div
                        className="pl-7 pr-(--container-padding) py-12"
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
