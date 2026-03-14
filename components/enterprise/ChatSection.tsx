"use client";

export default function ChatSection() {
  return (
    <section className="w-full bg-white py-24 lg:py-[160px] flex flex-col items-center">

      {/* Heading */}
      <h2
        className="font-semibold text-center text-[28px] md:text-[36px] lg:text-[48px] leading-[140%]"
        style={{
          background: "linear-gradient(90deg, #9B9B9B 0%, #0A1344 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Chat with us now about Columbus Pro
      </h2>

      {/* Button */}
      <button
        className="
        mt-8
        w-[260px]
        md:w-[428px]
        h-[54px]
        border
        border-[#334EDF]/20
        rounded-[4px]
        text-[#0E1A44]
        font-medium
        text-[16px]
        flex
        items-center
        justify-center
        hover:bg-[#F8F8F8]
        transition
        cursor-pointer
      "
      >
        Get in touch
      </button>

    </section>
  );
}