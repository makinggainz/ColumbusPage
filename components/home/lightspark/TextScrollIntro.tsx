"use client";

import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

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
          below the heading. The image source is now an <Image> child
          (was a CSS background-image of a 948 KB PNG) so the optimizer
          can ship an AVIF/WebP variant; mask + opacity stay on the
          outer wrapper so the visual treatment is identical. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
        style={{
          opacity: 0.5,
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
        }}
      >
        {/* Sized + centred to match the original
            `background-size: 120vw 70vw; background-position: center`. */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "120vw",
            height: "70vw",
          }}
        >
          <ImageWithFallback
            src="/ColumbusBackgroundMB.png"
            alt=""
            fill
            sizes="120vw"
            quality={75}
            style={{ objectFit: "fill" }}
          />
        </div>
      </div>
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
