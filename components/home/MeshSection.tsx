

"use client";

export const MeshSection = () => {
  return (
    <section className="bg-[#F9F9F9]">
      <div className="relative w-full h-[520px] overflow-hidden">

        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/mesh-animation.mp4" type="video/mp4" />
        </video>

      </div>
    </section>
  );
};