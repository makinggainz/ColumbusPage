import Image from "next/image";
import Link from "next/link";

const USE_CASES = [
  {
    title: "Commercial Real Estate",
    description:
      "Site selection, market analysis, and investment intelligence powered by spatial reasoning.",
    image: "/use-cases/comercial.png",
    href: "/use-cases",
  },
  {
    title: "Urban Planning",
    description:
      "Infrastructure density, zoning analysis, and growth prediction for cities and municipalities.",
    image: "/use-cases/planning.png",
    href: "/use-cases",
  },
  {
    title: "Environmental Research",
    description:
      "Wildfire risk, deforestation tracking, and climate impact modeling at global scale.",
    image: "/use-cases/env.png",
    href: "/use-cases",
  },
];

export function UseCaseCards() {
  return (
    <section style={{ backgroundColor: "#F9F9F9" }}>
      <div className="max-w-[1287px] mx-auto px-8 md:px-10 py-20 md:py-28">
        <h2
          className="text-[32px] md:text-[40px] font-medium leading-[1.1] text-[#1D1D1F]"
          style={{ letterSpacing: "-0.02em" }}
        >
          Use cases across industries
        </h2>
        <p className="mt-4 text-[16px] md:text-[17px] leading-[1.6] text-[#6E6E73] max-w-[600px]">
          From commercial real estate to environmental science — spatial
          intelligence applied to real-world decisions.
        </p>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {USE_CASES.map((uc) => (
            <Link
              key={uc.title}
              href={uc.href}
              className="group block rounded-lg overflow-hidden bg-white transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(10,22,40,0.1)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={uc.image}
                  alt={uc.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-[18px] font-medium text-[#1D1D1F] leading-[1.3]">
                  {uc.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-[#6E6E73]">
                  {uc.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#0A1344] group-hover:text-[#2563EB] transition-colors duration-300">
                  Learn more
                  <svg width="8" height="14" viewBox="0 0 10 18" fill="none">
                    <path
                      d="M1 1l8 8-8 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
