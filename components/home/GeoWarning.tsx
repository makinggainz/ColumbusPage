

"use client";

import Image from "next/image";

export const GeoWarning = () => {
  return (
    <section className="bg-[#F2F2F2] flex justify-center px-4 sm:px-6">
      <div className="relative w-full max-w-[1440px] min-h-[400px] sm:min-h-[520px] md:min-h-[680px] lg:h-[820px] py-12 sm:py-16 md:py-0 md:flex md:items-center">

        {/* Decorative icons: hidden on mobile, visible from md up */}
        <Icon src="/Icon/icon-openai.png" className="hidden md:block absolute top-[110px] left-[8%] lg:left-[240px] w-[40px] lg:w-[60px]" />
        <Icon src="/Icon/xai.png" className="hidden md:block absolute top-[90px] left-[28%] lg:left-[560px] w-[36px] lg:w-[55px]" />
        <Icon src="/Icon/claude.png" className="hidden md:block absolute top-[105px] left-[52%] lg:left-[940px] w-[44px] lg:w-[70px]" />
        <Icon src="/Icon/mistral.png" className="hidden md:block absolute top-[110px] right-[8%] lg:right-[240px] w-[40px] lg:w-[60px]" />
        <Icon src="/Icon/gemini.png" className="hidden md:block absolute top-[260px] left-1/2 -translate-x-1/2 w-[50px] lg:w-[65px]" />
        <Icon src="/Icon/xai2.png" className="hidden md:block absolute top-[480px] left-1/2 -translate-x-1/2 w-[40px] lg:w-[50px]" />
        <Icon src="/Icon/gemini2.png" className="hidden md:block absolute top-[600px] left-[18%] lg:left-[260px] w-[44px] lg:w-[65px]" />
        <Icon src="/Icon/claude2.png" className="hidden md:block absolute top-[610px] left-[42%] lg:left-[600px] w-[44px] lg:w-[65px]" />
        <Icon src="/Icon/perplexity.png" className="hidden md:block absolute top-[600px] right-[38%] lg:left-[900px] lg:right-auto w-[40px] lg:w-[60px]" />
        <Icon src="/Icon/icon-openai2.png" className="hidden md:block absolute top-[610px] right-[18%] lg:right-[260px] w-[36px] lg:w-[55px]" />

        {/* HEADLINE + SUBTITLE: centered, responsive, wrap on small screens */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-[24px] sm:text-[32px] md:text-[48px] lg:text-[66px] font-semibold text-[#2A0E0E] leading-tight px-2">
            Stop using <span className="text-black">Language models</span> for Geographical work.
          </h1>
          <p className="mt-4 sm:mt-6 md:mt-8 text-[14px] sm:text-[20px] md:text-[28px] lg:text-[38px] font-medium text-center px-2">
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
  <div className={`${className} opacity-50`}>
    <Image src={src} alt="" width={100} height={100} />
  </div>
);

// "use client";

// import Image from "next/image";

// export const GeoWarning = () => {
//   return (
//     <section className="bg-[#F2F2F2] w-[1731px] h-[885px] mx-auto relative">

//       {/* ===== TOP ROW ===== */}
//       <Icon src="/Icon/icon-openai.png" x={202} y={184} w={72} h={71} />
//       <Icon src="/Icon/xai.png" x={616} y={144} w={70} h={80} />
//       <Icon src="/Icon/claude.png" x={886} y={150} w={73} h={73} />
//       <Icon src="/Icon/mistral.png" x={1269} y={184} w={60} h={60} />

//       {/* ===== CENTER ===== */}
//       <Icon src="/Icon/gemini.png" x={865} y={320} w={73} h={73} />

//       {/* ===== MID LOWER ===== */}
//       <Icon src="/Icon/xai2.png" x={865} y={520} w={60} h={60} />

//       {/* ===== BOTTOM ROW ===== */}
//       <Icon src="/Icon/gemini2.png" x={260} y={700} w={65} h={65} />
//       <Icon src="/Icon/claude2.png" x={808} y={720} w={65} h={65} />
//       <Icon src="/Icon/perplexity.png" x={1100} y={700} w={60} h={60} />
//       <Icon src="/Icon/icon-openai2.png" x={1500} y={720} w={55} h={55} />

//       {/* ===== HEADLINE ===== */}
//       <h1
//         className="absolute text-[66px] font-semibold whitespace-nowrap text-[#2A0E0E]"
//         style={{
//           left: "865px",
//           top: "350px",
//           transform: "translateX(-50%)",
//         }}
//       >
//         Stop using{" "}
//         <span className="text-black">Language models</span> for Geographical work.
//       </h1>

//       {/* ===== SUBTITLE ===== */}
//       <p
//         className="absolute text-[38px] font-medium whitespace-nowrap"
//         style={{
//           left: "865px",
//           top: "440px",
//           transform: "translateX(-50%)",
//         }}
//       >
//         <span className="text-red-600">LLMs</span>{" "}
//         <span className="bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
//           hallucinate and cannot be trusted for the real world
//         </span>
//       </p>

//     </section>
//   );
// };

// const Icon = ({
//   src,
//   x,
//   y,
//   w,
//   h,
// }: {
//   src: string;
//   x: number;
//   y: number;
//   w: number;
//   h: number;
// }) => (
//   <div
//     className="absolute opacity-50"
//     style={{
//       left: `${x}px`,
//       top: `${y}px`,
//       width: `${w}px`,
//       height: `${h}px`,
//     }}
//   >
//     <Image src={src} alt="" width={w} height={h} />
//   </div>
// );