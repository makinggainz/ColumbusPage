


"use client";

import Image from "next/image";

export const GeoWarning = () => {
  return (
    <section className="bg-[#F2F2F2] flex justify-center overflow-hidden">
      <div className="relative w-full max-w-[1440px] min-h-[400px] sm:min-h-[600px] md:h-[820px] px-5 sm:px-10">

        {/* ===== TOP ROW ===== */}
        <Icon src="/Icon/icon-openai.png" className="absolute top-[40px] sm:top-[80px] md:top-[110px] left-[10%] sm:left-[16%] w-[35px] sm:w-[48px] md:w-[60px]" />
        <Icon src="/Icon/xai.png" className="absolute top-[30px] sm:top-[60px] md:top-[90px] left-[35%] sm:left-[38%] w-[30px] sm:w-[42px] md:w-[55px]" />
        <Icon src="/Icon/claude.png" className="absolute top-[40px] sm:top-[75px] md:top-[105px] right-[30%] sm:right-[33%] w-[38px] sm:w-[55px] md:w-[70px] hidden sm:block" />
        <Icon src="/Icon/mistral.png" className="absolute top-[40px] sm:top-[80px] md:top-[110px] right-[10%] sm:right-[16%] w-[35px] sm:w-[48px] md:w-[60px]" />

        {/* ===== CENTER ===== */}
        <Icon src="/Icon/gemini.png" className="absolute top-[100px] sm:top-[180px] md:top-[260px] left-1/2 -translate-x-1/2 w-[40px] sm:w-[52px] md:w-[65px] hidden sm:block" />

        {/* ===== MID LOWER ===== */}
        <Icon src="/Icon/xai2.png" className="absolute top-[240px] sm:top-[360px] md:top-[480px] left-1/2 -translate-x-1/2 w-[30px] sm:w-[40px] md:w-[50px] hidden md:block" />

        {/* ===== BOTTOM ROW ===== */}
        <Icon src="/Icon/gemini2.png" className="absolute bottom-[60px] sm:bottom-[100px] md:top-[600px] left-[10%] sm:left-[18%] w-[38px] sm:w-[52px] md:w-[65px] hidden sm:block" />
        <Icon src="/Icon/claude2.png" className="absolute bottom-[50px] sm:bottom-[90px] md:top-[610px] left-[35%] sm:left-[40%] w-[38px] sm:w-[52px] md:w-[65px] hidden md:block" />
        <Icon src="/Icon/perplexity.png" className="absolute bottom-[60px] sm:bottom-[100px] md:top-[600px] right-[30%] sm:right-[36%] w-[35px] sm:w-[48px] md:w-[60px] hidden md:block" />
        <Icon src="/Icon/icon-openai2.png" className="absolute bottom-[50px] sm:bottom-[90px] md:top-[610px] right-[10%] sm:right-[18%] w-[32px] sm:w-[44px] md:w-[55px] hidden sm:block" />

        {/* ===== HEADLINE ===== */}
        <h1 className="absolute top-[120px] sm:top-[220px] md:top-[330px] left-1/2 -translate-x-1/2 text-[24px] sm:text-[40px] md:text-[56px] lg:text-[66px] font-semibold text-[#2A0E0E] text-center w-[90%] sm:w-auto sm:whitespace-nowrap">
          Stop using <span className="text-black">Language models</span> for Geographical work.
        </h1>

        {/* ===== SUBTITLE ===== */}
        <p className="absolute top-[200px] sm:top-[300px] md:top-[420px] left-1/2 -translate-x-1/2 text-[14px] sm:text-[22px] md:text-[30px] lg:text-[38px] font-medium text-center w-[90%] sm:w-auto sm:whitespace-nowrap">
          <span className="text-red-600">LLMs</span>{" "}
          <span className="bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            hallucinate and cannot be trusted for the real world
          </span>
        </p>

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
  <div className={`${className} opacity-50`}>
    <Image src={src} alt="" width={100} height={100} />
  </div>
);
