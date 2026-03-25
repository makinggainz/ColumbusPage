"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";

const NAV_LINKS = [
    { label: "Product", href: "#" },
    { label: "Use Cases", href: "/use-cases" },
    { label: "Technology", href: "/technology" },
    { label: "MapsGPT", href: "/maps-gpt" },
    { label: "Our Mission", href: "/our-mission" },
];

const MENU_LINKS = [
    { label: "Product", href: "#" },
    { label: "Use Cases", href: "/use-cases" },
    { label: "Technology", href: "/technology" },
    { label: "MapsGPT", href: "/maps-gpt" },
    { label: "Our Mission", href: "/our-mission" },
    { label: "Columbus Market Spy", href: "/market-spy" },
];

const NAV_HEIGHT = 56;

export const Navbar = ({ theme = "light" }: { theme?: "light" | "dark" }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const isDark = theme === "dark";

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMenuOpen]);

    const closeMenu = useCallback(() => setIsMenuOpen(false), []);

    // Transparent at top with white or dark text depending on theme.
    // On scroll or menu open: white bg + dark text always.
    const showBg = scrolled || isMenuOpen;
    const textColor = showBg ? "#171a20" : (isDark ? "#FFFFFF" : "#171a20");

    return (
        <>
            {/* Backdrop overlay when menu is open */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30"
                    onClick={closeMenu}
                />
            )}

            <nav
                ref={navRef}
                className="fixed top-0 left-0 right-0 z-50"
                style={{ height: NAV_HEIGHT }}
            >
                {/* Background layer */}
                <div
                    className="absolute inset-0 pointer-events-none transition-all duration-300 ease-out"
                    style={{
                        backgroundColor: showBg ? "rgba(255,255,255,0.97)" : "transparent",
                        backdropFilter: showBg ? "blur(20px) saturate(1.2)" : "none",
                        WebkitBackdropFilter: showBg ? "blur(20px) saturate(1.2)" : "none",
                        borderBottom: showBg ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent",
                    }}
                />

                {/* Nav content */}
                <div
                    className="relative mx-auto h-full flex items-center justify-between"
                    style={{
                        maxWidth: 1280,
                        paddingLeft: 24,
                        paddingRight: 24,
                        color: textColor,
                        transition: "color 300ms ease",
                    }}
                >
                    {/* Left: Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0 z-10">
                        <div
                            className="relative shrink-0"
                            style={{
                                width: 28,
                                height: 28,
                                filter: showBg ? "none" : (isDark ? "brightness(0) invert(1)" : "none"),
                                transition: "filter 300ms ease",
                            }}
                        >
                            <Image
                                src="/logobueno.png"
                                alt="Columbus"
                                fill
                                sizes="28px"
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Center: Nav links (desktop only) */}
                    <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`px-4 py-1.5 text-[14px] font-medium rounded-sm transition-colors duration-200 ${
                                    !showBg && isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                                }`}
                                style={{
                                    letterSpacing: "-0.01em",
                                    color: "inherit",
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right: CTA + Hamburger */}
                    <div className="flex items-center gap-3 z-10">
                        {/* Help icon */}
                        <button
                            className="hidden lg:flex items-center justify-center w-9 h-9 rounded-sm transition-colors duration-200 hover:bg-black/5"
                            aria-label="Help"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </button>

                        {/* Account icon */}
                        <Link
                            href="/maps-gpt"
                            className="hidden lg:flex items-center justify-center w-9 h-9 rounded-sm transition-colors duration-200 hover:bg-black/5"
                            aria-label="Account"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </Link>

                        {/* Hamburger */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center justify-center w-9 h-9 rounded-sm transition-colors duration-200 hover:bg-black/5 lg:hidden"
                            aria-label="Toggle menu"
                        >
                            <div className="relative w-[18px] h-[14px]">
                                <span
                                    className="absolute left-0 h-px bg-current transition-all duration-300 ease-out"
                                    style={{
                                        width: 18,
                                        top: isMenuOpen ? 7 : 0,
                                        transform: isMenuOpen ? "rotate(45deg)" : "rotate(0)",
                                    }}
                                />
                                <span
                                    className="absolute left-0 top-[7px] h-px bg-current transition-opacity duration-200"
                                    style={{
                                        width: 18,
                                        opacity: isMenuOpen ? 0 : 1,
                                    }}
                                />
                                <span
                                    className="absolute left-0 h-px bg-current transition-all duration-300 ease-out"
                                    style={{
                                        width: 18,
                                        top: isMenuOpen ? 7 : 14,
                                        transform: isMenuOpen ? "rotate(-45deg)" : "rotate(0)",
                                    }}
                                />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile menu panel */}
                <div
                    className="lg:hidden absolute top-full left-0 right-0 bg-white overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                        maxHeight: isMenuOpen ? 500 : 0,
                        opacity: isMenuOpen ? 1 : 0,
                        borderBottom: isMenuOpen ? "1px solid rgba(0,0,0,0.06)" : "none",
                    }}
                >
                    <div className="px-6 py-8 space-y-1">
                        {MENU_LINKS.map((link, i) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={closeMenu}
                                className="block py-3 text-[22px] font-medium text-[#171a20] transition-all duration-300"
                                style={{
                                    opacity: isMenuOpen ? 1 : 0,
                                    transform: isMenuOpen ? "translateY(0)" : "translateY(12px)",
                                    transitionDelay: isMenuOpen ? `${80 + i * 50}ms` : "0ms",
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="pt-6 mt-4 border-t border-black/10">
                            <Link
                                href="mailto:contact@columbus.earth"
                                className="block py-2 text-[15px] text-[#171a20]/60"
                            >
                                contact@columbus.earth
                            </Link>
                            <a
                                href="https://www.linkedin.com/company/columbusearth/about/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block py-2 text-[15px] text-[#171a20]/60"
                            >
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};
