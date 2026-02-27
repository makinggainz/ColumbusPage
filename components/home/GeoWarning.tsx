"use client";

import Image from "next/image";

export const GeoWarning = () => {
  return (
    <section className="bg-[#F2F2F2] relative overflow-hidden py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 relative min-h-[500px] md:min-h-[650px]">

        {/* FLOATING ICONS (Positioned with % instead of fixed px) */}

        <Icon src="/Icon/icon-openai.png" className="top-[10%] left-[10%] w-8 md:w-12 lg:w-14" />
        <Icon src="/Icon/xai.png" className="top-[8%] left-[35%] w-8 md:w-12" />
        <Icon src="/Icon/claude.png" className="top-[10%] right-[30%] w-8 md:w-14" />
        <Icon src="/Icon/mistral.png" className="top-[12%] right-[10%] w-8 md:w-12" />

        <Icon src="/Icon/gemini.png" className="top-[30%] left-1/2 -translate-x-1/2 w-10 md:w-14" />
        <Icon src="/Icon/xai2.png" className="top-[60%] left-1/2 -translate-x-1/2 w-8 md:w-12" />

        <Icon src="/Icon/gemini2.png" className="bottom-[10%] left-[12%] w-8 md:w-12" />
        <Icon src="/Icon/claude2.png" className="bottom-[8%] left-[40%] w-8 md:w-12" />
        <Icon src="/Icon/perplexity.png" className="bottom-[10%] right-[35%] w-8 md:w-12" />
        <Icon src="/Icon/icon-openai2.png" className="bottom-[8%] right-[12%] w-8 md:w-12" />

        {/* HEADLINE */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold text-[#2A0E0E] leading-tight">
            Stop using <span className="text-black">Language models</span> for Geographical work.
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-2xl lg:text-3xl font-medium">
            <span className="text-red-600">LLMs</span>{" "}
            <span className="bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              hallucinate and cannot be trusted for the real world
            </span>
          </p>
        </div>

      </div>
    </section>
  );
};

const Icon = ({
  src,
  className,
}: {
  src: string;
  className: string;
}) => (
  <div className={`absolute opacity-40 ${className}`}>
    <Image src={src} alt="" width={80} height={80} />
  </div>
);