// "use client";

// import Image from "next/image";

// export default function InspirationStrip() {
//   return (
//     <section className="overflow-hidden">
//       <div className="flex justify-center">
//         <div
//           className="
//             relative w-[1730px] h-[671px] origin-top
//             scale-[0.6] sm:scale-[0.75]
//             md:scale-[0.9] xl:scale-100
//           "
//         >

//           {/* Gradient */}
//           <div className="absolute inset-0 bg-gradient-to-r from-[#F2E9D8] via-[#D6EEF2] to-[#B9E5F3]" />

//           {/* Floating Icons */}
//           <Image
//             src="/how/palm.png"
//             alt=""
//             width={92}
//             height={85}
//             className="absolute left-[260px] top-[260px]"
//           />

//           <Image
//             src="/how/glas.png"
//             alt=""
//             width={129}
//             height={142}
//             className="absolute left-[420px] top-[230px]"
//           />

//           <Image
//             src="/how/earth.png"
//             alt=""
//             width={133}
//             height={109}
//             className="absolute right-[430px] top-[250px]"
//           />

//           <Image
//             src="/how/pane.png"
//             alt=""
//             width={134}
//             height={115}
//             className="absolute right-[270px] top-[230px]"
//           />

//           {/* Center Pill */}
//           <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
//             <div className="px-10 py-5 bg-white/60 backdrop-blur-md rounded-full text-[#1F5E6A] text-[22px] shadow-sm">
//               Need some travel inspiration?
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import Image from "next/image";

export default function InspirationStrip() {
  return (
    <section className="w-full overflow-hidden">
      <div className="relative w-full aspect-[1731/752]">

        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F2E9D8] via-[#D6EEF2] to-[#B9E5F3]" />

        {/* Palm (Left) */}
        <Image
          src="/how/palm.png"
          alt=""
          width={92}
          height={85}
          className="absolute left-[15%] top-[35%] w-[5%] h-auto"
        />

        {/* Glass */}
        <Image
          src="/how/glas.png"
          alt=""
          width={129}
          height={142}
          className="absolute left-[24%] top-[30%] w-[7%] h-auto"
        />

        {/* Earth */}
        <Image
          src="/how/earth.png"
          alt=""
          width={133}
          height={109}
          className="absolute right-[25%] top-[34%] w-[7%] h-auto"
        />

        {/* Plane */}
        <Image
          src="/how/pane.png"
          alt=""
          width={134}
          height={115}
          className="absolute right-[15%] top-[30%] w-[7%] h-auto"
        />

        {/* Center Pill */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-[3%] py-[1.2%] bg-white/60 backdrop-blur-md rounded-full shadow-sm">
            <p className="text-[clamp(14px,1.6vw,22px)] text-[#1F5E6A] font-medium whitespace-nowrap">
              Need some travel inspiration?
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}