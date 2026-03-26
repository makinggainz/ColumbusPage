"use client";

import { Container } from "@/components/layout/Container";

export const Careers = () => {
  return (
    <section className="py-[115px] md:py-[147px] lg:py-[179px]" style={{ backgroundColor: "rgba(37, 99, 235, 0.04)" }}>
      <Container>

        {/* TOP CENTER */}
        <div className="text-center mb-36 md:mb-44">
          <h2
            className="font-medium tracking-[-0.02em] leading-[1.05] mb-5"
            style={{ fontSize: 56, color: "#1D1D1F" }}
          >
            Hiring{" "}
            <span style={{ color: "#2563EB" }}>Humans.</span>
          </h2>
          <p style={{ fontSize: 20, color: "rgba(29,29,31,0.45)", letterSpacing: "-0.015em", fontWeight: 400 }}>
            Our team is based in Washington DC and Madrid.
          </p>
        </div>

        {/* TITLE + DESCRIPTION */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start mb-6 md:mb-8">
          <h3
            className="font-semibold tracking-[-0.02em] leading-[1.12]"
            style={{ fontSize: 36, color: "#1D1D1F" }}
          >
            Careers &amp; investment queries
          </h3>

          <p className="md:text-right" style={{ fontSize: 20, color: "rgba(29,29,31,0.45)", letterSpacing: "-0.015em", fontWeight: 400 }}>
            If you&apos;re excited about creating paradigm shifts in physical world understanding.{" "}
            <span style={{ fontWeight: 600, color: "rgba(29,29,31,0.8)" }}>Join us now.</span>
          </p>
        </div>

        {/* DIVIDER */}
        <div
          className="h-px mb-16 md:mb-20 -ml-7.5 w-[calc(100%+60px)]"
          style={{
            background: "linear-gradient(to right, rgba(37,99,235,0.5) 0%, rgba(37,99,235,0.25) 20%, rgba(37,99,235,0.04) 45%, rgba(37,99,235,0.04) 55%, rgba(37,99,235,0.25) 80%, rgba(37,99,235,0.5) 100%)",
          }}
          aria-hidden
        />

        {/* FORM */}
        <div className="max-w-xl mx-auto">

          <form className="flex flex-col gap-10">
            {[
              { type: "text", placeholder: "Name", tag: "input" },
              { type: "text", placeholder: "Message", tag: "textarea" },
              { type: "email", placeholder: "Enter email", tag: "input" },
            ].map(({ type, placeholder, tag }) =>
              tag === "textarea" ? (
                <textarea
                  key={placeholder}
                  placeholder={placeholder}
                  rows={1}
                  className="w-full bg-transparent outline-none resize-none block"
                  style={{
                    borderBottom: "1px solid rgba(29,29,31,0.18)",
                    fontSize: 16,
                    color: "#1D1D1F",
                    paddingBottom: 12,
                    lineHeight: 1.5,
                  }}
                />
              ) : (
                <input
                  key={placeholder}
                  type={type}
                  placeholder={placeholder}
                  className="w-full bg-transparent outline-none block"
                  style={{
                    borderBottom: "1px solid rgba(29,29,31,0.18)",
                    fontSize: 16,
                    color: "#1D1D1F",
                    paddingBottom: 12,
                    lineHeight: 1.5,
                  }}
                />
              )
            )}
          </form>

          <p className="mt-3 text-right" style={{ fontSize: 13, color: "rgba(29,29,31,0.4)", letterSpacing: "-0.01em" }}>
            We accept interns.
          </p>

          <div className="mt-10">
            <button
              type="submit"
              className="px-10 flex items-center justify-between hover:opacity-90 transition-opacity"
              style={{ height: 56, backgroundColor: "#000000", width: "100%" }}
            >
              <span className="text-white font-medium" style={{ fontSize: 20 }}>Submit</span>
              <svg width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1l5 5-5 5" />
              </svg>
            </button>
          </div>

        </div>

      </Container>
    </section>
  );
};
