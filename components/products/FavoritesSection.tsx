"use client";

import Image from "next/image";

export default function FavoritesSection() {
  return (
    <section className="bg-[#F5F5F5] w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-32">

        {/* ================= TOP HEADLINE ================= */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 text-center">
          
          <Image
            src="/how/light.png"
            alt=""
            width={120}
            height={100}
            className="w-20 sm:w-24 lg:w-32 h-auto"
          />

          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-semibold text-black leading-tight max-w-3xl">
            Let our AI find you 
            <br className="hidden sm:block" />
            the coolest place, faster.
          </h2>

          <Image
            src="/how/serach.png"
            alt=""
            width={120}
            height={100}
            className="w-20 sm:w-24 lg:w-32 h-auto"
          />
        </div>

        {/* ================= MIDDLE SECTION ================= */}
        <div className="mt-20 grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT TEXT */}
          <div>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight bg-gradient-to-r from-[#E11D48] to-[#C026D3] bg-clip-text text-transparent">
              Save your favorite spots,
              <br />
              share with your friends.
            </p>
          </div>

          {/* RIGHT CARD */}
          <div className="relative flex justify-center">
            <div className="w-full max-w-md h-[350px] sm:h-[450px] bg-white rounded-3xl shadow-xl flex items-center justify-center text-lg text-gray-400">
              Placeholder Card
            </div>

            <Image
              src="/how/heart.png"
              alt="Heart"
              width={160}
              height={120}
              className="absolute -top-10 -right-6 w-20 sm:w-28 lg:w-36 h-auto"
            />
          </div>
        </div>

        {/* ================= BOTTOM TEXT ================= */}
        <div className="mt-24 text-center max-w-3xl mx-auto">
          <p className="text-xl sm:text-2xl lg:text-4xl font-medium text-[#4B5563] leading-relaxed">
            MapsGPT remembers your preferences,
            <br />
            and continuously learns 
            <br/>
            your vibes.
          </p>
        </div>

      </div>
    </section>
  );
}