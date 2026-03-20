"use client";

import type { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Linkedin } from "lucide-react";

export type FooterProps = {
  variant?: "default" | "compact";
  reveal?: boolean;
  theme?: "light" | "dark";
};

export const Footer: FC<FooterProps> = ({ variant = "default", reveal = false }) => {
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
      data-navbar-theme="light"
      className={`bg-[#F5F5F7] border-t border-[rgba(0,0,0,0.08)] ${reveal ? "h-screen" : ""}`}
      style={reveal ? { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 0 } : undefined}
    >
      <div className="max-w-[980px] mx-auto px-6 py-[40px] flex flex-col justify-between min-h-[460px]">

        {/* Top: Logo + description */}
        <div className="mb-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="relative h-7 w-7 shrink-0">
              <Image
                src="/logobueno.png"
                alt="Columbus Logo"
                fill
                sizes="28px"
                className="object-contain"
              />
            </div>
            <span className="text-[14px] font-semibold leading-none text-[#1D1D1F]">
              Columbus Earth
            </span>
          </div>

          <p className="text-[12px] leading-[1.7] text-[#6E6E73] max-w-[280px] mb-4">
            We are a group of engineers, designers, and company builders developing
            foundation models and data collection innovations to power the geospatial
            intelligence systems of tomorrow.
          </p>
          <p className="text-[12px] leading-[1.7] text-[#6E6E73] max-w-[280px]">
            GeoContext-1 processes satellite imagery, terrain data, infrastructure networks,
            and temporal patterns to generate actionable intelligence across defence, climate,
            consumer and urban planning domains.
          </p>
        </div>

        {/* Bottom: Nav columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 border-t border-[rgba(0,0,0,0.08)] pt-10">

          <FooterColumn
            title="Product"
            links={[
              { label: "Columbus Pro", href: "/platform" },
              { label: "Use Cases", href: "/use-cases" },
              { label: "MapsGPT", href: "/maps-gpt" },
            ]}
          />

          <FooterColumn
            title="Technology"
            links={[
              { label: "LGM vs LLM", href: "/technology" },
              { label: "Data Collection", href: "/technology" },
              { label: "Core Reasoning", href: "/technology" },
              { label: "Research Blog", href: "/technology" },
            ]}
          />

          <FooterColumn
            title="Company"
            links={[
              { label: "Our Mission", href: "/our-mission" },
              { label: "Careers", href: "/" },
              { label: "Legal", href: "/" },
            ]}
          />

          <div>
            <p className="text-[12px] font-semibold text-[#1D1D1F] mb-3">
              Connect
            </p>
            <a
              href="mailto:contact@columbus.earth"
              className="block text-[12px] text-[#6E6E73] hover:text-[#1D1D1F] hover:underline transition-colors mb-2 leading-[2]"
            >
              contact@columbus.earth
            </a>
            <div className="flex gap-4 mt-4">
              <Mail size={16} className="cursor-pointer text-[#6E6E73] hover:text-[#1D1D1F] transition-colors" />
              <Linkedin size={16} className="cursor-pointer text-[#6E6E73] hover:text-[#1D1D1F] transition-colors" />
            </div>
          </div>

        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-[rgba(0,0,0,0.08)]">
        <div className="max-w-[980px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between py-4 gap-3 text-[#6E6E73] text-[12px]">
          <span>Columbus Earth &copy; 2026</span>
          <div className="flex items-center gap-8">
            <span>Website made by hand, no AI.</span>
            <span>www.columbus.earth</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) => (
  <div>
    <p className="text-[12px] font-semibold text-[#1D1D1F] mb-3">
      {title}
    </p>
    <ul className="space-y-0">
      {links.map((link, i) => (
        <li key={i}>
          <Link
            href={link.href}
            className="text-[12px] leading-[2] text-[#6E6E73] hover:text-[#1D1D1F] hover:underline transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
