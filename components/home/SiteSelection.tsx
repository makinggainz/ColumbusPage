"use client";

import Image from "next/image";

export const SiteSelection = () => {
  return (
    <section className="bg-[#F9F9F9] py-16 sm:py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">

        <div className="rounded-[28px] bg-gradient-to-br from-[#1B2D5A] via-[#13214C] to-[#0B163B] p-8 sm:p-12 lg:p-16 relative overflow-hidden">

          {/* GRID LAYOUT */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT CONTENT */}
            <div className="text-white">

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-8">
                Site Selection Reimagined
              </h2>

              <ul className="space-y-4 text-base sm:text-lg text-white/85 list-disc pl-6 mb-10">
                <li>An end-to-end Site Selection tool.</li>
                <li>Generate new maps, in seconds.</li>
                <li>Find exclusive critical datasets for your decisions.</li>
                <li>Cheaper due diligence.</li>
              </ul>

              <p className="text-base sm:text-lg text-white/70 mb-8">
                Columbus turns you into a{" "}
                <span className="font-semibold text-white">
                  super-explorer.
                </span>
              </p>

              <button className="bg-white text-[#13214C] px-6 py-3 rounded-lg font-medium">
                Check it out →
              </button>
            </div>

            <div className="relative flex justify-center items-end">

              {/* DESKTOP IMAGE */}
              <div className="relative w-full max-w-[920px] aspect-[102/56] rounded-2xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.45)]">

                <Image
                  src="/Icon/desktop-ui.png"
                  alt="Desktop UI"
                  fill
                  className="object-cover"
                />

                {/* MOBILE IMAGE */}
                <div
                  className="
                    absolute
                    right-0
                    translate-x-1/5
                    top-0
                    h-full
                    aspect-[9/16]
                    rounded-[32px]
                    overflow-hidden
                    border-4
                    border-white
                    shadow-[0_40px_140px_rgba(0,0,0,0.55)]
                  "
                >
                  <Image
                    src="/Icon/mobile-ui.png"
                    alt="Mobile UI"
                    fill
                    className="object-cover"
                  />
                </div>

              </div>

            </div>

          </div>

          {/* Bottom glow */}
          <div className="absolute -bottom-20 -right-20 w-[250px] h-[250px] bg-purple-500/30 blur-[120px] rounded-full" />

        </div>
      </div>
    </section>
  );
};