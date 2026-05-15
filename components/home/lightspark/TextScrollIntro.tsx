"use client";

/**
 * "We're all about maps" intro — section heading sitting above the
 * BentoProducts grid, over a ColumbusBackgroundMB watermark (restored
 * from the original -Gdesign branch placement).
 */

export function TextScrollIntro() {
  return (
    <section className="section relative isolate">
      {/* Watermark — center-anchored, 120vw × 70vw so it bleeds past
          the section edges, 50% opacity, with a top + bottom linear
          mask so the image fades into the page surface above and
          below the heading. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: 'url("/ColumbusBackgroundMB.png")',
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "120vw 70vw",
          opacity: 0.5,
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
        }}
      />
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center h2 tracking-tight text-ink">
            We&rsquo;re all about maps
          </h2>
        </div>
      </div>
    </section>
  );
}

export default TextScrollIntro;
