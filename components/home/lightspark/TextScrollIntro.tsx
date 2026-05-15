"use client";

/**
 * "We're all about maps" intro — section heading that sits above the
 * BentoProducts grid. The scroll-driven word-reveal lede was removed
 * per the experimentV6-Gdesign redesign; only the heading + watermark
 * surface remain.
 */

export function TextScrollIntro() {
  return (
    <section className="section relative isolate">
      {/* Watermark layer — split out from the section's inline background
          so we can fade the top + bottom into the page surface (via
          mask-image) and dial the whole image down to 50% opacity
          without affecting the foreground text. */}
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
