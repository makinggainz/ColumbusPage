"use client";

import Image from "next/image";

export default function ShowcaseSection() {
  const FRAME_WIDTH = 1728;
  const FRAME_HEIGHT = 1343;

  return (
    <section className="relative bg-[#F4F6F8] overflow-hidden flex justify-center">

      {/* Aspect Ratio Wrapper (True Responsive Height) */}
      <div
        className="relative w-full max-w-[1728px]"
        style={{
          aspectRatio: `${FRAME_WIDTH} / ${FRAME_HEIGHT}`,
        }}
      >
        {/* Scaled Content Layer */}
        <div
          className="absolute top-0 left-0 origin-top"
          style={{
            width: FRAME_WIDTH,
            height: FRAME_HEIGHT,
            transform: "scale(min(1, 100vw / 1728))",
            transformOrigin: "top center",
          }}
        >
          <div className="relative w-[1728px] h-[1343px]">

            {/* Title */}
            <div className="absolute left-[180px] top-[160px]">
              <h2 className="text-[40px] font-semibold text-[#1C274C]">
                MapsGPT
              </h2>

              <p className="text-[26px] text-[#1C274C]/70 mt-4">
                use AI to find your next hang out
              </p>
            </div>

            {/* CTA */}
            <div className="absolute right-[200px] top-[170px]">
              <button className="px-10 py-4 bg-[#00AEEF] text-white text-[18px] rounded-full">
                Try it out now →
              </button>
            </div>

            {/* Map UI */}
            <div className="absolute left-[360px] top-[340px] w-[1010px] h-[620px] rounded-[20px] overflow-hidden shadow-xl">
              <Image
                src="/product/map-ui.png"
                alt="Maps UI"
                fill
                className="object-cover"
              />
            </div>

            {/* Left Feature Card */}
            <div className="absolute left-[180px] top-[360px] w-[240px] p-6 bg-[#CDE5F3] rounded-[20px]">
              <h4 className="text-[18px] font-semibold mb-4">
                Itineraries
              </h4>

              <p className="text-[14px] text-[#1C274C]/70 leading-[1.6]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>

              <div className="mt-6 space-y-3 text-[14px]">
                <div className="bg-white px-4 py-2 rounded-full">
                  Find spots
                </div>
                <div className="bg-white px-4 py-2 rounded-full">
                  Ask AI about spots
                </div>
                <div className="bg-white px-4 py-2 rounded-full">
                  Favorite your spots
                </div>
                <div className="bg-white px-4 py-2 rounded-full">
                  Roll the dice
                </div>
                <div className="bg-white px-4 py-2 rounded-full">
                  Mobile and Web
                </div>
              </div>
            </div>

            {/* Trusted */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[180px] text-center">
              <p className="text-[14px] text-[#1C274C]/50 mb-6">
                We work with data from the most reputable brands
              </p>

              <div className="flex gap-14 opacity-70">
                <Image src="/brands/google.png" width={120} height={40} alt="" />
                <Image src="/brands/foursquare.png" width={120} height={40} alt="" />
                <Image src="/brands/airbnb.png" width={120} height={40} alt="" />
                <Image src="/brands/idealista.png" width={120} height={40} alt="" />
                <Image src="/brands/tripadvisor.png" width={120} height={40} alt="" />
                <Image src="/brands/thefork.png" width={120} height={40} alt="" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}