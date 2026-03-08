// "use client";

// import Image from "next/image";

// export default function DataCollectionSection() {
//   return (
//     <section className="w-full bg-[#F4F3EB] py-20 lg:py-28">

//       <div className="max-w-[1728px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-12 items-start">

//         {/* LEFT CONTENT */}
//         <div className="max-w-[260px]">

//           <p className="text-[21px] leading-[140%] text-[#111]">
//             <span className="text-[#2563EB] font-medium">Columbus</span>{" "}
//             enables anyone to be super-explorers. Let us help you find answers
//             faster.
//           </p>

//           <button className="mt-6 bg-[#0A1344] text-white px-8 py-3 rounded-md text-[15px] font-medium">
//             Let’s Chat
//           </button>

//         </div>

//         {/* RIGHT IMAGE AREA */}
//         <div className="flex-1 relative">

//           {/* blurred background */}
//           <div className="relative w-full h-[500px] md:h-[600px] lg:h-[694px] rounded-[14px] overflow-hidden">

//             <Image
//               src="/enterprise/sunbg.png"
//               alt="background"
//               fill
//               className="object-cover blur-[6px] scale-110"
//               priority
//             />

//             {/* overlay blur tint */}
//             <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px]" />

//             {/* desktop app */}
//             <Image
//               src="/enterprise/desk.png"
//               alt="desktop"
//               width={849}
//               height={476}
//               className="absolute left-[8%] bottom-[8%] rounded-xl shadow-2xl"
//             />

//             {/* phone mock */}
//             <Image
//               src="/enterprise/mob.png"
//               alt="mobile"
//               width={266}
//               height={579}
//               className="absolute right-[8%] bottom-[8%] shadow-2xl"
//             />

//           </div>

//         </div>

//       </div>

//       {/* section label */}
//       <div className="max-w-[1728px] mx-auto px-6 lg:px-12 mt-16 text-[#8A8A8A] text-[19px]">
//         Data Collection
//       </div>

//     </section>
//   );
// }
"use client";

import Image from "next/image";

export default function DataCollectionSection() {
  return (
    <section className="w-full bg-[#F4F3EB] py-16 md:py-20 lg:py-28">

      <div className="max-w-[1728px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-12 items-start">

        {/* LEFT CONTENT */}
        <div className="max-w-[260px] w-full">

          <p className="text-[20px] md:text-[21px] leading-[140%] text-[#111]">
            <span className="text-[#2563EB] font-medium">Columbus</span>{" "}
            enables anyone to be super-explorers. Let us help you find answers
            faster.
          </p>

          <button className="mt-6 bg-[#0A1344] text-white px-8 py-3 rounded-md text-[15px] font-medium">
            Let’s Chat
          </button>

        </div>

        {/* RIGHT IMAGE AREA */}
        <div className="flex-1 relative w-full">

          {/* blurred background */}
          <div className="relative w-full h-[420px] sm:h-[500px] md:h-[600px] lg:h-[694px] rounded-[14px] overflow-hidden">

            <Image
              src="/enterprise/sunbg.png"
              alt="background"
              fill
              className="object-cover blur-[6px] scale-110"
              priority
            />

            {/* overlay blur tint */}
            <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px]" />

            {/* desktop app */}
            <Image
              src="/enterprise/desk.png"
              alt="desktop"
              width={849}
              height={476}
              className="
                absolute 
                left-[6%] md:left-[8%] 
                bottom-[8%]
                w-[70%] 
                max-w-[849px]
                rounded-xl 
                shadow-2xl
              "
            />

            {/* phone mock */}
            <Image
              src="/enterprise/mob.png"
              alt="mobile"
              width={266}
              height={579}
              className="
                absolute 
                right-[6%] md:right-[8%] 
                bottom-[8%]
                w-[28%] 
                max-w-[266px]
                shadow-2xl
              "
            />

          </div>

        </div>

      </div>

      {/* section label */}
      <div className="max-w-[1728px] mx-auto px-6 lg:px-12 mt-12 md:mt-16 text-[#8A8A8A] text-[17px] md:text-[19px]">
        Data Collection
      </div>

    </section>
  );
}