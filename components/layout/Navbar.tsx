"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// Scramble/Decode text effect component
const ScrambleText = ({
    text,
    isActive,
    delay = 0,
    className = "",
}: {
    text: string;
    isActive: boolean;
    delay?: number;
    className?: string;
}) => {
    const [displayText, setDisplayText] = useState(text);

    useEffect(() => {
        if (!isActive) return;

        let iteration = 0;
        let interval: ReturnType<typeof setInterval> | undefined;

        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                setDisplayText(
                    text
                        .split("")
                        .map((char, index) => {
                            if (char === " ") return " ";
                            if (index < iteration) return text[index];
                            return SCRAMBLE_CHARS[
                                Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                            ];
                        })
                        .join("")
                );

                iteration += 1;

                if (iteration >= text.length) {
                    if (interval) clearInterval(interval);
                    setDisplayText(text);
                }
            }, 20);
        }, delay);

        return () => {
            clearTimeout(timeout);
            if (interval) clearInterval(interval);
        };
    }, [delay, isActive, text]);

    return <span className={`font-mono ${className}`}>{isActive ? displayText : text}</span>;
};

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isManuallyToggled, setIsManuallyToggled] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const lastMouseY = useRef(0);

    const menuItems = [
        { label: "Our Mission", href: "/our-mission" },
        { label: "Columbus Market Spy", href: "/market-spy" },
        { label: "MapsGPT", href: "/maps-gpt" },
        { label: "Technology", href: "/technology" },
    ];

    // Handle mouse enter on nav - open menu
    const handleMouseEnter = () => {
        if (!isManuallyToggled) {
            setIsMenuOpen(true);
        }
    };

    // Handle mouse leave - only close if exiting from bottom/sides, not from top
    const handleMouseLeave = (e: React.MouseEvent) => {
        // If manually toggled, don't auto-close
        if (isManuallyToggled) return;

        const navBounds = navRef.current?.getBoundingClientRect();
        if (!navBounds) return;

        // If mouse is leaving from the top (y < navBounds.top), keep menu open
        // This happens when user moves cursor to browser tab area
        if (e.clientY <= navBounds.top) {
            return; // Keep menu open
        }

        // Otherwise, close the menu (exiting from bottom or sides)
        setIsMenuOpen(false);
    };

    // Handle hamburger click - toggle manually
    const handleHamburgerClick = () => {
        setIsManuallyToggled(true);
        setIsMenuOpen(!isMenuOpen);
    };

    // Reset manual toggle when mouse enters again
    const handleNavMouseEnter = () => {
        if (isManuallyToggled && !isMenuOpen) {
            setIsManuallyToggled(false);
        }
        handleMouseEnter();
    };

    return (
        <>
            {/* Backdrop blur overlay */}
            <div 
                className={`fixed inset-0 z-40 transition-all duration-500 ${
                    isMenuOpen 
                        ? "opacity-100 backdrop-blur-sm bg-black/5" 
                        : "opacity-0 pointer-events-none"
                }`}
            />
            
            <nav 
                ref={navRef}
                className="header-font fixed top-0 left-0 right-0 z-50 border-b border-[#0a1628]/12 bg-[#FFFFFF]"
                onMouseEnter={handleNavMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="relative z-50 mx-auto w-full max-w-[980px] px-5 lg:px-8">
                <div className="flex h-[76px] items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex -translate-x-2 items-center gap-2.5 md:-translate-x-[70px] lg:-translate-x-[110px] xl:-translate-x-[140px]"
                    >
                        <div className="relative h-12 w-12">
                            <Image
                                src="/logobueno.png"
                                alt="Columbus Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="text-[27px] font-semibold leading-none tracking-[-0.01em] text-[#0A1344]">
                            Columbus Earth
                        </span>
                    </Link>

                    {/* Navigation Links + Buttons */}
                    <div className="flex items-center gap-10 md:translate-x-[50px] lg:translate-x-[90px] xl:translate-x-[200px]">
                        <div className="hidden items-center gap-15 md:flex">
                            <Link
                                href="#"
                                className="text-[18px] font-normal text-[#0a1628] transition-colors hover:text-gray-600"
                            >
                                Product
                            </Link>
                            <Link
                                href="#"
                                className="text-[18px] font-normal text-[#0a1628] transition-colors hover:text-gray-600"
                            >
                                Use Cases
                            </Link>
                            <Link
                                href="/technology"
                                className="text-[18px] font-normal text-[#0a1628] transition-colors hover:text-gray-600"
                            >
                                Technology
                            </Link>
                        </div>

                        <div className="flex items-center gap-8">
                            <Link
                                href="/maps-gpt"
                                className="h-[44px] min-w-[166px] border border-[#0A1344]/85 bg-white px-8 text-[18px] font-semibold text-[#0A1344] transition-colors hover:bg-gray-50 flex items-center justify-center"
                            >
                                Start Now
                            </Link>
                            <button
                                onClick={handleHamburgerClick}
                                className="flex h-[44px] w-[44px] items-center justify-center border border-[#0a1628]/85 transition-colors hover:bg-gray-50"
                                aria-label="Toggle menu"
                            >
                                <svg
                                    width="26"
                                    height="26"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M2 6H22"
                                        stroke="#0A1344"
                                        strokeWidth="2.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M2 12H22"
                                        stroke="#0A1344"
                                        strokeWidth="2.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M2 18H22"
                                        stroke="#0A1344"
                                        strokeWidth="2.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mega Menu Dropdown - Slower smooth slide down */}
            <div
                className={`absolute top-full left-0 right-0 overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isMenuOpen
                        ? "max-h-[600px] opacity-100 border-b border-gray-100 bg-white"
                        : "max-h-0 opacity-0 pointer-events-none"
                }`}
            >
                <div
                    className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
                    }`}
                    style={{ transitionDelay: isMenuOpen ? "150ms" : "0ms" }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        {/* Column 1: Description */}
                        <div
                            className={`md:col-span-5 space-y-8 transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                            }`}
                            style={{ transitionDelay: isMenuOpen ? "200ms" : "0ms" }}
                        >
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-4">
                                    <ScrambleText text="COLUMBUS EARTH" isActive={isMenuOpen} delay={300} />
                                </h4>
                                <p className="text-gray-600 text-lg leading-relaxed max-w-md">
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
                                        className="text-gray-900 hover:text-primary font-medium block transition-colors"
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

                        {/* Column 2: Company Links with Stagger Animation */}
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
                                        className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                            isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                                        }`}
                                        style={{
                                            transitionDelay: isMenuOpen ? `${350 + index * 80}ms` : "0ms",
                                        }}
                                    >
                                        <Link
                                            href={item.href}
                                            className="group text-xl font-medium text-gray-900 hover:text-primary block transition-all duration-300 flex items-center"
                                        >
                                            <span className="mr-2">+</span>
                                            <span className="group-hover:translate-x-1 transition-transform duration-300">
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
        </nav>
        </>
    );
};
