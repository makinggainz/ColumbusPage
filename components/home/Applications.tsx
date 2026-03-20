"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const Applications = () => {
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
    { title: "Residential Real Estate", image: "/UseCases/ResidentialRealEstate.jpg", href: "/applications/residential-real-estate" },
    { title: "Commercial Real Estate", image: "/UseCases/CommercialRealEstate.jpg", href: "/applications/commercial-real-estate" },
    { title: "Generative Geodata", image: "/UseCases/GenDatalayers.png", href: "/applications/generative-geodata" },
    { title: "Logistics Optimization", image: "/UseCases/Logistics.webp", href: "/applications/logistics-optimization" },
    { title: "Urban Planning", image: "/UseCases/UrbanPlanning.jpg", href: "/applications/urban-planning" },
    { title: "Site Selection", image: "/UseCases/SiteSelection.jpg", href: "/applications/site-selection" },
    { title: "Consumer Mapping", image: "/UseCases/ConsumerMapping.jpeg", href: "/applications/consumer-mapping" },
    { title: "Ground Due Diligence", image: "/UseCases/GroundDueDillegence.png", href: "/applications/ground-due-diligence" },
    { title: "More", image: "/UseCases/GeoMarketing.png", href: "/applications" },
  ];

  return (
    <section className="bg-[#FFFFFF] py-[80px] md:py-[120px]">
      <div className="max-w-[980px] mx-auto px-6" ref={sectionRef}>

        {/* Header */}
        <div
          className="mb-12 md:mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            filter: visible ? "blur(0px)" : "blur(6px)",
            transition: "opacity 0.7s ease, transform 0.7s ease, filter 0.7s ease",
          }}
        >
          <p className="text-[17px] font-semibold text-[#6E6E73] text-center mb-3">
            Use Cases
          </p>
          <h2 className="text-[48px] md:text-[56px] font-semibold tracking-[-0.003em] leading-[1.07] text-[#1D1D1F] text-center">
            We&apos;re actively exploring
            <br className="hidden md:block" /> various application areas
          </h2>
          <p className="mt-4 text-[21px] font-normal leading-[1.38] text-[#6E6E73] text-center">
            We&apos;d love to work within your industry —{" "}
            <a href="mailto:hey@columbus.earth" className="text-[#4F46E5] hover:underline">
              hey@columbus.earth
            </a>
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="relative group aspect-[16/10] w-full overflow-hidden block rounded-2xl"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  priority={index < 3}
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col z-20 px-5 pb-5">
                  <h3 className="text-[17px] font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[14px] text-white/70 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                    Learn more ›
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
