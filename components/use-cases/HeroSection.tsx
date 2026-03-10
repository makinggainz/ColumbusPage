// "use client";

// import Image from "next/image";

// export default function HeroSection() {
//   return (
//     <section className="relative w-full h-[898px] max-lg:h-[994px] max-md:h-[640px] overflow-hidden">

//       {/* Background */}
//       <Image
//         src="/use-cases/hero.png"
//         alt="city"
//         fill
//         priority
//         className="object-cover"
//       />

//       {/* Dark overlay for readability */}
//       <div className="absolute inset-0 bg-black/20" />

//       {/* 1728 container */}
//       <div className="relative max-w-[1728px] mx-auto h-full">

//         {/* TEXT BLOCK */}
//         <div className="absolute left-[10px] top-[219px] max-md:left-[24px] max-md:right-[24px]">

//           {/* TITLE */}
//           <h1
//             className="
//             text-white
//             font-serif
//             text-[80px]
//             leading-[140%]
//             whitespace-nowrap
//             max-xl:text-[72px]
//             max-lg:text-[56px]
//             max-md:text-[40px]
//             max-sm:text-[32px]
//             max-md:whitespace-normal
//             "
//           >
//             Why you should be excited about our LGM
//           </h1>

//           {/* SUBTITLE */}
//           <p
//             className="
//             text-white/90
//             mt-6
//             max-w-[1198px]
//             text-[30px]
//             leading-[140%]
//             max-lg:text-[22px]
//             max-md:text-[18px]
//             "
//           >
//             ChatGPT, Gemini and Claude do not comprehend coordinates nor are
//             trained on earth data. Don’t use hallucinatory chat bots for your
//             critical work.
//           </p>

//           {/* BOTTOM TEXT */}
//           <p
//             className="
//             text-white
//             mt-70
//             text-[25px]
//             font-bold
//             tracking-[0.04em]
//             max-md:text-[18px]
//             "
//           >
//             [ We have just launched our technology in various sectors. ]
//           </p>

//         </div>

//       </div>
//     </section>
//   );
// }

"use client";

import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[898px] max-lg:h-[820px] max-md:h-[720px] overflow-hidden">

      {/* Background Image */}
      <Image
        src="/use-cases/hero.png"
        alt="city"
        fill
        priority
        className="object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* 1728 container */}
      <div className="relative max-w-[1728px] mx-auto h-full">

        {/* TEXT BLOCK */}
        <div className="absolute left-[10px] top-[219px] max-md:left-[24px] max-md:right-[24px]">

          {/* TITLE */}
          <h1
            className="
            text-white
            font-serif
            text-[80px]
            leading-[140%]
            whitespace-nowrap
            max-xl:text-[72px]
            max-lg:text-[56px]
            max-md:text-[40px]
            max-sm:text-[32px]
            max-md:whitespace-normal
            "
          >
            Why you should be excited about our LGM
          </h1>

          {/* SUBTITLE */}
          <p
            className="
            text-white/90
            mt-6
            max-w-[1198px]
            text-[30px]
            leading-[140%]
            max-lg:text-[22px]
            max-md:text-[18px]
            "
          >
            ChatGPT, Gemini and Claude do not comprehend coordinates nor are
            trained on earth data. Don’t use hallucinatory chat bots for your
            critical work.
          </p>

        </div>

        {/* BOTTOM TEXT */}
        <p
          className="
          absolute
          left-[10px]
          bottom-[60px]
          text-white
          text-[25px]
          font-bold
          tracking-[0.04em]
          max-md:left-[24px]
          max-md:text-[18px]
          "
        >
          [ We have just launched our technology in various sectors. ]
        </p>

      </div>
    </section>
  );
}