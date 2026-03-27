"use client";

export default function ChatSection() {
  return (
    <section className="w-full py-24 lg:py-[160px] flex flex-col items-center" style={{ backgroundColor: "#F4F3EB" }}>

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
        type="button"
        className="group mt-8 flex items-center gap-3 leading-none whitespace-nowrap hover:opacity-90 transition-all duration-300 cursor-pointer"
        style={{ fontSize: 14, fontWeight: 500, height: 45, paddingLeft: 20, paddingRight: 16, backgroundColor: "#1D1D1F", color: "white" }}
      >
        <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Get in touch</span>
        <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 1l5 5-5 5" />
        </svg>
      </button>

    </section>
  );
}