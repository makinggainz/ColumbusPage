"use client";

import { useEffect, useRef } from "react";

/**
 * Hero section — minimal layout for the experimentV6-Gdesign redesign.
 *
 * Centred H1 ("The frontier research lab building geospatial reasoning
 * for the real world.") rendered with the project's `.h1` class
 * (Medium 500, 64px desktop / 40px ≤991px) — same typescale used on
 * every heading across the page.
 *
 * Background: at rest the hero renders exactly as the pre-redesign
 * version did — ColumbusBackgroundMB line-art at cover + a uniform
 * 0.55 white wash. A second, fully-hidden layer beneath it (the
 * section's background-image) holds the realisticHeroMinimalist
 * satellite map. On hover, a particle system spawns short-lived
 * "ink drops" along the cursor path — each drop drifts on its own
 * damped velocity, blooms through a fast-rise / slow-fall envelope,
 * and erodes the canvas-drawn line-art + wash via destination-out.
 * Many overlapping drops with randomized offsets, radii, and lives
 * accumulate into irregular, fluid-edged splash trails (much more
 * organic than a single radial brush). Cursor velocity drives drop
 * count, radius, and ejection speed so quick moves create wide,
 * energetic splashes while slow moves leave a subtle trickle.
 * Trails heal continuously via a destination-over re-paint at low
 * alpha, so the cover refills itself in ~1.5s once the cursor
 * moves on.
 */

const HN_CSS = `
.hn-section {
  position: relative;
  overflow: hidden;
  background-color: #FFFFFF;
  /* Bottom layer — hidden by default behind the fully-opaque canvas
     cover above; gets exposed in pockets as the cursor erodes the
     cover. */
  background-image: url('/realisticHeroMinimalist.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  /* The navbar is sticky (stays in document flow + occupies its own
     ~80px height). Pulling this section up by -80px makes the texture
     extend behind the navbar so the navbar reads as part of the hero.
     Section then spans the full viewport (y=0 → 100vh) with the
     navbar overlaying y=0..80. */
  margin-top: -80px;
  padding-top: 80px;
  padding-bottom: 0;
  color: #0B1B2B;
  font-family: var(--font-sans, "Ppneuemontreal", "PP Neue Montreal", Arial, sans-serif);
  min-height: 100vh;
  display: flex;
  align-items: center;
}

/* Canvas cover — renders the original line-art map + 0.55 white wash
   (matching the pre-redesign hero exactly). On hover, destination-out
   brushstrokes erode the canvas; destination-over re-paints at low
   alpha heal eroded pockets over time. No CSS blur is applied here
   so the line-art texture stays as crisp as the original CSS
   background-image — fluid edges come from the brush's long
   gradient falloff, not from blurring the layer. */
.hn-cover {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

/* Bottom fade — full white at the seam so the hero hands off cleanly
   into the next section. Sits above the canvas so eroded pockets at
   the bottom edge don't break the hand-off. */
.hn-section::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 65%,
    rgba(255, 255, 255, 0.55) 85%,
    rgba(255, 255, 255, 1) 100%
  );
  pointer-events: none;
  z-index: 2;
}

.hn-bounds {
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 1287px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  /* Lift the title 50px above the section's vertical centre. translateY
     is preferred over a negative margin so the flex centering math
     stays clean and adjacent siblings (none today, but future-proof)
     aren't dragged with it. */
  transform: translateY(-50px);
}

/* Font-size + line-height come from the .h1 class on the element
   (--typography--h1 = 64px ≥992 / 40px ≤991, single project cutoff). */
.hn-title {
  text-wrap: balance;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  max-width: 40rem;
}
@media (min-width: 992px) {
  .hn-title { max-width: 64rem; }
}
`;

export function HeroNew() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    // Offscreen canvas holds the "stable cover" — line-art + wash
    // composited once. Healing draws this single bitmap under existing
    // pixels at low alpha; using one composite means the layer order
    // (white → line-art → wash) stays correct as eroded pockets refill.
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

    const lineArt = new Image();
    let lineArtReady = false;

    // Particle system. Each "drop" is one short-lived ink splotch that
    // erodes the cover along its own arc. Many overlapping drops with
    // randomized offsets, radii, and lifecycles add up to irregular
    // fluid blobs — much more organic than a single radial brush.
    type Drop = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      intensity: number;
      age: number; // 0..1, advances by ageDelta each frame
      ageDelta: number;
    };
    const MAX_DROPS = 200;
    let drops: Drop[] = [];

    let raf = 0;
    let width = 0;
    let height = 0;
    let lastPt = { x: -9999, y: -9999, t: 0 };
    let hasPointer = false;

    const renderOffscreen = () => {
      offscreen.width = Math.max(1, Math.floor(width * dpr));
      offscreen.height = Math.max(1, Math.floor(height * dpr));
      offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      offCtx.globalCompositeOperation = "source-over";
      offCtx.globalAlpha = 1;
      offCtx.fillStyle = "#FFFFFF";
      offCtx.fillRect(0, 0, width, height);
      if (lineArtReady) {
        // Emulate CSS background-size: cover — fit the image to the
        // canvas, cropping the longer dimension.
        const imgW = lineArt.naturalWidth;
        const imgH = lineArt.naturalHeight;
        const imgAspect = imgW / imgH;
        const boxAspect = width / height;
        let drawW: number;
        let drawH: number;
        let drawX: number;
        let drawY: number;
        if (imgAspect > boxAspect) {
          drawH = height;
          drawW = height * imgAspect;
          drawX = (width - drawW) / 2;
          drawY = 0;
        } else {
          drawW = width;
          drawH = width / imgAspect;
          drawX = 0;
          drawY = (height - drawH) / 2;
        }
        offCtx.drawImage(lineArt, drawX, drawY, drawW, drawH);
      }
      // 0.55 white wash on top — matches the prior hero's ::before.
      offCtx.fillStyle = "rgba(255, 255, 255, 0.55)";
      offCtx.fillRect(0, 0, width, height);
    };

    const fullRepaint = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(offscreen, 0, 0, width, height);
    };

    const resize = () => {
      const rect = section.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderOffscreen();
      fullRepaint();
    };

    lineArt.onload = () => {
      lineArtReady = true;
      renderOffscreen();
      fullRepaint();
    };
    lineArt.src = "/ColumbusBackgroundMB.png";

    // Spawn drops along a path from (ax,ay) to (bx,by). `speed` is
    // px/ms — used to scale drop count, radius, splash offset, and
    // ejection velocity so fast cursor moves create wider, denser,
    // more energetic splashes (slow moves leave a subtle trickle).
    const spawnDropsAlong = (
      ax: number,
      ay: number,
      bx: number,
      by: number,
      speed: number,
    ) => {
      const dx = bx - ax;
      const dy = by - ay;
      const dist = Math.hypot(dx, dy);
      const steps = Math.max(1, Math.ceil(dist / 8));
      const perStep = Math.max(1, Math.min(3, Math.round(1 + speed * 1.4)));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const cx = ax + dx * t;
        const cy = ay + dy * t;
        for (let j = 0; j < perStep; j++) {
          const angle = Math.random() * Math.PI * 2;
          const offset = Math.random() * (14 + speed * 22);
          drops.push({
            x: cx + Math.cos(angle) * offset,
            y: cy + Math.sin(angle) * offset,
            // Drift = a bit of cursor direction + an outward radial
            // ejection. Damped each frame so drops settle rather than
            // fly away forever.
            vx: (dx / steps) * 0.18 + Math.cos(angle) * (0.35 + speed * 0.55),
            vy: (dy / steps) * 0.18 + Math.sin(angle) * (0.35 + speed * 0.55),
            r: 65 + Math.random() * 55 + speed * 55,
            intensity: 0.30 + Math.random() * 0.22,
            age: 0,
            // ~1.1–1.6s life at 60fps.
            ageDelta: 0.010 + Math.random() * 0.0065,
          });
        }
      }
      if (drops.length > MAX_DROPS) {
        drops.splice(0, drops.length - MAX_DROPS);
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Listener is on window so it fires anywhere on the page; ignore
      // the event unless the cursor is inside the hero's vertical
      // bounds, otherwise the cover erodes from cursor activity
      // happening elsewhere on the page.
      if (y < 0 || y > rect.height) {
        hasPointer = false;
        return;
      }
      const now = performance.now();
      if (!hasPointer) {
        lastPt = { x, y, t: now };
        hasPointer = true;
        return;
      }
      const dt = Math.max(1, now - lastPt.t);
      const dist = Math.hypot(x - lastPt.x, y - lastPt.y);
      // Cap speed so a teleport (e.g. window refocus) doesn't trigger
      // a screen-wide splash.
      const speed = Math.min(2.5, dist / dt);
      spawnDropsAlong(lastPt.x, lastPt.y, x, y, speed);
      lastPt = { x, y, t: now };
    };

    const onLeave = () => {
      hasPointer = false;
    };

    const tick = () => {
      // Heal: draw the stable cover under existing pixels at low
      // alpha. Eroded pockets refill from below; intact (alpha=1)
      // areas are unchanged because destination-over only fills where
      // the destination is transparent. ~0.035 → ~1.2s recovery from
      // fully cleared back to ~96% opacity.
      ctx.globalCompositeOperation = "destination-over";
      ctx.globalAlpha = 0.035;
      ctx.drawImage(offscreen, 0, 0, width, height);
      ctx.globalAlpha = 1;

      // Render every live drop. Each one updates its own position +
      // velocity (damped), advances its age, and erodes the cover
      // with a soft radial gradient. The bloom envelope (fast rise,
      // slow fall) makes each drop look like an ink splotch
      // spreading then fading. Overlapping drops with varied radii
      // and offsets accumulate into irregular fluid blobs.
      ctx.globalCompositeOperation = "destination-out";
      for (let k = 0; k < drops.length; k++) {
        const d = drops[k];
        d.x += d.vx;
        d.y += d.vy;
        d.vx *= 0.92;
        d.vy *= 0.92;
        d.age += d.ageDelta;
        if (d.age >= 1) continue;

        let env: number;
        if (d.age < 0.18) env = d.age / 0.18; // fast rise
        else env = 1 - (d.age - 0.18) / 0.82; // slow fall
        env = Math.max(0, env);
        const a = d.intensity * env;
        if (a < 0.005) continue;

        // Radius spreads ~25% over the drop's lifetime (ink expanding).
        const r = d.r * (1 + d.age * 0.25);
        const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, r);
        grad.addColorStop(0, `rgba(0, 0, 0, ${a})`);
        grad.addColorStop(0.32, `rgba(0, 0, 0, ${a * 0.7})`);
        grad.addColorStop(0.65, `rgba(0, 0, 0, ${a * 0.25})`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      drops = drops.filter((d) => d.age < 1);

      raf = requestAnimationFrame(tick);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);

    if (!reduceMotion) {
      window.addEventListener("mousemove", onMove);
      section.addEventListener("mouseleave", onLeave);
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hn-section"
      aria-label="Columbus hero"
      data-hero-section
    >
      <style>{HN_CSS}</style>
      <canvas ref={canvasRef} className="hn-cover" aria-hidden="true" />
      <div className="hn-bounds">
        <h1 className="h1 hn-title tracking-tight text-ink">
          The frontier research lab building geospatial reasoning for the real world.
        </h1>
      </div>
    </section>
  );
}

export default HeroNew;
