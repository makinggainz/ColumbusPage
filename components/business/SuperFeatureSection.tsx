"use client";

import Image from "next/image";

/* ── Super-feature section ──────────────────────────────────────────────────
   One "super feature" on an #F7F7F7 band. Header: small icon, title, and a
   two-line subtitle (the inline accent text is the only colour spot). Below
   it, a sky-backdrop frame holds the main product demo. Beneath that, the
   sub-features stack as alternating rows — text column on one side, a
   matching sky-backdrop card with a floating mockup on the other. */

export type SuperFeatureSubItem = {
  title: string;
  description: React.ReactNode;
  /* Optional DOM id applied to the sub-feature's row wrapper, so the
     floating BusinessFeatureIndex (and any in-page anchor links) can target
     a specific sub-feature directly without needing its own SuperFeature. */
  id?: string;
  /* Either pass `image` (rendered inside a default floating card) or
     `visual` (rendered raw — bring your own card / chrome). */
  image?: string;
  imageAlt?: string;
  visual?: React.ReactNode;
  /* Per-row override of the shared sky backdrop (e.g. a map image). */
  backdropImage?: string;
  /* Per-row CSS `background-position` for the SkyBackdrop image — e.g.
     "center 35%" to shift the visible slice of a tall photo onto the
     skyline. Falls back to SkyBackdrop's default "center". */
  backdropPosition?: string;
  /* Per-row override of the visual frame's aspect ratio. The default is
     "1 / 1" (square); pass e.g. "4 / 5" for a row whose card is taller
     than wide and would otherwise be clipped by the square frame. */
  visualAspectRatio?: string;
  /* When the frame is taller than the default square (via
     `visualAspectRatio`), `background-size: cover` zooms the SkyBackdrop
     image in to fill the new height — which makes the photo look stretched
     even though it's only cropped. Set this to true to lock the backdrop
     image to a 1:1 wrapper anchored to the top of the frame, so the image
     keeps the same look it had at the default aspect. The strip below the
     image is transparent and blends with the surrounding panel. */
  lockBackdropToSquare?: boolean;
  /* Opt out of the side-by-side 4/8 grid + 1:1 square frame and render the
     `visual` across the full sub-features content width with no automatic
     header/text column. The `visual` then owns its own heading, subtitle,
     internal layout, and backdrop. When `stacked` is true, `description`,
     `image`, `imageAlt`, and `backdropImage` are ignored. */
  stacked?: boolean;
};

export type SuperFeatureSectionProps = {
  id?: string;
  icon?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  /* Background image shared by the main frame and sub-feature cards. */
  backgroundImage: string;
  /* CSS background-position for the main frame's backdrop. Defaults to
     "center" so existing sections are unchanged. */
  backgroundPosition?: string;
  /* CSS background-size for the main frame's backdrop. Defaults to
     "cover". Override to zoom into a region of the photo — e.g.
     "auto 400%" pairs with `backgroundPosition: "center top"` to show
     only the very top slice of a tall image. */
  backgroundSize?: string;
  /* Optional override applied to every sub-feature card's backdrop. Each
     sub-feature may still override this individually via its own
     `backdropImage`. Falls back to `backgroundImage` when omitted. */
  subFeatureBackdrop?: string;
  /* Provide one of `demoImage` (rendered through FloatingMockup) or
     `demoVisual` (a React node rendered raw inside the framed block).
     When both are present, `demoVisual` wins. */
  demoImage?: string;
  demoAlt?: string;
  demoVisual?: React.ReactNode;
  subFeatures?: SuperFeatureSubItem[];
  /* When false, the surrounding #F7F7F7 panel is dropped and the hero
     block + sub-features render directly on the page background. Sections
     that already supply their own framing (e.g. a card mockup) use this
     to avoid a double-frame. Defaults to true to preserve existing
     sections' visuals. */
  panel?: boolean;
  /* When false, the dark legibility scrim that SkyBackdrop paints over
     photographic background images is dropped, so the image renders at
     its true brightness. Defaults to true so existing sections keep
     their current appearance. */
  scrim?: boolean;
};

export default function SuperFeatureSection({
  id,
  icon,
  title,
  subtitle,
  backgroundImage,
  backgroundPosition = "center",
  backgroundSize = "cover",
  subFeatureBackdrop,
  demoImage,
  demoAlt = "",
  demoVisual,
  subFeatures = [],
  panel = true,
  scrim = true,
}: SuperFeatureSectionProps) {
  return (
    <section
      id={id}
      className="relative w-full"
      style={{
        paddingTop: "var(--ent-section-lg)",
        paddingBottom: "var(--ent-section-lg)",
      }}
    >
      {/* Header — sits OUTSIDE the gray panel, on the page background */}
      <div className="ent-content-bounds">
        <div className="flex flex-col items-center text-center px-6">
          {icon ? (
            <div className="mb-5 flex items-center justify-center">{icon}</div>
          ) : null}
          <h2
            className="leading-[1.1] text-[28px] md:text-[36px] lg:text-[42px]"
            style={{
              color: "var(--ent-text-primary)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              maxWidth: 760,
            }}
          >
            {title}
          </h2>
          {subtitle ? (
            <div
              className="mt-3 max-w-150 text-[15px] md:text-[16px] leading-[1.55]"
              style={{ color: "var(--ent-text-secondary)", letterSpacing: "-0.005em" }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>

      {/* Gray panel — capped to content bounds with rounded corners. The
          main demo block runs flush to the panel's edges (no horizontal
          padding on the panel itself); sub-features below set their own
          horizontal padding so they stay readable. When `panel` is false,
          the panel chrome (background, radius, overflow clipping) is
          dropped so content sits directly on the page background. */}
      <div
        className="ent-content-bounds mt-10 lg:mt-14"
        style={{
          backgroundColor: panel ? "#F7F7F7" : "transparent",
          borderRadius: panel ? "var(--ent-radius-2xl)" : "0",
          paddingBottom: panel ? "var(--ent-space-16)" : "0",
          overflow: panel ? "hidden" : "visible",
        }}
      >
        {/* Main framed block — sky backdrop + product demo, fills the
            panel's full width (no inset). */}
        <div
          className="relative overflow-hidden"
          style={{ borderRadius: "var(--ent-radius-2xl)" }}
        >
          <SkyBackdrop image={backgroundImage} scrim={scrim} position={backgroundPosition} size={backgroundSize} />
          <div className="relative z-10 flex justify-center" style={{ padding: "clamp(20px, 3vw, 40px)" }}>
            {demoVisual ? (
              demoVisual
            ) : demoImage ? (
              <FloatingMockup src={demoImage} alt={demoAlt} aspectRatio="16 / 9" maxWidth={1180} />
            ) : null}
          </div>
        </div>

        {/* Sub-features — alternating text/visual rows */}
        {subFeatures.length > 0 ? (
          <div
            className="mt-20 lg:mt-32 flex flex-col gap-20 lg:gap-32"
            style={{
              paddingLeft: "clamp(20px, 3vw, 40px)",
              paddingRight: "clamp(20px, 3vw, 40px)",
            }}
          >
            {subFeatures.map((item, i) => {
              const reversed = i % 2 === 1;
              if (item.stacked) {
                /* Full-width row — the visual owns its header, subtitle,
                   and backdrop. No 4/8 grid, no 1:1 square frame, no
                   SkyBackdrop. */
                return (
                  <div key={item.title} id={item.id} className="w-full">
                    {item.visual}
                  </div>
                );
              }
              return (
                <div
                  key={item.title}
                  id={item.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                >
                  <div className={`lg:col-span-4 px-6 lg:px-0 ${reversed ? "lg:order-2 lg:pl-8" : "lg:pr-8"}`}>
                    <h3
                      className="text-[24px] md:text-[30px] lg:text-[36px] leading-[1.1]"
                      style={{ color: "var(--ent-text-primary)", fontWeight: 600, letterSpacing: "-0.02em" }}
                    >
                      {item.title}
                    </h3>
                    <div
                      className="mt-4 text-[14px] md:text-[15px] leading-[1.6]"
                      style={{ color: "var(--ent-text-secondary)", letterSpacing: "-0.005em" }}
                    >
                      {item.description}
                    </div>
                  </div>
                  <div
                    className={`lg:col-span-8 relative overflow-hidden ${reversed ? "lg:order-1" : ""}`}
                    style={{
                      borderRadius: "var(--ent-radius-2xl)",
                      aspectRatio: item.visualAspectRatio ?? "1 / 1",
                    }}
                  >
                    <SkyBackdrop
                      image={item.backdropImage ?? subFeatureBackdrop ?? backgroundImage}
                      lockToSquare={item.lockBackdropToSquare}
                      position={item.backdropPosition}
                    />
                    <div
                      className="relative z-10 w-full h-full flex items-center justify-center"
                      style={{ padding: "clamp(24px, 3vw, 56px)" }}
                    >
                      {item.visual ? (
                        item.visual
                      ) : item.image ? (
                        <div
                          style={{
                            maxWidth: "78%",
                            width: "100%",
                            borderRadius: "var(--ent-radius-2xl)",
                            overflow: "hidden",
                            boxShadow: SUPER_FLOATING_BOX_SHADOW,
                          }}
                        >
                          <Image
                            src={item.image}
                            alt={item.imageAlt ?? item.title}
                            width={900}
                            height={650}
                            sizes="(max-width: 1024px) 90vw, 600px"
                            className="block w-full h-auto"
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* Backdrop. Accepts either a photo path (rendered via `url(...)`) or a raw
   CSS gradient string (e.g. `linear-gradient(...)`) — detected by the
   presence of `gradient(` in the value. Photos get a subtle top-down scrim
   for legibility; gradients self-control lightness and skip the scrim.
   Callers can also force the scrim off via `scrim={false}` when they want
   the photo at its true brightness (e.g. when no white UI is overlaid). */
function SkyBackdrop({
  image,
  scrim = true,
  lockToSquare = false,
  position = "center",
  size = "cover",
}: {
  image: string;
  scrim?: boolean;
  lockToSquare?: boolean;
  position?: string;
  size?: string;
}) {
  const isGradient = image.includes("gradient(");
  /* When `lockToSquare` is set, the image + scrim render inside a 1:1
     wrapper pinned to the top of the frame instead of filling it. Any
     extra height of the frame (taller-than-square rows) is left
     transparent so it blends into the surrounding panel — the photo
     keeps the exact framing it had at 1:1. */
  const imageLayer = (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: isGradient ? image : `url(${image})`,
        backgroundPosition: position,
        backgroundSize: size,
        backgroundRepeat: "no-repeat",
        zIndex: 0,
      }}
      aria-hidden
    />
  );
  const scrimLayer =
    isGradient || !scrim ? null : (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          /* Flat 35% black scrim — uniform across the image rather
             than a top-down gradient. Tuned for enough contrast on
             light photos without darkening the bottom of the frame
             unevenly. */
          background: "rgba(0,0,0,0.35)",
          zIndex: 0,
        }}
        aria-hidden
      />
    );

  if (lockToSquare) {
    return (
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden"
        style={{ aspectRatio: "1 / 1", zIndex: 0 }}
        aria-hidden
      >
        {imageLayer}
        {scrimLayer}
      </div>
    );
  }
  return (
    <>
      {imageLayer}
      {scrimLayer}
    </>
  );
}

function FloatingMockup({
  src,
  alt,
  aspectRatio,
  maxWidth,
}: {
  src: string;
  alt: string;
  aspectRatio: string;
  maxWidth: number;
}) {
  return (
    <div
      className="mx-auto"
      style={{
        width: "100%",
        maxWidth,
        borderRadius: "var(--ent-radius-2xl)",
        overflow: "hidden",
        boxShadow: SUPER_FLOATING_BOX_SHADOW,
      }}
    >
      <div style={{ position: "relative", width: "100%", aspectRatio }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`}
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}

/* Heavy multi-layer shadow recipe used for content floating over the
   photographic SkyBackdrop. A close, dark layer grounds the card to its
   immediate surroundings; the wider, softer layers carry the halo that
   reads at distance. Tuned to ground white UI mockups over busy imagery
   without needing a scrim. */
const SUPER_FLOATING_BOX_SHADOW =
  "0 1px 2px rgba(0,0,0,0.10), 0 6px 14px rgba(0,0,0,0.10), 0 28px 56px rgba(0,0,0,0.22), 0 56px 96px rgba(0,0,0,0.18)";

