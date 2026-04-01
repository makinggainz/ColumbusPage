"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Container } from "@/components/layout/Container";

// ─── Walking figure types ────────────────────────────────────────────────────

interface Figure {
  id: number;
  x: number;
  y: number;
  vy: number;
  speed: number;
  scale: number;
  phaseOff: number;
  opacity: number;
  state: "walking" | "jumping" | "paused" | "falling" | "getting-up" | "running-back" | "gone";
  jumpPhase: number;
  noteLabel: string;
  clickable: boolean;
  fallX: number;       // x position where fall is triggered
  stateTimer: number;  // frames spent in current state
}

// ─── Draw a mesh-wireframe stick figure ──────────────────────────────────────

function drawFigure(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  phase: number,
  scale: number,
  alpha: number,
  rotation: number,
  pivotX: number,
  pivotY: number,
  hovered: boolean,
) {
  const s = scale;
  ctx.save();
  ctx.translate(pivotX, pivotY);
  ctx.rotate(rotation);
  ctx.translate(x - pivotX, groundY - pivotY);

  const bob = Math.abs(Math.sin(phase * 2)) * 2 * s;
  ctx.translate(0, -bob);

  const headY = -52 * s;
  const neckY = -46 * s;
  const shY   = -42 * s;
  const waistY = -28 * s;
  const hipY  = -24 * s;

  const legSwing = Math.sin(phase) * 0.55;
  const uLeg = 13 * s, lLeg = 12 * s;
  const lKx = -4*s + Math.sin(legSwing) * uLeg;
  const lKy = hipY + Math.cos(legSwing) * uLeg;
  const lBend = Math.max(0, Math.sin(phase)) * 0.5;
  const lFx = lKx + Math.sin(legSwing + lBend) * lLeg;
  const lFy = lKy + Math.cos(legSwing + lBend) * lLeg;
  const rKx = 4*s + Math.sin(-legSwing) * uLeg;
  const rKy = hipY + Math.cos(-legSwing) * uLeg;
  const rBend = Math.max(0, Math.sin(phase + Math.PI)) * 0.5;
  const rFx = rKx + Math.sin(-legSwing + rBend) * lLeg;
  const rFy = rKy + Math.cos(-legSwing + rBend) * lLeg;

  const armSwing = Math.sin(phase + Math.PI) * 0.45;
  const uArm = 11 * s, lArm = 9 * s;
  const lEx = -8*s + Math.sin(armSwing) * uArm * 0.7;
  const lEy = shY + Math.cos(armSwing) * uArm;
  const lHx = lEx + Math.sin(armSwing * 0.5) * lArm * 0.5;
  const lHy = lEy + Math.cos(armSwing * 0.5) * lArm;
  const rEx = 8*s + Math.sin(-armSwing) * uArm * 0.7;
  const rEy = shY + Math.cos(-armSwing) * uArm;
  const rHx = rEx + Math.sin(-armSwing * 0.5) * lArm * 0.5;
  const rHy = rEy + Math.cos(-armSwing * 0.5) * lArm;

  const baseA = hovered ? 0.75 : 0.55;
  const col  = `rgba(20,60,160,${(alpha * baseA).toFixed(3)})`;
  const dcol = `rgba(20,60,160,${(alpha * (baseA - 0.1)).toFixed(3)})`;
  ctx.strokeStyle = col;
  ctx.lineWidth   = (hovered ? 1.3 : 0.9) * s;
  ctx.fillStyle   = dcol;

  const line = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  };
  const dot = (px: number, py: number, r = 1.5 * s) => {
    ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
  };

  ctx.beginPath(); ctx.arc(0, headY, 5 * s, 0, Math.PI * 2); ctx.stroke();
  dot(0, headY, 1.2 * s);

  line(0, neckY, 0, waistY);
  line(-8*s, shY, 8*s, shY);
  line(-5*s, hipY, 5*s, hipY);
  line(-6*s, shY, 5*s, hipY);
  line(6*s, shY, -5*s, hipY);
  line(-4*s, (shY + hipY) / 2, 4*s, (shY + hipY) / 2);

  line(-8*s, shY, lEx, lEy); line(lEx, lEy, lHx, lHy);
  line(8*s, shY, rEx, rEy);  line(rEx, rEy, rHx, rHy);
  line(-5*s, hipY, lKx, lKy); line(lKx, lKy, lFx, lFy);
  line(5*s, hipY, rKx, rKy);  line(rKx, rKy, rFx, rFy);

  for (const [px, py] of [
    [0, neckY], [-8*s, shY], [8*s, shY], [0, waistY], [-5*s, hipY], [5*s, hipY],
    [lKx, lKy], [rKx, rKy], [lFx, lFy], [rFx, rFy],
    [lEx, lEy], [rEx, rEy], [lHx, lHy], [rHx, rHy],
  ]) dot(px, py);

  ctx.restore();
}

// ─── Hit test ────────────────────────────────────────────────────────────────

function hitTest(fig: Figure, mx: number, my: number, groundY: number): boolean {
  const figCenterY = groundY + fig.y - 26 * fig.scale;
  const dx = mx - fig.x;
  const dy = my - figCenterY;
  return Math.sqrt(dx * dx + dy * dy) < 28 * fig.scale;
}

// ─── Component ───────────────────────────────────────────────────────────────

const CANVAS_H = 180;

export const Careers = ({ hideHeader, className = "" }: { hideHeader?: boolean; className?: string } = {}) => {
  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const figuresRef   = useRef<Figure[]>([]);
  const animRef      = useRef(0);
  const hoveredIdRef = useRef<number | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(false);
  const [note, setNote]     = useState<string | null>(null);

  const handleTextareaInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  // Spawn exactly 3 figures — tallest always gets "note from alex"
  const spawnFigures = useCallback(() => {
    if (figuresRef.current.some(f => f.state === "walking" || f.state === "paused")) return;

    const scales = [1.2, 0.9, 0.95];
    const labels = ["note from alex", "note 1", "note 2"];
    const indices = [0, 1, 2].sort(() => Math.random() - 0.5);

    const figs: Figure[] = indices.map((idx, i) => ({
      id: idx,
      x: -30 - i * 70 - Math.random() * 30,
      y: 0,
      vy: 0,
      speed: 1.0 + Math.random() * 0.6,
      scale: scales[idx],
      phaseOff: Math.random() * Math.PI * 2,
      opacity: 0,
      state: "walking" as const,
      jumpPhase: 0,
      noteLabel: labels[idx],
      clickable: true,
      fallX: 0,
      stateTimer: 0,
    }));

    // 4th figure: the clumsy one — slower, not clickable
    figs.push({
      id: 3,
      x: -50 - 3 * 70,
      y: 0,
      vy: 0,
      speed: 0.65,
      scale: 0.88,
      phaseOff: Math.random() * Math.PI * 2,
      opacity: 0,
      state: "walking",
      jumpPhase: 0,
      noteLabel: "",
      clickable: false,
      fallX: 0,
      stateTimer: 0,
    });

    figuresRef.current = figs;
    setNote(null);
    setActive(true);
  }, []);

  // Canvas mouse events
  const handleCanvasMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const groundY = CANVAS_H - 8;

    let found: number | null = null;
    for (const fig of figuresRef.current) {
      if (!fig.clickable) continue;
      if (fig.state !== "walking" && fig.state !== "paused") continue;
      if (hitTest(fig, mx, my, groundY)) { found = fig.id; break; }
    }
    hoveredIdRef.current = found;
    canvas.style.cursor = found !== null ? "pointer" : "default";
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const groundY = CANVAS_H - 8;

    for (const fig of figuresRef.current) {
      if (!fig.clickable) continue;
      if (fig.state !== "walking" && fig.state !== "paused") continue;
      if (hitTest(fig, mx, my, groundY)) {
        // Pause ALL clickable walking figures
        for (const f of figuresRef.current) {
          if (f.state === "walking") f.state = "paused";
        }
        setNote(fig.noteLabel);
        return;
      }
    }
  }, []);

  // Dismiss note → resume all
  const dismissNote = useCallback(() => {
    for (const f of figuresRef.current) {
      if (f.state === "paused") f.state = "walking";
    }
    setNote(null);
  }, []);

  // Animation loop
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const vw = window.innerWidth;
      canvas.width  = vw * dpr;
      canvas.height = CANVAS_H * dpr;
      canvas.style.width  = `${vw}px`;
      canvas.style.height = `${CANVAS_H}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const vw = canvas.width / dpr;
      const groundY = CANVAS_H - 8;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vw, CANVAS_H);

      let anyAlive = false;

      for (const fig of figuresRef.current) {
        if (fig.state === "gone") continue;
        anyAlive = true;

        const isHovered = hoveredIdRef.current === fig.id;

        if (fig.state === "walking") {
          const phase = fig.x * 0.09 + fig.phaseOff;
          fig.opacity = Math.min(1, fig.opacity + 0.025);
          fig.x += fig.speed;

          // Clumsy figure: trip and fall at ~25% of screen
          if (!fig.clickable && fig.fallX === 0 && fig.x > vw * 0.25) {
            fig.state = "falling";
            fig.fallX = fig.x;
            fig.stateTimer = 0;
          } else if (fig.clickable && fig.x > vw - 40) {
            fig.state = "jumping";
            fig.vy = -(8 + Math.random() * 4);
            fig.jumpPhase = phase;
          }

          drawFigure(ctx, fig.x, groundY + fig.y, phase, fig.scale, fig.opacity, 0, fig.x, groundY + fig.y, isHovered);

        } else if (fig.state === "paused") {
          const phase = fig.x * 0.09 + fig.phaseOff;
          drawFigure(ctx, fig.x, groundY + fig.y, phase, fig.scale, fig.opacity, 0, fig.x, groundY + fig.y, isHovered);

        } else if (fig.state === "jumping") {
          fig.vy += 0.35;
          fig.y += fig.vy;
          fig.x += fig.speed * 0.6;

          const airPhase = fig.jumpPhase + Math.PI * 0.25;
          const spin = Math.min(1, (fig.y / 120)) * 0.3;

          if (groundY + fig.y > CANVAS_H + 70) {
            fig.state = "gone";
          }

          drawFigure(ctx, fig.x, groundY + fig.y, airPhase, fig.scale, fig.opacity, spin, fig.x, groundY + fig.y, false);

        } else if (fig.state === "falling") {
          // Topple forward over ~40 frames
          fig.stateTimer++;
          const fallDuration = 40;
          const t = Math.min(1, fig.stateTimer / fallDuration);
          // Ease-out rotation: 0 → π/2 (face-plant)
          const rotation = t * t * (Math.PI / 2);
          // Slide forward slightly while falling
          fig.x += fig.speed * (1 - t) * 0.5;

          drawFigure(ctx, fig.x, groundY, fig.fallX * 0.09 + fig.phaseOff, fig.scale, fig.opacity, rotation, fig.x, groundY, false);

          if (fig.stateTimer >= fallDuration) {
            fig.state = "getting-up";
            fig.stateTimer = 0;
          }

        } else if (fig.state === "getting-up") {
          // Lie on ground briefly, then rotate back up over ~50 frames
          fig.stateTimer++;
          const pauseFrames = 30;  // lie there a moment
          const getUpFrames = 45;

          let rotation: number;
          if (fig.stateTimer < pauseFrames) {
            rotation = Math.PI / 2; // still on the ground
          } else {
            const t = Math.min(1, (fig.stateTimer - pauseFrames) / getUpFrames);
            // Ease-in: slowly at first, then quickly stand up
            rotation = (Math.PI / 2) * (1 - t * t);
          }

          drawFigure(ctx, fig.x, groundY, fig.fallX * 0.09 + fig.phaseOff, fig.scale, fig.opacity, rotation, fig.x, groundY, false);

          if (fig.stateTimer >= pauseFrames + getUpFrames) {
            fig.state = "running-back";
            fig.stateTimer = 0;
          }

        } else if (fig.state === "running-back") {
          // Run backwards (to the left) at faster speed, fading out
          fig.stateTimer++;
          const runSpeed = fig.speed * 2.5;
          fig.x -= runSpeed;
          fig.opacity = Math.max(0, fig.opacity - 0.012);

          // Walking animation but mirrored (negative phase progression)
          const phase = -fig.x * 0.12 + fig.phaseOff;

          // Draw flipped horizontally (facing left)
          ctx.save();
          ctx.translate(fig.x, 0);
          ctx.scale(-1, 1);
          drawFigure(ctx, 0, groundY, phase, fig.scale, fig.opacity, 0, 0, groundY, false);
          ctx.restore();

          if (fig.opacity <= 0 || fig.x < -60) {
            fig.state = "gone";
          }
        }
      }

      if (anyAlive) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        setActive(false);
        setNote(null);
      }
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return (
    <section className={`py-[115px] md:py-[147px] lg:py-[179px] ${className}`} style={{ background: "linear-gradient(to bottom, rgba(37, 99, 235, 0.04) 0%, #F9F9F9 100%)" }}>
      <Container>

        {/* TOP CENTER */}
        {!hideHeader && (
          <div className="text-center mb-36 md:mb-44">
            <h2
              className="font-medium tracking-[-0.02em] leading-[1.05] mb-5 text-[31px] md:text-[39px] lg:text-[49px]"
              style={{ color: "#1D1D1F" }}
            >
              Hiring{" "}
              <span
                style={{ color: "#2563EB", cursor: "default" }}
                onMouseEnter={() => {
                  if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
                  hoverTimerRef.current = setTimeout(spawnFigures, 5000);
                }}
                onMouseLeave={() => {
                  if (hoverTimerRef.current) { clearTimeout(hoverTimerRef.current); hoverTimerRef.current = null; }
                }}
                onClick={spawnFigures}
              >
                Humans.
              </span>
            </h2>
            <p className="text-[16px] md:text-[20px]" style={{ color: "rgba(29,29,31,0.45)", letterSpacing: "-0.015em", fontWeight: 400 }}>
              Our team is based in Washington DC and Madrid.
            </p>
            <div className="flex justify-center pt-16 pb-20 md:pt-20 md:pb-24">
              <WorldMapDots />
            </div>
          </div>
        )}

        {/* TITLE + DESCRIPTION */}
        {!hideHeader && (
          <div className="max-w-[1287px] mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start mb-6 md:mb-8">
              <h3
                className="font-medium tracking-[-0.02em] leading-[1.12] text-[25px] md:text-[31px] lg:text-[39px] text-center md:text-left"
                style={{ color: "#1D1D1F" }}
              >
                Careers &amp; investment queries
              </h3>

              <p className="text-center md:text-right text-[16px] md:text-[20px]" style={{ color: "rgba(29,29,31,0.45)", letterSpacing: "-0.015em", fontWeight: 400 }}>
                If you&apos;re excited about creating paradigm<br />
                shifts in physical world understanding.{" "}
                <span style={{ fontWeight: 600, color: "rgba(29,29,31,0.8)" }}>Join us now.</span>
              </p>
            </div>
          </div>
        )}

        {/* DIVIDER — straight line */}
        {!hideHeader && (
          <div className="max-w-[1287px] mx-auto mb-16 md:mb-20">
            <div style={{ height: 1, background: "rgba(29,29,31,0.18)" }} />
          </div>
        )}

        {/* FORM */}
        <div className="max-w-xl mx-auto">
          <form className="flex flex-col gap-2">
            {[
              { type: "text", placeholder: "Name", tag: "input" },
              { type: "text", placeholder: "Message", tag: "textarea" },
              { type: "email", placeholder: "Enter email", tag: "input" },
            ].map(({ type, placeholder, tag }) => (
              <label
                key={placeholder}
                className="block cursor-text border-b border-[rgba(29,29,31,0.18)] focus-within:border-[#7B6FE8] transition-colors duration-300"
                style={{ paddingTop: 20, paddingBottom: 20 }}
              >
                {tag === "textarea" ? (
                  <textarea
                    ref={textareaRef}
                    placeholder={placeholder}
                    rows={1}
                    onInput={handleTextareaInput}
                    className="w-full bg-transparent outline-none resize-none block placeholder-[rgba(29,29,31,0.35)] overflow-hidden"
                    style={{ fontSize: 16, color: "#1D1D1F", lineHeight: 1.6 }}
                  />
                ) : (
                  <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none block placeholder-[rgba(29,29,31,0.35)]"
                    style={{ fontSize: 16, color: "#1D1D1F", lineHeight: 1.6 }}
                  />
                )}
              </label>
            ))}
          </form>

          <p className="mt-3 text-right" style={{ fontSize: 13, color: "rgba(29,29,31,0.4)", letterSpacing: "-0.01em" }}>
            We accept interns.
          </p>

          <div className="mt-10">
            <button
              type="submit"
              className="group px-10 flex items-center justify-between hover:opacity-90 transition-opacity cursor-pointer"
              style={{ height: 56, backgroundColor: "#000000", width: "100%" }}
            >
              <span className="text-white text-[18px] lg:text-[20px] font-medium transition-colors duration-300 group-hover:text-[#2563EB]">Submit</span>
              <svg width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1l5 5-5 5" />
              </svg>
            </button>
          </div>
        </div>

      </Container>

      {/* Fixed viewport-bottom canvas for walking figures */}
      {active && (
        <canvas
          ref={canvasRef}
          onMouseMove={handleCanvasMove}
          onClick={handleCanvasClick}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            zIndex: 9999,
          }}
        />
      )}

      {/* Fullscreen note overlay (same style as footer bottle note) */}
      {note && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          onClick={dismissNote}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative max-w-lg w-full mx-6 p-10"
            style={{
              background: "#faf5eb",
              borderRadius: 4,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              border: "1px solid rgba(160,140,100,0.2)",
              animation: "noteAppear 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {note === "note from alex" && (
              <>
                <p className="text-[15px] text-[#8a7a5a] italic mb-5" style={{ fontFamily: "Georgia, serif" }}>
                  A note from Alexander - COO
                </p>
                <p className="text-[17px] text-[#3a3020] leading-relaxed mb-6" style={{ fontFamily: "Georgia, serif" }}>
                  Hey I&apos;m Alexander R.B., co-founder. You found one of my easter eggs. If you would like to reach out to me personally you can find me on my Instagram at{" "}
                  <a href="https://instagram.com/alexrb.1" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2563EB] transition-colors">alexrb.1</a>
                  {" "}or my LinkedIn at:{" "}
                  <a href="https://www.linkedin.com/in/alexander-ramirez-blonski-a96121150" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2563EB] transition-colors">Alexander Ramirez Blonski</a>
                </p>
                <p className="text-[17px] text-[#3a3020] leading-relaxed mb-8" style={{ fontFamily: "Georgia, serif" }}>
                  Enjoy your day ;)
                </p>
              </>
            )}
            {note === "note 1" && (
              <>
                <p className="text-[15px] text-[#8a7a5a] italic mb-5" style={{ fontFamily: "Georgia, serif" }}>
                  A note from Erick - CTO
                </p>
                <p className="text-[17px] text-[#3a3020] leading-relaxed mb-4" style={{ fontFamily: "Georgia, serif" }}>
                  Hey, I&apos;m Erick, Co-founder and CTO. My brain&apos;s responsible for all the innovative engineering behind the scenes!
                </p>
                <p className="text-[17px] text-[#3a3020] leading-relaxed mb-4" style={{ fontFamily: "Georgia, serif" }}>
                  Check out my LinkedIn here:{" "}
                  <a href="https://www.linkedin.com/in/erick-mollinedo-lara-889587224/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2563EB] transition-colors">Erick Mollinedo Lara</a>
                </p>
                <p className="text-[15px] text-[#8a7a5a] italic mb-8" style={{ fontFamily: "Georgia, serif" }}>
                  P.S. I did not write this, Alex did
                </p>
              </>
            )}
            {note === "note 2" && (
              <>
                <p className="text-[15px] text-[#8a7a5a] italic mb-5" style={{ fontFamily: "Georgia, serif" }}>
                  A note from David - CEO
                </p>
                <p className="text-[17px] text-[#3a3020] leading-relaxed mb-4" style={{ fontFamily: "Georgia, serif" }}>
                  Hey, I&apos;m David, Co-founder and CEO.
                </p>
                <p className="text-[17px] text-[#3a3020] leading-relaxed mb-4" style={{ fontFamily: "Georgia, serif" }}>
                  Check out my LinkedIn here:{" "}
                  <a href="https://www.linkedin.com/in/davidramirezblonski/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2563EB] transition-colors">David Ramirez Blonski</a>
                  , and my personal website here:{" "}
                  <a href="https://www.gdsteel.co" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2563EB] transition-colors">gdsteel.co</a>
                </p>
                <p className="text-[17px] text-[#3a3020] leading-relaxed mb-4" style={{ fontFamily: "Georgia, serif" }}>
                  Hope you have a beautiful day.
                </p>
                <p className="text-[15px] text-[#8a7a5a] italic mb-8" style={{ fontFamily: "Georgia, serif" }}>
                  P.S. I did not write this, Alex did
                </p>
              </>
            )}
            <button
              onClick={dismissNote}
              className="text-[13px] text-[#8a7a5a] hover:text-[#3a3020] transition-colors tracking-wide cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes noteAppear {
          0%   { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>
  );
};

/* ── World Map Dots Component (CSS3 Box-Shadow based) ── */

const WorldMapDots = () => {
  const dotConfig = [
    { child: 1, marginTop: 90, shadows: [] },
    { child: 2, marginTop: 40, shadows: [10, 20, 30] },
    { child: 3, marginTop: 40, shadows: [10, 20, 30, 40, 110] },
    { child: 4, marginTop: 40, shadows: [10, 20, 30] },
    { child: 5, marginTop: 40, shadows: [10, 20, 30] },
    { child: 6, marginTop: 50, shadows: [10, 20] },
    { child: 7, marginTop: 50, shadows: [10, 20, 30] },
    { child: 8, marginTop: 40, shadows: [10, 20, 30, 40, 50] },
    { child: 9, marginTop: 20, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
    { child: 10, marginTop: 20, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110] },
    { child: 11, marginTop: 20, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120] },
    { child: 12, marginTop: 10, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140] },
    { child: 13, marginTop: 10, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150] },
    { child: 14, marginTop: 10, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150] },
    { child: 15, marginTop: 0, shadows: [10, 20, 30, 40, 50, 60, 80, 90, 100, 110, 120, 130, 160, 170] },
    { child: 16, marginTop: 0, shadows: [10, 20, 30, 40, 50, 90, 100, 110, 120, 130, 170, 200] },
    { child: 17, marginTop: 0, shadows: [10, 20, 30, 40, 60, 70, 80, 90, 100, 110, 120, 130, 140, 180, 190, 200, 210, 220] },
    { child: 18, marginTop: 0, shadows: [10, 20, 40, 50, 60, 70, 80, 90, 100, 110, 120, 160, 170, 180, 190, 200, 210, 220, 230, 260, 270, 280] },
    { child: 19, marginTop: 0, shadows: [10, 20, 50, 60, 80, 90, 100, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290] },
    { child: 20, marginTop: 0, shadows: [10, 20, 80, 90, 100, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270] },
    { child: 21, marginTop: 0, shadows: [10, 20, 30, 40, 60, 180, 190, 200, 210, 220, 230, 240, 250, 260] },
    { child: 22, marginTop: 0, shadows: [10, 20, 30, 40, 50, 60, 70, 190, 200, 210, 220, 230, 240, 250] },
    { child: 23, marginTop: 0, shadows: [10, 20, 30, 40, 50, 60, 70, 200, 210, 220, 230, 240] },
    { child: 24, marginTop: 0, shadows: [10, 20, 30, 40, 50, 200, 210, 220] },
    { child: 25, marginTop: 0, shadows: [10, 20, 30, 40, 50] },
    { child: 26, marginTop: 0, shadows: [10, 20, 30, 40, 60] },
    { child: 27, marginTop: 10, shadows: [10, 50, 140, 150, 160] },
    { child: 28, marginTop: 90, shadows: [50, 60, 70, 80, 90] },
    { child: 29, marginTop: 80, shadows: [30, 40, 50, 60, 70, 80, 90, 100, 110] },
    { child: 30, marginTop: 80, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110] },
    { child: 31, marginTop: 70, shadows: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120] },
    { child: 32, marginTop: 60, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170] },
    { child: 33, marginTop: 40, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210] },
    { child: 34, marginTop: 40, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210] },
    { child: 35, marginTop: 40, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200] },
    { child: 36, marginTop: 40, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190] },
    { child: 37, marginTop: 60, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 150] },
    { child: 38, marginTop: 50, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 170, 180] },
    { child: 39, marginTop: 50, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110] },
    { child: 40, marginTop: 30, shadows: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130] },
    { child: 41, marginTop: 20, shadows: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130] },
    { child: 42, marginTop: 20, shadows: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130] },
    { child: 43, marginTop: 40, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140] },
    { child: 44, marginTop: 40, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130] },
    { child: 45, marginTop: 30, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130] },
    { child: 46, marginTop: 30, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130] },
    { child: 47, marginTop: 10, shadows: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180] },
    { child: 48, marginTop: 10, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190] },
    { child: 49, marginTop: 20, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 180, 190] },
    { child: 50, marginTop: 30, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 170, 210, 220, 230] },
    { child: 51, marginTop: 40, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 130, 160, 200, 210, 220] },
    { child: 52, marginTop: 40, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 90, 150, 190, 200, 210, 220] },
    { child: 53, marginTop: 40, shadows: [10, 20, 30, 40, 50, 60, 70, 80, 190, 200, 210, 220] },
    { child: 54, marginTop: 40, shadows: [10, 20, 30, 40, 50, 60, 70, 100, 170, 190, 200, 210, 220, 230] },
    { child: 55, marginTop: 40, shadows: [10, 20, 30, 40, 60, 70, 80, 90, 170, 190, 200, 210, 220, 230, 240] },
    { child: 56, marginTop: 40, shadows: [10, 20, 30, 40, 180, 200, 210, 220, 230] },
    { child: 57, marginTop: 50, shadows: [10, 20, 30, 40] },
    { child: 58, marginTop: 50, shadows: [10, 20, 30, 40] },
    { child: 59, marginTop: 50, shadows: [10, 20, 30, 240] },
    { child: 60, marginTop: 50, shadows: [10, 20, 30, 220, 230] },
    { child: 61, marginTop: 50, shadows: [10, 20] },
    { child: 62, marginTop: 60, shadows: [] },
    { child: 63, marginTop: 60, shadows: [] },
  ];

  const SPECIAL_DOTS: [number, number][] = [[18, 9], [30, 4]];

  const isSpecial = (child: number, idx: number) =>
    SPECIAL_DOTS.some(([c, i]) => c === child && i === idx);

  const shadowsToBoxShadow = (shadows: number[], child: number) => {
    return shadows
      .map((offset, idx) => {
        const color = isSpecial(child, idx) ? "#2563EB" : "#060606";
        return `0 ${offset}px 0 ${color}`;
      })
      .join(", ");
  };

  return (
    <div className="flex justify-center">
      <style jsx>{`
        @keyframes worldmap-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.6); }
          50% { box-shadow: 0 0 0 4px rgba(37, 99, 235, 0); }
        }
      `}</style>
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",
          flexWrap: "wrap",
          gap: "3px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {dotConfig.map(({ child, marginTop, shadows }) => {
          // Check if this column has a special dot — render pulse markers
          const specialIndices = SPECIAL_DOTS
            .filter(([c]) => c === child)
            .map(([, i]) => i);

          return (
            <div
              key={child}
              style={{
                position: "relative",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: "#060606",
                marginRight: "3px",
                marginTop: `${marginTop}px`,
                boxShadow: shadowsToBoxShadow(shadows, child),
              }}
            >
              {specialIndices.map((si) => (
                <span
                  key={si}
                  style={{
                    position: "absolute",
                    top: shadows[si],
                    left: 0,
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    backgroundColor: "#2563EB",
                    animation: "worldmap-pulse 2s ease-in-out infinite",
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
