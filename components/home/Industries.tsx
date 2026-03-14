"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Container } from "@/components/layout/Container";

export const Industries = () => {
  const items = [
    { src: "/Icon/gen.png", label: "Generative Geodata", href: "#" },
    { src: "/Icon/img1.png", label: "Logistics Optimization", href: "#" },
    { src: "/Icon/site.png", label: "Site Selection", href: "#" },
    { src: "/Icon/urban.png", label: "Urban Planning Research", href: "#" },
    { src: "/Icon/more.png", label: "More", href: "#" },
  ];

  return (
    <section className="bg-white py-20 md:py-28 lg:py-36 relative">
      {/* Vector 4412 */}
      <div
        className="absolute w-0 h-[645px] border-l border-[#E8EAF0]"
        style={{
          left: "99.5px",
          top: 0,
          transform: "matrix(1, 0, 0, -1, 0, 0)",
        }}
        aria-hidden
      />
      {/* Vector 4412 — right side */}
      <div
        className="absolute w-0 h-[645px] border-r border-[#E8EAF0]"
        style={{
          right: "99.5px",
          top: 0,
          transform: "matrix(1, 0, 0, -1, 0, 0)",
        }}
        aria-hidden
      />
      <Container>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-[#1C274C] mb-[33px] md:mb-[49px] -translate-x-[50px]">
          See how Columbus could help you
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-16 -translate-x-[50px] w-[calc(100%+30px)] sm:w-[calc(100%+40px)] md:w-[calc(100%+50px)] lg:w-[calc(100%+70px)]">

          {items.map((item, index) => (
            <div key={index}>

              <Link href={item.href} className="group block">
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden">

                  {index === 4 ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2A3F5F]/60 to-[#1C274C]/40 backdrop-blur-sm" />
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.label}
                      fill
                      className="object-cover"
                    />
                  )}

                  <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-[#2A64F6] transition" />
                </div>
              </Link>

              <Link
                href={item.href}
                className="mt-4 inline-flex items-center gap-2 text-sm sm:text-base font-medium text-[#1C274C]"
              >
                {item.label}
              </Link>

            </div>
          ))}

        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 -translate-x-[50px]">

          <Link
            href="/technology"
            className="px-6 py-3 border border-[#1C274C]/40 rounded-[2px] text-sm font-medium text-[#010101] hover:bg-[#1C274C]/5 transition w-full sm:w-auto inline-flex items-center justify-center gap-2"
          >
            The technology that powers Columbus Pro
            <ArrowUp size={20} strokeWidth={2} />
          </Link>

          <Link
            href="/platform"
            className="px-6 py-3 border border-[#1C274C]/40 rounded-[2px] text-sm font-medium text-[#010101] hover:bg-[#1C274C]/5 transition w-full sm:w-auto inline-flex items-center justify-center gap-2"
          >
            Learn more about Columbus Pro platform
            <ArrowUp size={20} strokeWidth={2} />
          </Link>

        </div>

      </Container>
    </section>
  );
};