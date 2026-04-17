import Image from "next/image";
import Link from "next/link";

interface ProductShowcaseProps {
  title: string;
  tagline: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
  image: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
  background?: string;
}

export function ProductShowcase({
  title,
  tagline,
  description,
  features,
  cta,
  image,
  imageAlt,
  imagePosition = "left",
  background = "#ffffff",
}: ProductShowcaseProps) {
  const textBlock = (
    <div className="flex flex-col justify-center py-16 md:py-24">
      <h2
        className="text-[32px] md:text-[40px] lg:text-[48px] font-medium leading-[1.1] text-[#1D1D1F]"
        style={{ letterSpacing: "-0.02em" }}
      >
        {title}
      </h2>
      <p
        className="mt-3 text-[18px] md:text-[20px] font-medium text-[#0A1344]"
        style={{ letterSpacing: "-0.01em" }}
      >
        {tagline}
      </p>
      <p className="mt-6 text-[16px] md:text-[17px] leading-[1.65] text-[#6E6E73] max-w-[520px]">
        {description}
      </p>
      <ul className="mt-8 flex flex-col gap-3">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-[15px] md:text-[16px] text-[#1D1D1F] leading-[1.5]"
          >
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgba(37,99,235,0.5)] flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href={cta.href}
        className="mt-10 inline-flex items-center gap-2 text-[15px] font-medium text-[#0A1344] hover:text-[#2563EB] transition-colors duration-300 group"
      >
        <span>{cta.label}</span>
        <svg
          width="10"
          height="18"
          viewBox="0 0 10 18"
          fill="none"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          <path
            d="M1 1l8 8-8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );

  const imageBlock = (
    <div className="relative flex items-center justify-center py-8 md:py-16">
      <div className="relative w-full max-w-[560px] rounded-lg overflow-hidden shadow-[0_24px_64px_rgba(10,22,40,0.12)]">
        <Image
          src={image}
          alt={imageAlt}
          width={1120}
          height={720}
          className="w-full h-auto"
        />
      </div>
    </div>
  );

  return (
    <section style={{ backgroundColor: background }}>
      <div className="max-w-[1287px] mx-auto px-8 md:px-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">
          {imagePosition === "left" ? (
            <>
              {imageBlock}
              {textBlock}
            </>
          ) : (
            <>
              {textBlock}
              {imageBlock}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
