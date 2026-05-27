"use client";

import type { FC } from "react";
import Link from "next/link";
import { Mail, Linkedin } from "lucide-react";

export type FooterProps = {
  variant?: "default" | "compact";
  reveal?: boolean;
  theme?: "light" | "dark" | "light-blue";
  /** Optional override for the footer background color. Currently
   *  accepted but not rendered — kept for forward-compat with callers
   *  (e.g. RootShell) that already pass a value. */
  bg?: string;
  /** Optional decorative background image path. Currently accepted but
   *  not rendered — kept for forward-compat with callers. */
  bgImage?: string;
};

export const Footer: FC<FooterProps> = ({ variant = "default", reveal = false, theme = "light" }) => {
  const bgColor = theme === "dark" ? "#000000" : theme === "light-blue" ? "#F4F3EB" : "#F9F9F9";

  if (variant === "compact") {
    return (
      <footer data-navbar-theme="light" className="relative bg-[#F5F5F7] border-t border-[rgba(0,0,0,0.08)] py-10">
        <div className="max-w-[980px] mx-auto px-6 flex flex-col items-center text-center gap-5">
          <p className="text-[12px] text-[#6E6E73] max-w-md leading-relaxed">
            The frontier AI lab building the first production Universal Geospatial Model.
          </p>
          <div className="flex gap-4">
            <Mail size={16} className="cursor-pointer text-[#6E6E73] hover:text-[#1D1D1F] transition-colors" />
            <Linkedin size={16} className="cursor-pointer text-[#6E6E73] hover:text-[#1D1D1F] transition-colors" />
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      data-footer
      data-navbar-theme={theme === "dark" ? "dark" : "light"}
      className={`overflow-hidden flex flex-col relative ${theme === "dark" ? "text-white" : "text-[#1D1D1F]"}`}
      style={{
        background: bgColor,
        ...(reveal ? { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 0 } as React.CSSProperties : {}),
      }}
    >
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-8 pt-16 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-start mb-10">
          <div>
            <h3
              className={`text-[24px] font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-[#1D1D1F]"}`}
              style={{ fontFamily: "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif", letterSpacing: "-0.02em" }}
            >
              Columbus Earth
            </h3>
            <p className={`text-[14px] leading-relaxed mb-4 max-w-[260px] ${theme === "dark" ? "text-white/50" : "text-[#1D1D1F]/50"}`}>
              The frontier AI lab building the first production Universal Geospatial Model.
            </p>
            <div className="flex gap-4">
              <a href="mailto:contact@columbus.earth"><Mail size={18} className={`transition-colors ${theme === "dark" ? "text-white/40 hover:text-white" : "text-[#1D1D1F]/40 hover:text-[#1D1D1F]"}`} /></a>
              <a href="https://www.linkedin.com/company/columbusearth/about/" target="_blank" rel="noopener noreferrer"><Linkedin size={18} className={`transition-colors ${theme === "dark" ? "text-white/40 hover:text-white" : "text-[#1D1D1F]/40 hover:text-[#1D1D1F]"}`} /></a>
            </div>
          </div>
          <FooterColumn theme={theme} title="Product" links={[
            { label: "Columbus Pro", href: "/products/business" },
            { label: "MapsGPT", href: "/products/consumer" },
          ]} />
          <FooterColumn theme={theme} title="Technology" links={[
            { label: "LGM vs LLM", href: "/research#lgm-vs-llm" },
            { label: "Data Collection", href: "/research#data-collection" },
            { label: "Core Reasoning", href: "/research#core-reasoning" },
          ]} />
          <FooterColumn theme={theme} title="Company" links={[
            { label: "Our Mission", href: "/company" },
            { label: "Contact", href: "/contact" },
          ]} />
        </div>

        <div className={`border-t pt-4 pb-2 flex items-center justify-between text-[13px] ${theme === "dark" ? "border-white/10 text-white/30" : "border-[#1D1D1F]/10 text-[#1D1D1F]/40"}`}>
          <span>Columbus Earth &copy; 2026</span>
          <span>www.columbus.earth</span>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({
  title,
  links,
  theme = "light",
}: {
  title: string;
  links: { label: string; href: string }[];
  theme?: "light" | "dark" | "light-blue";
}) => (
  <div>
    <p className={`mb-4 font-medium text-[17.5px] tracking-wide ${theme === "dark" ? "text-white" : "text-[#1D1D1F]"}`}>
      {title}
    </p>
    <ul className={`space-y-2 text-[17.5px] ${theme === "dark" ? "text-white/60" : "text-[#1D1D1F]/60"}`}>
      {links.map((link, i) => (
        <li key={i}>
          <Link
            href={link.href}
            className={`cursor-pointer transition-colors ${theme === "dark" ? "hover:text-white" : "hover:text-[#0A1344]"}`}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
