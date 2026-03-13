

"use client";

export const MeshSection = () => {
  return (
    <section className="bg-white border-0 border-none shadow-none ring-0 ring-offset-0">
      <div className="relative w-full h-[920px] overflow-hidden border-0 border-none shadow-none ring-0 ring-offset-0">

        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover border-0 border-none outline-none shadow-none ring-0 ring-offset-0"
        >
          <source src="/mesh-animation.mp4" type="video/mp4" />
        </video>

        <div
          className="absolute bottom-0 left-0 right-0 w-full h-[70px] pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, rgba(249, 249, 249, 0) 0%, rgba(251, 251, 251, 0.45) 25%, rgba(253, 253, 253, 0.83) 46%, rgba(254, 254, 254, 0.9) 52%, rgba(254, 254, 254, 0.94) 62%, rgba(254, 254, 254, 1) 100%)`,
          }}
          aria-hidden
        />
      </div>
    </section>
  );
};