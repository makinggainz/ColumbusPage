"use client";

import Image from "next/image";
import { Container } from "@/components/layout/Container";

export const TrustStrip = () => {
  const faqs = [
    "How were the samples in the video and website generated?",
    "How does dialogue generation work?",
    "Is this available over API?",
    "What audio tags are supported?",
    "What languages does it support?",
  ];

  return (
    <section className="bg-[#F9F9F9] pt-2.5 pb-7.5 md:pb-15.5 lg:pb-19.5">
      <Container>

        {/* HEADING */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-[40px] font-semibold tracking-[-0.02em] mb-1.25 bg-linear-to-r from-[#313131] to-[#4ECDD6] bg-clip-text text-transparent">
            Your plans are in good hands
          </h2>

          <p className="font-light text-black" style={{ fontSize: "20px", letterSpacing: "-0.03em" }}>
            We work with data from reputable brands
          </p>
        </div>

        {/* LOGOS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center mb-[52.5px] opacity-80">
          <Logo src="/MapsGPTLogos/Logo1.png" />
          <Logo src="/MapsGPTLogos/Logo2.png" />
          <Logo src="/MapsGPTLogos/Logo3.png" />
          <Logo src="/MapsGPTLogos/Logo4.png" />
          <Logo src="/MapsGPTLogos/Logo5.png" />
          <Logo src="/MapsGPTLogos/Logo6.png" />
        </div>

        {/* FAQ TITLE */}
        <div className="mb-6">
          <h3 className="text-[30px] font-medium tracking-[-0.04em] text-[#1FA7A3]">
            See what people are asking
          </h3>
        </div>

        {/* FAQ LIST */}
        <div className="space-y-6">
          {faqs.map((question, index) => (
            <div
              key={index}
              className="pb-4 border-b border-dashed border-[#DADADA]"
            >
              <p className="text-sm sm:text-base text-[#1C274C]/85">
                {question}
              </p>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
};

const Logo = ({ src }: { src: string }) => (
  <div className="flex justify-center">
    <Image
      src={src}
      alt=""
      width={105}
      height={30}
      className="object-contain h-6 sm:h-7.5 md:h-9 w-auto"
    />
  </div>
);