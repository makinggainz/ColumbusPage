import Image from "next/image";
import Link from "next/link";

const USE_CASES = [
  {
    title: "Residential Real Estate",
    image: "/use-cases/residentila.png",
    href: "/use-cases",
  },
  {
    title: "Commercial Real Estate",
    image: "/use-cases/comercial.png",
    href: "/use-cases",
  },
  {
    title: "Generative Geodata",
    image: "/use-cases/gen.png",
    href: "/use-cases",
  },
  {
    title: "Logistics Optimization",
    image: "/use-cases/logistics.png",
    href: "/use-cases",
  },
  {
    title: "Urban Planning",
    image: "/use-cases/planning.png",
    href: "/use-cases",
  },
  {
    title: "Site Selection",
    image: "/use-cases/site.png",
    href: "/use-cases",
  },
  {
    title: "Consumer Mapping",
    image: "/use-cases/geomarketing.png",
    href: "/use-cases",
  },
  {
    title: "Ground Due Diligence",
    image: "/use-cases/due.png",
    href: "/use-cases",
  },
  {
    title: "Environmental Research",
    image: "/use-cases/env.png",
    href: "/use-cases",
  },
  {
    title: "Security",
    image: "/use-cases/security.png",
    href: "/use-cases",
  },
  {
    title: "Tourism",
    image: "/use-cases/tourism.png",
    href: "/use-cases",
  },
  {
    title: "Research",
    image: "/use-cases/research.png",
    href: "/use-cases",
  },
];

export function UseCaseCards() {
  return (
    <section style={{ background: "linear-gradient(to bottom, rgba(0, 102, 204, 0.12) 0%, rgba(0, 102, 204, 0.05) 50%, #ffffff 100%)" }}>
      <div className="max-w-[1287px] mx-auto px-8 md:px-10 py-20 md:py-28">
        <div className="flex items-end justify-between gap-8">
          <div>
            <h2
              className="text-[32px] md:text-[40px] font-medium leading-[1.1] text-[#0A1344]"
              style={{ letterSpacing: "-0.02em" }}
            >
              We&apos;re actively exploring various application areas
            </h2>
            <p className="mt-4 text-[16px] md:text-[17px] leading-[1.6] text-[rgba(10,19,68,0.55)] max-w-[600px]">
              We&apos;d love to work within your industry, send us a{" "}
              <a href="mailto:hey@columbus.earth" className="text-[#0A1344] hover:text-[#2563EB] transition-colors">
                hey@columbus.earth
              </a>
            </p>
          </div>
          <Link
            href="/use-cases"
            className="hidden md:inline-flex items-center gap-2 text-[15px] font-medium text-[#0A1344] hover:text-[#2563EB] transition-colors duration-300 group flex-shrink-0"
          >
            <span>Explore all</span>
            <svg
              width="10"
              height="18"
              viewBox="0 0 10 18"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M1 1l8 8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Scrollable carousel */}
        <div
          className="mt-12 flex gap-5 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`.use-case-scroller::-webkit-scrollbar { display: none; }`}</style>
          {USE_CASES.map((uc) => (
            <Link
              key={uc.title}
              href={uc.href}
              className="group relative block flex-shrink-0 w-[280px] md:w-[320px] aspect-[3/4] rounded-lg overflow-hidden"
            >
              {/* Full-bleed background image */}
              <Image
                src={uc.image}
                alt={uc.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="320px"
              />

              {/* Bottom gradient — dark at bottom, fading up */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 40%, transparent 70%)",
                }}
              />

              {/* Bottom blur gradient — stronger blur at bottom */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backdropFilter: "blur(0px)",
                  WebkitBackdropFilter: "blur(0px)",
                  maskImage: "linear-gradient(to top, black 0%, black 20%, transparent 50%)",
                  WebkitMaskImage: "linear-gradient(to top, black 0%, black 20%, transparent 50%)",
                }}
              />

              {/* Hover blur overlay — full card blur on hover */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  backdropFilter: "blur(4px)",
                  WebkitBackdropFilter: "blur(4px)",
                  background: "rgba(0,0,0,0.15)",
                }}
              />

              {/* Text content — positioned at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <h3 className="text-[16px] font-medium text-white leading-[1.3]">
                  {uc.title}
                </h3>
                <span className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-white/70 group-hover:text-white transition-colors duration-300">
                  Learn more
                  <svg width="8" height="14" viewBox="0 0 10 18" fill="none">
                    <path d="M1 1l8 8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
