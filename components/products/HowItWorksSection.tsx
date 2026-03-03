// "use client";

// import Image from "next/image";

// export default function HowItWorksSection() {
//   return (
//     <section className="bg-[#F4F4F4] py-24 lg:py-32">
//       <div className="max-w-[1400px] mx-auto px-6">

//         {/* ================= TITLE ================= */}
//         <h2 className="text-center text-[40px] md:text-[56px] lg:text-[64px] leading-[140%] font-semibold text-black mb-16 lg:mb-24">
//           How It Works
//         </h2>

//         {/* ================= CONTENT ================= */}
//         <div className="grid lg:grid-cols-2 items-center gap-16 lg:gap-20">

//           {/* LEFT TEXT */}
//           <div className="flex justify-center lg:justify-start">
//             <p className="text-[32px] md:text-[48px] lg:text-[64px] leading-[140%] font-semibold text-[#0C4F4E] max-w-[450px] text-center lg:text-left">
//               Chat to find
//               <br />
//               what you need.
//             </p>
//           </div>

//           {/* RIGHT SIDE */}
//           <div className="flex flex-col items-center">

//             {/* ================= CLUSTER ================= */}
//             <div className="relative w-full max-w-[593px] aspect-square mb-[34px]">

//               {/* ===== CENTER IMAGE ===== */}
//               <Image
//                 src="/how/center.png"
//                 alt=""
//                 width={141}
//                 height={141}
//                 className="absolute left-[226px] top-[226px]"
//               />

//               {/* ================= IMAGES ================= */}

//               <Image
//                 src="/how/1.png"
//                 alt=""
//                 width={134}
//                 height={158}
//                 className="absolute left-[0px] top-[80px] rounded-[17px]"
//               />

//               <Image
//                 src="/how/3.png"
//                 alt=""
//                 width={107}
//                 height={129}
//                 className="absolute left-[220px] top-[40px] rounded-[14px]"
//               />

//               <Image
//                 src="/how/4.png"
//                 alt=""
//                 width={98}
//                 height={97}
//                 className="absolute right-[40px] top-[90px] rounded-[14px]"
//               />

//               <Image
//                 src="/how/5.png"
//                 alt=""
//                 width={113}
//                 height={135}
//                 className="absolute right-[30px] bottom-[140px] rounded-[17px]"
//               />

//               <Image
//                 src="/how/6.png"
//                 alt=""
//                 width={107}
//                 height={106}
//                 className="absolute left-[230px] bottom-[90px] rounded-[14px]"
//               />

//               <Image
//                 src="/how/7.png"
//                 alt=""
//                 width={134}
//                 height={158}
//                 className="absolute left-[60px] bottom-[0px] rounded-[17px]"
//               />

//               {/* ================= PILLS ================= */}

//               <Pill className="left-[10px] top-[20px]" />
//               <Pill className="left-[240px] top-[0px]" />
//               <Pill className="right-[0px] top-[120px]" />
//               <Pill className="right-[0px] bottom-[200px]" />
//               <Pill className="left-[210px] bottom-[40px]" />
//               <Pill className="left-[20px] bottom-[180px]" />

//             </div>
//             {/* ================= INPUT BOX ================= */}
// <div className="flex flex-col items-center">

//   {/* OUTER CONTAINER (593 x 134) */}
//   <div
//     className="relative w-[593px] h-[134px] rounded-[24px] bg-white"
//     style={{
//       boxShadow: "inset 0 0 0 2px #2F6F73"
//     }}
//   >

//     {/* TITLE */}
//     <div className="absolute top-[22px] left-0 w-full text-center text-[#3F9C95] text-[22px] font-medium">
//       Roll the dice
//     </div>

//     {/* INPUT FIELD (589 x 69 EXACT) */}
//     <div
//       className="absolute left-[2px] top-[63px] w-[589px] h-[69px] rounded-[24px] bg-white"
//       style={{
//         boxShadow: "inset 0 0 0 1px #C7DCDC"
//       }}
//     >
//       {/* TEXT */}
//       <div className="absolute left-[24px] top-[18px] text-[24px] text-[#6F8584]">
//         Ask MapsGPT anything
//       </div>

//       {/* ARROW BUTTON */}
//       <div className="absolute right-[16px] top-[8.5px] w-[52px] h-[52px] bg-[#8FC9C3] rounded-[16px] flex items-center justify-center">
//         <span className="text-white text-[26px] leading-none">→</span>
//       </div>
//     </div>

//   </div>

//   {/* FOOTER */}
//   <div className="mt-[24px] text-[18px] text-[#1E2432]">
//     Powered by Columbus-01
//     <span className="ml-[8px]">▶</span>
//   </div>

// </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


// /* ===================== PILL COMPONENT ===================== */

// function Pill({ className }: { className?: string }) {
//   return (
//     <div
//       className={`absolute w-[160px] h-[45px] bg-white border border-[#BCBCBC] rounded-[22.5px] flex items-center gap-3 px-4 text-[16px] font-medium text-black ${className}`}
//     >
//       <span className="text-[18px] leading-none">👩‍🦰</span>
//       <span>Gen Z Spots</span>
//     </div>
//   );
// }

"use client";

import Image from "next/image";

export default function HowItWorksSection() {
  return (
    <section className="bg-[#F4F4F4] py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">

        {/* ================= TITLE ================= */}
        <h2 className="text-center text-[32px] md:text-[48px] lg:text-[64px] leading-[140%] font-semibold text-black mb-12 lg:mb-24">
          How It Works
        </h2>

        {/* ================= CONTENT ================= */}
        <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-20">

          {/* LEFT TEXT */}
          <div className="flex justify-center lg:justify-start">
            <p className="text-[28px] md:text-[40px] lg:text-[64px] leading-[140%] font-semibold text-[#0C4F4E] max-w-[450px] text-center lg:text-left">
              Chat to find
              <br />
              what you need.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col items-center">

            {/* ================= CLUSTER ================= */}
            <div className="relative w-full max-w-[593px] aspect-square mb-[34px] lg:w-[593px] lg:h-[593px]">

              {/* CENTER IMAGE */}
              <Image
                src="/how/center.png"
                alt=""
                width={141}
                height={141}
                className="absolute left-[38%] top-[38%] w-[24%] lg:left-[226px] lg:top-[226px] lg:w-[141px]"
              />

              {/* IMAGES */}

              <Image
                src="/how/1.png"
                alt=""
                width={134}
                height={158}
                className="absolute left-[0%] top-[13%] w-[23%] rounded-[17px] lg:left-[0px] lg:top-[80px] lg:w-[134px]"
              />

              <Image
                src="/how/3.png"
                alt=""
                width={107}
                height={129}
                className="absolute left-[37%] top-[7%] w-[18%] rounded-[14px] lg:left-[220px] lg:top-[40px] lg:w-[107px]"
              />

              <Image
                src="/how/4.png"
                alt=""
                width={98}
                height={97}
                className="absolute right-[7%] top-[15%] w-[17%] rounded-[14px] lg:right-[40px] lg:top-[90px] lg:w-[98px]"
              />

              <Image
                src="/how/5.png"
                alt=""
                width={113}
                height={135}
                className="absolute right-[5%] bottom-[24%] w-[19%] rounded-[17px] lg:right-[30px] lg:bottom-[140px] lg:w-[113px]"
              />

              <Image
                src="/how/6.png"
                alt=""
                width={107}
                height={106}
                className="absolute left-[39%] bottom-[15%] w-[18%] rounded-[14px] lg:left-[230px] lg:bottom-[90px] lg:w-[107px]"
              />

              <Image
                src="/how/7.png"
                alt=""
                width={134}
                height={158}
                className="absolute left-[10%] bottom-[0%] w-[23%] rounded-[17px] lg:left-[60px] lg:bottom-[0px] lg:w-[134px]"
              />

              {/* PILLS */}
              <Pill className="left-[2%] top-[3%] lg:left-[10px] lg:top-[20px]" />
              <Pill className="left-[40%] top-[0%] lg:left-[240px] lg:top-[0px]" />
              <Pill className="right-[0%] top-[20%] lg:right-[0px] lg:top-[120px]" />
              <Pill className="right-[0%] bottom-[33%] lg:right-[0px] lg:bottom-[200px]" />
              <Pill className="left-[35%] bottom-[7%] lg:left-[210px] lg:bottom-[40px]" />
              <Pill className="left-[3%] bottom-[30%] lg:left-[20px] lg:bottom-[180px]" />
            </div>

            {/* ================= INPUT BOX ================= */}
            <div className="flex flex-col items-center w-full">

              <div
                className="relative w-full max-w-[593px] h-[110px] lg:w-[593px] lg:h-[134px] rounded-[24px] bg-white"
                style={{
                  boxShadow: "inset 0 0 0 2px #2F6F73"
                }}
              >

                {/* TITLE */}
                <div className="absolute top-[16px] lg:top-[22px] left-0 w-full text-center text-[#3F9C95] text-[18px] lg:text-[22px] font-medium">
                  Roll the dice
                </div>

                {/* INPUT FIELD */}
                <div
                  className="absolute left-[2px] right-[2px] bottom-[10px] lg:left-[2px] lg:top-[63px] lg:w-[589px] lg:h-[69px] h-[55px] rounded-[24px] bg-white"
                  style={{
                    boxShadow: "inset 0 0 0 1px #C7DCDC"
                  }}
                >
                  <div className="absolute left-[16px] lg:left-[24px] top-[14px] lg:top-[18px] text-[18px] lg:text-[24px] text-[#6F8584]">
                    Ask MapsGPT anything
                  </div>

                  <div className="absolute right-[12px] lg:right-[16px] top-[6px] lg:top-[8.5px] w-[40px] h-[40px] lg:w-[52px] lg:h-[52px] bg-[#8FC9C3] rounded-[16px] flex items-center justify-center">
                    <span className="text-white text-[20px] lg:text-[26px] leading-none">→</span>
                  </div>
                </div>
              </div>

              <div className="mt-[20px] lg:mt-[24px] text-[14px] lg:text-[18px] text-[#1E2432] text-center">
                Powered by Columbus-01
                <span className="ml-[6px] lg:ml-[8px]">▶</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}


/* ===================== PILL COMPONENT ===================== */

function Pill({ className }: { className?: string }) {
  return (
    <div
      className={`absolute w-[120px] h-[36px] lg:w-[160px] lg:h-[45px] bg-white border border-[#BCBCBC] rounded-[22.5px] flex items-center gap-2 lg:gap-3 px-3 lg:px-4 text-[12px] lg:text-[16px] font-medium text-black ${className}`}
    >
      <span className="text-[14px] lg:text-[18px] leading-none">👩‍🦰</span>
      <span>Gen Z Spots</span>
    </div>
  );
}