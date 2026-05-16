"use client";

/**
 * Hiring Humans — centred section heading, hairline-divided intro
 * (heading left / paragraph right at md+), and a centred form with
 * bottom-border inputs. Mirrors the visual language used elsewhere
 * on the homepage (BentoProducts, BlogSection, CtaBanner, Mission/
 * TextScrollIntro): centred layout, hairline borders, no drop
 * shadows, 7px-corner CTA.
 *
 * All copy preserved verbatim ("Hiring Humans.", "Our team is based
 * in Washington DC and Madrid.", "Careers & investment queries",
 * the paragraph copy, "We accept interns.", "Submit"). The form
 * fields (Name / Message / Enter email) and the auto-resizing
 * textarea are preserved. The "Humans." word still carries the
 * easter-egg trigger (hover-with-5s-delay + click) that spawns the
 * walking stick-figure canvas, and clicking a figure still opens
 * the paper-note overlay with the original notes from Alex /
 * Erick / David.
 */

import { useRef, useEffect, useState, useCallback } from "react";

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
  fallX: number;
  stateTimer: number;
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
  const col  = `rgba(21,74,204,${(alpha * baseA).toFixed(3)})`;
  const dcol = `rgba(21,74,204,${(alpha * (baseA - 0.1)).toFixed(3)})`;
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

// ─── Dot-arrow icon (matches every other CTA on the page) ────────────────────

function ArrowDots({ className = "" }: { className?: string }) {
  return (
    <svg
      className={"size-3 shrink-0 " + className}
      width="24"
      viewBox="0 0 9 13"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7.22" cy="6.589" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="4.018" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="1.46" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="9.151" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="11.718" r="1.28" fill="currentColor" />
    </svg>
  );
}

// ─── Team-locations map ──────────────────────────────────────────────────────
//
// Hand-drawn world map asset with DC + Madrid pinned in brand blue
// (/public/hiringhumans2.jpeg). Rendered as a real <img> so the
// pencil-sketch detail (ships, compass rose, coastlines) reads cleanly
// at any width. Sized via CSS — width: 100%, height auto — to scale
// responsively inside the .careers-map wrapper.

const CSS = `
.careers-bounds {
  max-width: 1287px;
  margin-left: 20px;
  margin-right: 20px;
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .careers-bounds { margin-left: auto; margin-right: auto; }
}

/* ── Header ─────────────────────────────────────────────────────────────
   Centered heading + subtitle, mirroring the section-heading pattern
   used elsewhere on the page. */
.careers-header {
  text-align: center;
  padding-bottom: 40px;
}
.careers-title {
  letter-spacing: -0.025em;
  margin: 0;
}
.careers-trigger {
  color: #0081AC;
  cursor: default;
}
.careers-sub {
  margin: 16px auto 0;
  max-width: 36rem;
  color: var(--color-muted);
}

/* ── Team-locations map (DC + Madrid pinned in brand blue) ──────────── */
.careers-map {
  max-width: 960px;
  margin: 0 auto;
  padding: 8px 0;
}
.careers-map-img {
  display: block;
  width: 100%;
  height: auto;
  /* 7px corners — design-system shape token used by every inner visual
     (BentoProducts visuals, blog/feature cards). The outer frame
     radius belongs to the PageFrame card itself, not to in-card
     imagery. */
  border-radius: 7px;
}

/* ── Join CTA (centered black pill, same arrow-dots glyph as the
        rest of the site) ─────────────────────────────────────────────── */
.careers-join-row {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
.careers-join {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  background: var(--color-cta);
  color: #FFFFFF;
  border-radius: var(--radius-button-md);
  font-size: var(--typography--p-m);
  line-height: 1;
  font-weight: 500;
  border: 0;
  cursor: pointer;
  transition: color 150ms ease;
}
.careers-join:hover { color: #0081AC; }

/* ── Reveal form panel ────────────────────────────────────────────────
   Hidden by default; clicking "Join our team" toggles it open. Keeps
   the original Name / Message / Email form + Submit + "We accept
   interns." aside available on the page. */
.careers-form-panel {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 320ms ease, opacity 320ms ease, margin-top 320ms ease;
  margin-top: 0;
}
.careers-form-panel[data-open="true"] {
  /* Large ceiling rather than an exact height so the reveal never
     clips if the form grows (extra fields, validation messages, etc.).
     The cap is needed because CSS transitions can't animate max-height
     when the value is "auto". */
  max-height: 1600px;
  opacity: 1;
  margin-top: 56px;
}
@media (prefers-reduced-motion: reduce) {
  .careers-form-panel { transition: none; }
}

.careers-form-wrap {
  max-width: 600px;
  margin: 0 auto;
}

/* Form-panel intro typography. Heading + lede live above the inputs;
   the form-grid spacing sits below them via .careers-form-fields. */
.careers-form-intro-title {
  margin: 0 0 8px;
}
.careers-form-intro-copy {
  margin: 0;
  color: var(--color-muted);
}
.careers-form-intro-emph {
  color: var(--color-ink);
  font-weight: 500;
}
.careers-form-fields {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
}

.careers-field {
  display: block;
  padding: 18px 0;
  border-bottom: 1px solid var(--color-gridline);
  transition: border-color 200ms ease;
}
.careers-field:focus-within {
  border-bottom-color: #0081AC;
}
.careers-field input,
.careers-field textarea {
  width: 100%;
  background: transparent;
  border: 0;
  outline: 0;
  resize: none;
  display: block;
  overflow: hidden;
  color: var(--color-ink);
  font-size: var(--typography--p-l);
  line-height: var(--typography--p-l--line-height);
}
.careers-field input::placeholder,
.careers-field textarea::placeholder {
  color: rgba(29, 29, 31, 0.45);
}

.careers-aside {
  margin-top: 12px;
  text-align: right;
  color: var(--color-muted);
}

.careers-submit-row {
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
}
.careers-submit {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--color-cta);
  color: #ffffff;
  border-radius: var(--radius-button-md);
  padding: 14px 28px;
  font-size: var(--typography--p-m);
  line-height: 1;
  font-weight: 500;
  transition: color 150ms ease;
  border: 0;
  cursor: pointer;
}
.careers-submit:hover { color: #0081AC; }
`;

// ─── Component ───────────────────────────────────────────────────────────────

const CANVAS_H = 180;

export const Careers = ({ hideHeader, className = "" }: { hideHeader?: boolean; className?: string } = {}) => {
  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const figuresRef   = useRef<Figure[]>([]);
  const animRef      = useRef(0);
  const hoveredIdRef = useRef<number | null>(null);
  const careersVisibleRef = useRef(true);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(false);
  const [note, setNote]     = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleTextareaInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  // Spawn exactly 3 clickable figures + 1 non-clickable — tallest always
  // gets "note from alex".
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

  const cachedRectRef = useRef<DOMRect | null>(null);
  const getCachedRect = useCallback(() => {
    if (!cachedRectRef.current && canvasRef.current) cachedRectRef.current = canvasRef.current.getBoundingClientRect();
    return cachedRectRef.current;
  }, []);
  useEffect(() => {
    const invalidate = () => { cachedRectRef.current = null; };
    window.addEventListener("resize", invalidate);
    return () => window.removeEventListener("resize", invalidate);
  }, []);

  const handleCanvasMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = getCachedRect();
    if (!rect) return;
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
    e.currentTarget.style.cursor = found !== null ? "pointer" : "default";
  }, [getCachedRect]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = getCachedRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const groundY = CANVAS_H - 8;

    for (const fig of figuresRef.current) {
      if (!fig.clickable) continue;
      if (fig.state !== "walking" && fig.state !== "paused") continue;
      if (hitTest(fig, mx, my, groundY)) {
        for (const f of figuresRef.current) {
          if (f.state === "walking") f.state = "paused";
        }
        setNote(fig.noteLabel);
        return;
      }
    }
  }, [getCachedRect]);

  const dismissNote = useCallback(() => {
    for (const f of figuresRef.current) {
      if (f.state === "paused") f.state = "walking";
    }
    setNote(null);
  }, []);

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
          fig.stateTimer++;
          const fallDuration = 40;
          const t = Math.min(1, fig.stateTimer / fallDuration);
          const rotation = t * t * (Math.PI / 2);
          fig.x += fig.speed * (1 - t) * 0.5;

          drawFigure(ctx, fig.x, groundY, fig.fallX * 0.09 + fig.phaseOff, fig.scale, fig.opacity, rotation, fig.x, groundY, false);

          if (fig.stateTimer >= fallDuration) {
            fig.state = "getting-up";
            fig.stateTimer = 0;
          }

        } else if (fig.state === "getting-up") {
          fig.stateTimer++;
          const pauseFrames = 30;
          const getUpFrames = 45;

          let rotation: number;
          if (fig.stateTimer < pauseFrames) {
            rotation = Math.PI / 2;
          } else {
            const t = Math.min(1, (fig.stateTimer - pauseFrames) / getUpFrames);
            rotation = (Math.PI / 2) * (1 - t * t);
          }

          drawFigure(ctx, fig.x, groundY, fig.fallX * 0.09 + fig.phaseOff, fig.scale, fig.opacity, rotation, fig.x, groundY, false);

          if (fig.stateTimer >= pauseFrames + getUpFrames) {
            fig.state = "running-back";
            fig.stateTimer = 0;
          }

        } else if (fig.state === "running-back") {
          fig.stateTimer++;
          const runSpeed = fig.speed * 2.5;
          fig.x -= runSpeed;
          fig.opacity = Math.max(0, fig.opacity - 0.012);

          const phase = -fig.x * 0.12 + fig.phaseOff;

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
        if (careersVisibleRef.current) {
          animRef.current = requestAnimationFrame(draw);
        }
      } else {
        setActive(false);
        setNote(null);
      }
    };

    animRef.current = requestAnimationFrame(draw);

    const observer = new IntersectionObserver(
      ([entry]) => {
        careersVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && active) {
          cancelAnimationFrame(animRef.current);
          animRef.current = requestAnimationFrame(draw);
        }
      },
      { threshold: 0 }
    );
    if (canvas) observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [active]);

  return (
    <section className={`section ${className}`}>
      <style>{CSS}</style>
      <div className="careers-bounds">
        {!hideHeader && (
          <div className="careers-header">
            <h2 className="h2 tracking-tight text-ink careers-title">
              Hiring{" "}
              <span
                className="careers-trigger"
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
            <p className="p-l careers-sub">
              Our team is based in Washington DC and Madrid.
            </p>
          </div>
        )}

        <div className="careers-map">
          <img
            src="/hiringhumans2.jpeg"
            alt="Team locations: Washington DC and Madrid"
            className="careers-map-img"
          />
        </div>

        <div className="careers-join-row">
          <button
            type="button"
            className="careers-join group"
            aria-expanded={formOpen}
            aria-controls="careers-form-panel"
            onClick={() => setFormOpen((v) => !v)}
          >
            Join our team
            <span className="inline-block transition-transform group-hover:translate-x-0.5">
              <ArrowDots className="text-[#0081AC]" />
            </span>
          </button>
        </div>

        <div
          id="careers-form-panel"
          className="careers-form-panel"
          data-open={formOpen ? "true" : "false"}
          aria-hidden={!formOpen}
        >
          <div className="careers-form-wrap">
            <h3 className="h3 tracking-tight text-ink careers-form-intro-title">
              Careers &amp; investment queries
            </h3>
            <p className="p-m careers-form-intro-copy">
              If you&apos;re excited about creating paradigm shifts in physical world understanding.{" "}
              <span className="careers-form-intro-emph">Join us now.</span>
            </p>

            <form className="careers-form-fields">
              <label className="careers-field">
                <input type="text" placeholder="Name" />
              </label>
              <label className="careers-field">
                <textarea
                  ref={textareaRef}
                  placeholder="Message"
                  rows={1}
                  onInput={handleTextareaInput}
                />
              </label>
              <label className="careers-field">
                <input type="email" placeholder="Enter email" />
              </label>
            </form>

            <p className="p-s careers-aside">We accept interns.</p>

            <div className="careers-submit-row">
              <button type="submit" className="careers-submit group">
                Submit
                <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
                  <ArrowDots className="text-[#0081AC]" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Easter-egg canvas — fixed at the viewport bottom while figures are alive. */}
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

      {/* Fullscreen team-member note overlay (paper-note styling, preserved). */}
      {note && (
        <div
          className="fixed inset-0 z-10000 flex items-center justify-center"
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
                <p className="p-l text-[#8a7a5a] italic mb-5" style={{ fontFamily: "Georgia, serif" }}>
                  A note from Alexander - COO
                </p>
                <p className="p-l text-[#3a3020] leading-relaxed mb-6" style={{ fontFamily: "Georgia, serif" }}>
                  Hey I&apos;m Alexander R.B., co-founder. You found one of my easter eggs. If you would like to reach out to me personally you can find me on my Instagram at{" "}
                  <a href="https://instagram.com/alexrb.1" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0081AC] transition-colors">alexrb.1</a>
                  {" "}or my LinkedIn at:{" "}
                  <a href="https://www.linkedin.com/in/alexander-ramirez-blonski-a96121150" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0081AC] transition-colors">Alexander Ramirez Blonski</a>
                </p>
                <p className="p-l text-[#3a3020] leading-relaxed mb-8" style={{ fontFamily: "Georgia, serif" }}>
                  Enjoy your day ;)
                </p>
              </>
            )}
            {note === "note 1" && (
              <>
                <p className="p-l text-[#8a7a5a] italic mb-5" style={{ fontFamily: "Georgia, serif" }}>
                  A note from Erick - CTO
                </p>
                <p className="p-l text-[#3a3020] leading-relaxed mb-4" style={{ fontFamily: "Georgia, serif" }}>
                  Hey, I&apos;m Erick, Co-founder and CTO. My brain&apos;s responsible for all the innovative engineering behind the scenes!
                </p>
                <p className="p-l text-[#3a3020] leading-relaxed mb-4" style={{ fontFamily: "Georgia, serif" }}>
                  Check out my LinkedIn here:{" "}
                  <a href="https://www.linkedin.com/in/erick-mollinedo-lara-889587224/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0081AC] transition-colors">Erick Mollinedo Lara</a>
                </p>
                <p className="p-l text-[#8a7a5a] italic mb-8" style={{ fontFamily: "Georgia, serif" }}>
                  P.S. I did not write this, Alex did
                </p>
              </>
            )}
            {note === "note 2" && (
              <>
                <p className="p-l text-[#8a7a5a] italic mb-5" style={{ fontFamily: "Georgia, serif" }}>
                  A note from David - CEO
                </p>
                <p className="p-l text-[#3a3020] leading-relaxed mb-4" style={{ fontFamily: "Georgia, serif" }}>
                  Hey, I&apos;m David, Co-founder and CEO.
                </p>
                <p className="p-l text-[#3a3020] leading-relaxed mb-4" style={{ fontFamily: "Georgia, serif" }}>
                  Check out my LinkedIn here:{" "}
                  <a href="https://www.linkedin.com/in/davidramirezblonski/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0081AC] transition-colors">David Ramirez Blonski</a>
                  , and my personal website here:{" "}
                  <a href="https://www.gdsteel.co" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0081AC] transition-colors">gdsteel.co</a>
                </p>
                <p className="p-l text-[#3a3020] leading-relaxed mb-4" style={{ fontFamily: "Georgia, serif" }}>
                  Hope you have a beautiful day.
                </p>
                <p className="p-l text-[#8a7a5a] italic mb-8" style={{ fontFamily: "Georgia, serif" }}>
                  P.S. I did not write this, Alex did
                </p>
              </>
            )}
            <button
              onClick={dismissNote}
              className="p-s text-[#8a7a5a] hover:text-[#3a3020] transition-colors tracking-wide cursor-pointer"
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
