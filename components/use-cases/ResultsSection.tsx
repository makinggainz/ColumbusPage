"use client";

import Image from "next/image";

export default function ResultsSection() {
  return (
    <section className="relative w-full py-[120px]">

      {/* Background */}
      <Image
        src="/use-cases/resultbg.png"
        alt=""
        fill
        className="object-cover -z-10"
      />

      <div className="max-w-[1728px] mx-auto px-[94px] max-lg:px-[40px] max-md:px-[20px]">

        {/* TITLE */}
        <h2 className="font-serif text-[64px] leading-[100%] text-[#1F2A44] mb-[80px] max-lg:text-[48px] max-md:text-[36px]">
          Results of our <br /> Large Geospatial Model:
        </h2>

        {/* ROW 1 */}
        <div className="grid grid-cols-2 gap-x-[120px] max-lg:gap-x-[60px] max-md:grid-cols-1 border-t border-[#E5E7EB] py-[60px]">

          <Feature
            number="1"
            text={`Fast semantic reasoning in cities.
Contextual enrichment.`}
            image="/use-cases/result1.png"
          />

          <Feature
            number="2"
            text={`Generalist model, with access to wide catalogue`}
            image="/use-cases/result2.png"
          />

        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-2 gap-x-[120px] max-lg:gap-x-[60px] max-md:grid-cols-1 border-t border-[#E5E7EB] py-[60px]">

          <Feature
            number="1"
            text={`Generative geospatial data`}
            image="/use-cases/result3.png"
          />

          <Feature
            number="1"
            text={`Deep spatial reasoning at scale`}
            image="/use-cases/result4.png"
          />

        </div>

      </div>
    </section>
  );
}


function Feature({ number, text, image }: { number: string; text: string; image: string }) {
  return (
    <div className="flex items-center justify-between gap-[60px] max-md:flex-col max-md:items-start">

      {/* TEXT */}
      <div className="flex items-start gap-[12px] max-w-[362px]">

        <span className="bg-[#1F4ED8] text-white w-[36px] h-[36px] flex items-center justify-center text-[16px] font-semibold shrink-0">
          {number}
        </span>

        <p className="text-[20px] leading-[140%] whitespace-pre-line text-[#111] max-md:text-[18px]">
          {text}
        </p>

      </div>

      {/* IMAGE */}
      <Image
        src={image}
        alt=""
        width={349}
        height={276}
        className="rounded-[12px] max-md:w-full max-md:h-auto"
      />

    </div>
  );
}