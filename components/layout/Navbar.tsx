"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Our Mission", href: "/our-mission" },
    { label: "Columbus Market Spy", href: "/market-spy" },
    { label: "MapsGPT", href: "/maps-gpt" },
    { label: "Technology", href: "/technology" },
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 w-[404px] bg-white border-b border-[#0A1344]/15 z-50">

        <div className="px-[24px]">
          <div className="flex h-[76px] items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-[12px]">
              <div className="relative h-[36px] w-[36px]">
                <Image
                  src="/logobueno.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-[22px] font-semibold text-[#0A1344]">
                Columbus Earth
              </span>
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative flex h-[44px] w-[44px] items-center justify-center border border-[#0A1344]/80"
              aria-label="Toggle menu"
            >
              {/* Top */}
              <div
                className={`absolute h-[2px] w-[22px] transition-all duration-300 ${
                  isMenuOpen
                    ? "rotate-45 bg-[#0A1344]"
                    : "-translate-y-[6px] bg-[#0A1344]"
                }`}
              />

              {/* Middle */}
              <div
                className={`absolute h-[2px] w-[22px] transition-opacity duration-300 ${
                  isMenuOpen ? "opacity-0" : "opacity-100 bg-[#0A1344]"
                }`}
              />

              {/* Bottom */}
              <div
                className={`absolute h-[2px] w-[22px] transition-all duration-300 ${
                  isMenuOpen
                    ? "-rotate-45 bg-[#0A1344]"
                    : "translate-y-[6px] bg-[#0A1344]"
                }`}
              />
            </button>

          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`fixed top-[76px] w-[404px] bottom-0 bg-white z-40 transition-transform duration-500 ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="px-[24px] pt-[60px] space-y-[40px]">

          <ul className="space-y-[28px]">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[20px] font-medium text-[#0A1344] flex items-center"
                >
                  <span className="mr-[10px]">+</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/maps-gpt"
            onClick={() => setIsMenuOpen(false)}
            className="block w-full h-[50px] border border-[#0A1344] flex items-center justify-center text-[18px] font-semibold text-[#0A1344] mt-[20px]"
          >
            Start Now
          </Link>

        </div>
      </div>
    </>
  );
};