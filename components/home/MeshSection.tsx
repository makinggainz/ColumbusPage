

"use client";

import Image from "next/image";

export const MeshSection = () => {
  return (
    <section className="bg-[#F9F9F9]">
      <div className="relative w-full h-[240px] sm:h-[320px] md:h-[420px] lg:h-[520px] overflow-hidden">
        <Image
          src="/images/Background_image ColLanding.png"
          alt="Columbus landing grid background"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/mesh-animation.mov" type="video/quicktime" />
        </video> */}
      </div>
    </section>
  );
};