"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const Industries = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const items = [
    { src: "/Icon/gen.png", label: "Generative Geodata", href: "#" },
    { src: "/Icon/img1.png", label: "Logistics Optimization", href: "#" },
    { src: "/Icon/site.png", label: "Site Selection", href: "#" },
    { src: "/Icon/urban.png", label: "Urban Planning Research", href: "#" },
    { src: "/Icon/more.png", label: "More", href: "#" },
  ];

  return (
    <section className="bg-[#F5F5F7] py-[80px] md:py-[120px]">
      <div className="max-w-[980px] mx-auto px-6" ref={sectionRef}>

        {/* Centered intro */}
        <div
          className="text-center mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            filter: visible ? "blur(0px)" : "blur(6px)",
            transition: "opacity 0.7s ease, transform 0.7s ease, filter 0.7s ease",
          }}
        >
          <p className="text-[17px] font-semibold text-[#6E6E73] mb-4">
            Industries
          </p>
          <h2 className="text-[48px] md:text-[56px] font-semibold tracking-[-0.003em] leading-[1.07] text-[#1D1D1F] text-center">
            Find your industry
          </h2>
          <p className="text-[21px] md:text-[24px] font-normal leading-[1.38] text-[#6E6E73] text-center max-w-[600px] mx-auto mt-4">
            See how Columbus could help you across every sector.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-14">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`group block relative overflow-hidden rounded-2xl ${
                index === 4 ? "col-span-2 md:col-span-1" : ""
              }`}
              style={{
                height: 320,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0) scale(1)" : "translateY(14px) scale(0.98)",
                filter: visible ? "blur(0px)" : "blur(4px)",
                transition: `opacity 0.6s ease ${index * 70 + 150}ms, transform 0.6s ease ${index * 70 + 150}ms, filter 0.6s ease ${index * 70 + 150}ms`,
              }}
            >
              {/* Image */}
              <Image
                src={item.src}
                alt={item.label}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />

              {/* Bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <span className="text-white font-semibold text-[17px]">
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA links */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.6s ease 550ms, transform 0.6s ease 550ms",
          }}
        >
          <Link
            href="/technology"
            className="text-[#0066CC] text-[20px] hover:underline transition-colors"
          >
            Explore technology &#8250;
          </Link>
          <Link
            href="/platform"
            className="text-[#0066CC] text-[20px] hover:underline transition-colors"
          >
            Start now &#8250;
          </Link>
        </div>

      </div>
    </section>
  );
};
