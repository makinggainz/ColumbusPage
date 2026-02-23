

"use client";

import Image from "next/image";

export const GeoWarning = () => {
  return (
    <section className="bg-[#F2F2F2] flex justify-center">
      <div className="relative w-[1440px] h-[820px]">

        {/* ===== TOP ROW ===== */}
        <Icon src="/Icon/icon-openai.png" className="absolute top-[110px] left-[240px] w-[60px]" />
        <Icon src="/Icon/xai.png" className="absolute top-[90px] left-[560px] w-[55px]" />
        <Icon src="/Icon/claude.png" className="absolute top-[105px] left-[940px] w-[70px]" />
        <Icon src="/Icon/mistral.png" className="absolute top-[110px] right-[240px] w-[60px]" />

        {/* ===== CENTER ===== */}
        <Icon src="/Icon/gemini.png" className="absolute top-[260px] left-1/2 -translate-x-1/2 w-[65px]" />

        {/* ===== MID LOWER ===== */}
        <Icon src="/Icon/xai2.png" className="absolute top-[480px] left-1/2 -translate-x-1/2 w-[50px]" />

        {/* ===== BOTTOM ROW ===== */}
        <Icon src="/Icon/gemini2.png" className="absolute top-[600px] left-[260px] w-[65px]" />
        <Icon src="/Icon/claude2.png" className="absolute top-[610px] left-[600px] w-[65px]" />
        <Icon src="/Icon/perplexity.png" className="absolute top-[600px] left-[900px] w-[60px]" />
        <Icon src="/Icon/icon-openai2.png" className="absolute top-[610px] right-[260px] w-[55px]" />

        {/* ===== HEADLINE ===== */}
        <h1 className="absolute top-[330px] left-1/2 -translate-x-1/2 text-[66px] font-semibold whitespace-nowrap text-[#2A0E0E]">
          Stop using <span className="text-black">Language models</span> for Geographical work.
        </h1>

        {/* ===== SUBTITLE ===== */}
        <p className="absolute top-[420px] left-1/2 -translate-x-1/2 text-[38px] font-medium whitespace-nowrap">
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