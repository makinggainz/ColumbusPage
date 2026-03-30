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

        {/* DIVIDER — animated wave */}
        {!hideHeader && (
          <div
            className="mb-16 md:mb-20 -ml-7.5 w-[calc(100%+60px)] overflow-hidden"
            style={{ height: 8 }}
            aria-hidden
          >
            <svg
              viewBox="0 0 1200 8"
              preserveAspectRatio="none"
              className="w-[200%] h-full"
              style={{ animation: "wave-flow 8s linear infinite" }}
            >
              <defs>
                <linearGradient id="wave-grad" x1="0%" y1="0" x2="100%" y2="0">
                  <stop offset="0%"  stopColor="rgb(37,99,235)" stopOpacity="0.5" />
                  <stop offset="10%" stopColor="rgb(37,99,235)" stopOpacity="0.25" />
                  <stop offset="22%" stopColor="rgb(37,99,235)" stopOpacity="0.04" />
                  <stop offset="28%" stopColor="rgb(37,99,235)" stopOpacity="0.04" />
                  <stop offset="40%" stopColor="rgb(37,99,235)" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="rgb(37,99,235)" stopOpacity="0.5" />
                  <stop offset="60%" stopColor="rgb(37,99,235)" stopOpacity="0.25" />
                  <stop offset="72%" stopColor="rgb(37,99,235)" stopOpacity="0.04" />
                  <stop offset="78%" stopColor="rgb(37,99,235)" stopOpacity="0.04" />
                  <stop offset="90%" stopColor="rgb(37,99,235)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="rgb(37,99,235)" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <path
                d="M0,4 C25,1 50,1 75,4 C100,7 125,7 150,4 C175,1 200,1 225,4 C250,7 275,7 300,4 C325,1 350,1 375,4 C400,7 425,7 450,4 C475,1 500,1 525,4 C550,7 575,7 600,4 C625,1 650,1 675,4 C700,7 725,7 750,4 C775,1 800,1 825,4 C850,7 875,7 900,4 C925,1 950,1 975,4 C1000,7 1025,7 1050,4 C1075,1 1100,1 1125,4 C1150,7 1175,7 1200,4"
                fill="none"
                stroke="url(#wave-grad)"
                strokeWidth="1.5"
              />
            </svg>
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
