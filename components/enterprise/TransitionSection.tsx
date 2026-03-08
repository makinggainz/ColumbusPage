"use client";

export default function TransitionSection() {
  return (
    <section className="w-full bg-black flex items-center justify-center">

      <div className="w-full max-w-[1728px] h-[320px] md:h-[400px] lg:h-[473px] flex flex-col items-center justify-center text-center px-36">

        {/* Main Text */}
        <p
          className="
          text-white
          font-medium
          text-[24px]
          md:text-[30px]
          lg:text-[36px]
          leading-[140%]
          tracking-[-0.02em]
        "
        >
          We’ve simplified your GIS life.
        </p>

        {/* Secondary Text */}
        <p
          className="
          mt-4
          text-[#3EF37C]
          text-[14px]
          md:text-[16px]
          lg:text-[36px]
        "
        >
          Beginning → End sticky scroll
        </p>

      </div>

    </section>
  );
}