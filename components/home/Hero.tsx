// "use client";

// import { cormorant } from "@/lib/fonts";
// import { useEffect, useState } from "react";
// import { ScrambleText } from "../ui/ScrambleText";
// import Image from "next/image";

// export const Hero = () => {
//   const [isActive, setIsActive] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     const t = setTimeout(() => setIsActive(true), 400);
//     return () => clearTimeout(t);
//   }, []);

//   return (
//     <section className="relative bg-[#F9F9F9] w-[400px] mx-auto overflow-hidden">

//       {/* TEXT BLOCK */}
//       <div className="pt-[266px] pl-[31px] pr-[37px]">

//         {/* Eyebrow */}
//         <p className="text-[12px] font-medium tracking-[-0.03em] text-[#1C274C]/70 uppercase mb-[20px]">
//           FRONTIER AI RESEARCH AND PRODUCT COMPANY
//         </p>

//         {/* Heading */}
//         <h1
//           className={`${cormorant.className} font-semibold
//           text-[40px] leading-[120%] tracking-[-0.02em] text-[#0A1344]
//           w-[334px]`}
//         >
//           {mounted ? (
//             <ScrambleText
//               text="The frontier AI Lab building the first in-production Large Geospatial Model."
//               isActive={isActive}
//               delay={0}
//             />
//           ) : (
//             "The frontier AI Lab building the first in-production Large Geospatial Model."
//           )}
//         </h1>

//         {/* Tag */}
//         <p className="mt-[28px] text-[12px] font-medium tracking-[0.08em] text-[#1C274C]/70">
//           [ COLUMBUS PRO-1 ]
//         </p>
//       </div>

//       {/* GRID IMAGE */}
//       <div className="mt-[40px] relative w-full h-[775px]">
//         <Image
//           src="/grid-animation.gif"
//           alt="Columbus grid"
//           fill
//           className="object-cover"
//         />
//       </div>

//     </section>
//   );
// };

"use client";

import { cormorant } from "@/lib/fonts";
import { useEffect, useState } from "react";
import { ScrambleText } from "../ui/ScrambleText";
import Image from "next/image";

export const Hero = () => {
  const [isActive, setIsActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setIsActive(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full flex justify-center bg-[#F9F9F9]">
      
      {/* 400px FIGMA FRAME */}
      <section className="w-[400px] bg-[#F9F9F9] overflow-hidden relative">

        {/* TEXT AREA */}
        <div className="pt-[120px] pl-[31px] pr-[37px]">

          {/* Eyebrow */}
          <p className="text-[12px] font-medium tracking-[-0.03em] text-[#1C274C]/70 uppercase mb-[20px]">
            FRONTIER AI RESEARCH AND PRODUCT COMPANY
          </p>

          {/* Heading */}
          <h1
            className={`${cormorant.className} font-semibold 
            text-[40px] leading-[120%] tracking-[-0.02em] text-[#0A1344] w-[334px]`}
          >
            {mounted ? (
              <ScrambleText
                text="The frontier AI Lab building the first in-production Large Geospatial Model."
                isActive={isActive}
                delay={0}
              />
            ) : (
              "The frontier AI Lab building the first in-production Large Geospatial Model."
            )}
          </h1>

          {/* Tag */}
          <p className="mt-[28px] text-[12px] font-medium tracking-[0.08em] text-[#1C274C]/70">
            [ COLUMBUS PRO-1 ]
          </p>
        </div>

        {/* ANIMATION SECTION — EXACT HEIGHT 775 */}
        <div className="mt-[40px] relative w-full h-[775px]">
          <Image
            src="/grid-animation.gif"
            alt="Columbus grid"
            fill
            className="object-cover"
            priority
          />
        </div>

      </section>
    </div>
  );
};