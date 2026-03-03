"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { ScrambleText } from "@/components/ui/ScrambleText";

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isManuallyToggled, setIsManuallyToggled] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const lastMouseY = useRef(0);
     useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!navRef.current) return;

            const navBounds = navRef.current.getBoundingClientRect();

            if (
                e.clientY > navBounds.bottom &&
                isMenuOpen &&
                isManuallyToggled
            ) {
                setIsMenuOpen(false);
                setIsManuallyToggled(false);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isMenuOpen, isManuallyToggled]);

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
             className={`fixed inset-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isMenuOpen 
            ? "opacity-100 backdrop-blur-md bg-black/10" 
            : "opacity-0 pointer-events-none"
            }`}
            />

            
            <nav
                ref={navRef}
                className={`header-font fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isMenuOpen
                        ? "border-b border-[#0a1628]/25 bg-[#FFFFFF]"
                        : "border-b border-[#0a1628]/12 bg-[#FFFFFF]"
                }`}
                onMouseEnter={handleNavMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="relative z-50 mx-auto w-full max-w-[1200px] px-4 lg:px-6">
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
                                sizes="48px"
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="brand-wordmark text-[27px] font-bold leading-none tracking-[-0.01em] text-[#0A1344]">
                            Columbus Earth
                        </span>
                    </Link>

                    {/* Navigation Links + Buttons */}
                    <div className="flex items-center gap-13 md:translate-x-[40px] lg:translate-x-[70px] xl:translate-x-[140px]">
                        <div className="hidden items-center gap-15 md:flex">
                            <Link
                                href="#"
                                className="group relative text-[19px] font-normal text-[#0a1628] transition-colors duration-300 hover:text-[#0A1344]"
                            >
                                Product
                                <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#0A1344] transition-all duration-300 group-hover:w-full" />
                            </Link>

                            <Link
                                href="#"
                                className="group relative text-[19px] font-normal text-[#0a1628] transition-colors duration-300 hover:text-[#0A1344]"
                            >
                                Use Cases
                                <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#0A1344] transition-all duration-300 group-hover:w-full" />
                            </Link>
                            <Link
                                href="/technology"
                                className="group relative text-[19px] font-normal text-[#0a1628] transition-colors duration-300 hover:text-[#0A1344]"
                            >
                                Technology
                                <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#0A1344] transition-all duration-300 group-hover:w-full" />
                            </Link>


                        </div>

                        <div className="flex items-center gap-8">
                            <Link
                                href="/maps-gpt"
                                className="h-[44px] min-w-[166px] border border-[#0A1344]/85 bg-white px-8 text-[19px] font-semibold text-[#0A1344] transition-colors hover:bg-gray-50 flex items-center justify-center"
                            >
                                Start Now
                            </Link>
                           <button
                            onClick={handleHamburgerClick}
                            className={`relative flex h-[44px] w-[44px] items-center justify-center transition-all duration-300 ${
                            isMenuOpen
                             ? "bg-[#0A1344] border border-[#0A1344]"
                            : "bg-white border border-[#0a1628]/85 hover:bg-[#0A1344]/5"
                          }`}
                              aria-label="Toggle menu"
                             >
                            {/* Top Line */}
                            <div
                            className={`absolute h-[2.6px] w-[22px] transform-gpu transition-all duration-450 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                            isMenuOpen
                                ? "rotate-45 bg-white"
                                : "-translate-y-[6px] bg-[#0A1344]"
                            }`}
                        />

                            {/* Middle Line */}
                            <div
                                className={`absolute h-[2.6px] w-[22px] transition-opacity duration-200 ${
                                isMenuOpen ? "opacity-0 bg-white" : "opacity-100 bg-[#0A1344]"
                                }`}
                            />

                            {/* Bottom Line */}
                            <div
                                className={`absolute h-[2.6px] w-[22px] transform-gpu transition-all duration-450 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                                isMenuOpen
                                    ? "-rotate-45 bg-white"
                                    : "translate-y-[6px] bg-[#0A1344]"
                                }`}
                            />
                            </button>


                      </div>
                    </div>
                </div>
            </div>

            {/* Mega Menu Dropdown - Slower smooth slide down */}
            <div
            className={`absolute top-full left-0 right-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isMenuOpen
            ? "opacity-100 translate-y-0 bg-white pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
            }`}

           >


                            <div
                            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"

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
                                <h4 className="text-[11px] font-semibold text-[#0A1344]/50 tracking-[0.18em] uppercase mb-4">
                                    <ScrambleText text="COLUMBUS EARTH" isActive={isMenuOpen} delay={300} />
                                </h4>
                                <p className=" text-[#0A1344]/70 text-[17px] leading-[1.65]  max-w-md">
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
                                             className="group relative text-xl font-medium text-[#0A1344] transition-all duration-300 block flex items-center"
                                        >
                                            <span className="mr-3 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1">
                                             +
                                            </span>

                                            <span className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1">
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