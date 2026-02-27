"use client";

import Image from "next/image";
import Link from "next/link";

export const Industries = () => {
  const items = [
    { src: "/Icon/gen.png", label: "Generative Geodata", href: "#" },
    { src: "/Icon/img1.png", label: "Logistics Optimization", href: "#" },
    { src: "/Icon/site.png", label: "Site Selection", href: "#" },
    { src: "/Icon/urban.png", label: "Urban Planning Research", href: "#" },
    { src: "/Icon/more.png", label: "More", href: "#" },
  ];

  return (
    <section className="bg-white py-20 md:py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-[#1C274C] mb-12 md:mb-16">
          See how Columbus could help you
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">

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
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

          <button className="px-6 py-3 border border-[#1C274C]/40 rounded-lg text-sm font-medium text-[#1C274C] hover:bg-[#1C274C]/5 transition w-full sm:w-auto">
            The technology that powers Columbus Pro
          </button>

          <button className="px-6 py-3 border border-[#1C274C]/40 rounded-lg text-sm font-medium text-[#1C274C] hover:bg-[#1C274C]/5 transition w-full sm:w-auto">
            Learn more about Columbus Pro platform
          </button>

        </div>

      </div>
    </section>
  );
};