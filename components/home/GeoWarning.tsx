"use client";

import Image from "next/image";

export const GeoWarning = () => {
  return (
    <div className="w-full flex justify-center bg-[#F2F2F2]">
      
      {/* 404 × 1160 FIGMA FRAME */}
      <section className="relative w-[404px] h-[1160px] bg-[#F2F2F2] overflow-hidden">

        {/* ===== TOP ICONS ===== */}
        <Icon src="/Icon/icon-openai.png" className="absolute top-[120px] left-[80px] w-[40px]" />
        <Icon src="/Icon/claude.png" className="absolute top-[140px] right-[80px] w-[42px]" />
        <Icon src="/Icon/xai.png" className="absolute top-[240px] left-[100px] w-[38px]" />
        <Icon src="/Icon/gemini.png" className="absolute top-[250px] right-[100px] w-[38px]" />

        {/* ===== HEADLINE (341 × 135) ===== */}
        <h2 className="absolute top-[420px] left-[29px] w-[341px] text-[32px] font-semibold leading-[140%] text-center text-[#2A0E0E]">
          Stop using <span className="text-black">Language models</span> for Geographical work.
        </h2>

        {/* ===== SUBTITLE (300 × 68) ===== */}
        <p className="absolute top-[600px] left-[51px] w-[300px] text-[24px] font-medium leading-[140%] text-center">
          <span className="text-red-600">LLMs</span>{" "}
          <span className="bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            hallucinate and cannot be trusted for the real world
          </span>
        </p>

        {/* ===== BOTTOM ICONS ===== */}
        <Icon src="/Icon/perplexity.png" className="absolute bottom-[220px] left-[70px] w-[45px]" />
        <Icon src="/Icon/mistral.png" className="absolute bottom-[160px] right-[90px] w-[42px]" />
        <Icon src="/Icon/gemini2.png" className="absolute bottom-[60px] left-1/2 -translate-x-1/2 w-[50px]" />

      </section>
    </div>
  );
};

const Icon = ({
  src,
  className,
}: {
  src: string;
  className: string;
}) => (
  <div className={`${className} opacity-50`}>
    <Image src={src} alt="" width={100} height={100} />
  </div>
);