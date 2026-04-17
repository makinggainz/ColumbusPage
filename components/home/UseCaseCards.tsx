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
          <style>{`
            .use-case-scroller::-webkit-scrollbar { display: none; }
            .uc-card-img {
              transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .group:hover .uc-card-img {
              transform: scale(1.05);
            }
            /* Color overlay — gradient stays dark at bottom for legibility */
            .uc-card-color {
              background: linear-gradient(to top, rgba(8, 15, 40, 0.72) 0%, rgba(8, 15, 40, 0.52) 35%, rgba(8, 15, 40, 0.48) 100%);
              transition: background 1s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .group:hover .uc-card-color {
              background: linear-gradient(to top, rgba(8, 15, 40, 0.68) 0%, rgba(8, 15, 40, 0.42) 40%, rgba(8, 15, 40, 0.38) 100%);
            }
            /* No blur by default */
            .uc-card-blur-full {
              backdrop-filter: blur(2px);
              -webkit-backdrop-filter: blur(2px);
              opacity: 0;
              transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .group:hover .uc-card-blur-full {
              opacity: 1;
            }
            /* Bottom blur placeholder — not needed in this direction */
            .uc-card-blur-bottom {
              opacity: 0;
            }
            .uc-card-arrow {
              transition: transform 800ms cubic-bezier(0.16, 1, 0.3, 1), color 600ms ease;
            }
            .group:hover .uc-card-arrow {
              transform: translateX(4px);
              color: #2563EB;
            }
          `}</style>
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
                className="object-cover uc-card-img"
                sizes="320px"
              />

              {/* Dark navy color overlay */}
              <div className="absolute inset-0 pointer-events-none uc-card-color" />
              {/* Full blur — fades out on hover */}
              <div className="absolute inset-0 pointer-events-none uc-card-blur-full" />
              {/* Bottom-only blur — fades in on hover */}
              <div className="absolute inset-0 pointer-events-none uc-card-blur-bottom" />

              {/* Text content — positioned at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <h3 className="text-[16px] font-medium text-white leading-[1.3]">
                  {uc.title}
                </h3>
                <span className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-white/70 uc-card-cta">
                  Learn more
                  <svg width="8" height="14" viewBox="0 0 10 18" fill="none" className="uc-card-arrow">
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
