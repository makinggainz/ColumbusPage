"use client";

import { useEffect, useRef, useCallback } from "react";

/* ── Wave height (simplified Gerstner) ── */
function waveHeight(wx: number, wz: number, t: number) {
  const drift = t * 40, driftZ = t * 12;
  const swx = wx + drift, swz = wz + driftZ;
  let h = Math.sin(swx * 0.003 + t * 0.6) * Math.cos(swz * 0.004 + t * 0.35) * 40;
  h += Math.sin(swx * 0.005 - t * 0.4 + 1.5) * Math.cos(swz * 0.006 + t * 0.25) * 25;
  h += Math.sin((swx + swz) * 0.002 + t * 0.45) * 18;
  h += Math.sin(swx * 0.01 + t * 1.0) * Math.cos(swz * 0.009 + t * 0.55) * 8;
  return h;
}

export default function IslandScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const startRef = useRef(0);

  // Ship state
  const shipRef = useRef({ wx: -600, wz: 350, vx: 0.8 });
  // Narrative phases: "sailing" → "arriving" → "walking" → "planting" → "done"
  const phaseRef = useRef<"sailing" | "arriving" | "walking" | "planting" | "done">("sailing");
  const phaseTimeRef = useRef(0);

  const draw = useCallback(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = cvs.clientWidth;
    const H = cvs.clientHeight;

    if (cvs.width !== W * dpr || cvs.height !== H * dpr) {
      cvs.width = W * dpr;
      cvs.height = H * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#F9F9F9";
    ctx.fillRect(0, 0, W, H);

    const t = performance.now() * 0.001;
    if (startRef.current === 0) startRef.current = t;
    const elapsed = t - startRef.current;

    // Camera
    const fov = 550;
    const horizonY = H * 0.25;
    const camHeight = 380;

    const project = (wx: number, wy: number, wz: number): [number, number] | null => {
      if (wz <= 5) return null;
      return [(wx * fov) / wz + W / 2, ((wy - camHeight) * fov) / wz + horizonY];
    };

    const rgb = "20,60,160";

    // ── Draw ocean mesh ──
    const COLS = 120, ROWS = 50, CELL = 20;
    for (let r = 1; r < ROWS; r++) {
      const wz = r * CELL + 50;
      const depthT = r / ROWS;
      const alpha = (0.06 + depthT * 0.18).toFixed(3);
      const lw = 0.6 + depthT * 1.0;

      ctx.strokeStyle = `rgba(${rgb},${alpha})`;
      ctx.lineWidth = lw;
      ctx.beginPath();

      for (let c = 0; c <= COLS; c++) {
        const wx = (c - COLS / 2) * CELL;
        const wy = waveHeight(wx, wz, t);
        const pt = project(wx, wy, wz);
        if (!pt) continue;
        if (c === 0) ctx.moveTo(pt[0], pt[1]);
        else ctx.lineTo(pt[0], pt[1]);
      }
      ctx.stroke();

      // Vertical lines (every 3rd)
      if (r % 3 === 0) {
        const vAlpha = (0.02 + depthT * 0.08).toFixed(3);
        ctx.strokeStyle = `rgba(${rgb},${vAlpha})`;
        ctx.lineWidth = 0.5 + depthT * 0.5;
        for (let c = 0; c <= COLS; c += 2) {
          const wx = (c - COLS / 2) * CELL;
          const wy1 = waveHeight(wx, wz - CELL, t);
          const wy2 = waveHeight(wx, wz, t);
          const p1 = project(wx, wy1, wz - CELL);
          const p2 = project(wx, wy2, wz);
          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
            ctx.stroke();
          }
        }
      }
    }

    // ── Island (right side) ──
    const islandWx = 500, islandWz = 600;
    const islandPt = project(islandWx, 0, islandWz);
    if (islandPt) {
      const scale = fov / islandWz;

      // Sandy mound
      ctx.fillStyle = "rgba(20,60,160,0.06)";
      ctx.strokeStyle = `rgba(${rgb},0.15)`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(islandPt[0], islandPt[1] + 5 * scale, 80 * scale, 20 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cross-hatch on island
      ctx.strokeStyle = `rgba(${rgb},0.08)`;
      ctx.lineWidth = 0.6;
      for (let i = -60; i < 60; i += 12) {
        const x1 = islandPt[0] + i * scale;
        const x2 = islandPt[0] + (i + 20) * scale;
        ctx.beginPath();
        ctx.moveTo(x1, islandPt[1] + 2 * scale);
        ctx.lineTo(x2, islandPt[1] - 5 * scale);
        ctx.stroke();
      }

      // Palm trees (3 trees)
      const drawTree = (ox: number, h: number, lean: number) => {
        const tx = islandPt[0] + ox * scale;
        const ty = islandPt[1];

        // Trunk
        ctx.strokeStyle = `rgba(${rgb},0.2)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.quadraticCurveTo(tx + lean * scale, ty - h * 0.6 * scale, tx + lean * 0.5 * scale, ty - h * scale);
        ctx.stroke();

        // Fronds
        const topX = tx + lean * 0.5 * scale;
        const topY = ty - h * scale;
        ctx.strokeStyle = `rgba(${rgb},0.15)`;
        ctx.lineWidth = 1;
        for (let a = 0; a < 6; a++) {
          const angle = (a / 6) * Math.PI * 2 + Math.sin(t * 0.5 + a) * 0.1;
          const fx = topX + Math.cos(angle) * 25 * scale;
          const fy = topY + Math.sin(angle) * 12 * scale + 5 * scale;
          ctx.beginPath();
          ctx.moveTo(topX, topY);
          ctx.quadraticCurveTo(topX + (fx - topX) * 0.5, topY - 8 * scale, fx, fy);
          ctx.stroke();
        }
      };

      drawTree(-20, 55, 8);
      drawTree(15, 65, -5);
      drawTree(35, 45, 12);

      // ── Flag (appears after "planting" phase) ──
      const phase = phaseRef.current;
      if (phase === "planting" || phase === "done") {
        const flagProgress = phase === "done" ? 1 : Math.min(1, (t - phaseTimeRef.current) / 1.5);
        const flagX = islandPt[0] - 10 * scale;
        const flagBaseY = islandPt[1];
        const flagTopY = flagBaseY - 40 * scale * flagProgress;

        // Pole
        ctx.strokeStyle = `rgba(${rgb},0.3)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(flagX, flagBaseY);
        ctx.lineTo(flagX, flagTopY);
        ctx.stroke();

        // Flag cloth
        if (flagProgress > 0.3) {
          const clothAlpha = Math.min(1, (flagProgress - 0.3) / 0.5);
          ctx.fillStyle = `rgba(37,99,235,${(0.2 * clothAlpha).toFixed(2)})`;
          ctx.strokeStyle = `rgba(${rgb},${(0.25 * clothAlpha).toFixed(2)})`;
          ctx.lineWidth = 1;
          const wave = Math.sin(t * 2) * 3 * scale;
          ctx.beginPath();
          ctx.moveTo(flagX, flagTopY);
          ctx.lineTo(flagX + 20 * scale, flagTopY + 5 * scale + wave);
          ctx.lineTo(flagX + 18 * scale, flagTopY + 15 * scale + wave * 0.5);
          ctx.lineTo(flagX, flagTopY + 12 * scale);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Logo dot on flag
          ctx.fillStyle = `rgba(${rgb},${(0.3 * clothAlpha).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(flagX + 10 * scale, flagTopY + 8 * scale + wave * 0.7, 3 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // ── Ship ──
    const ship = shipRef.current;

    // Update ship position based on phase
    if (phaseRef.current === "sailing") {
      ship.wx += ship.vx * 0.6;
      // Slow down as approaching island
      if (ship.wx > 300) {
        ship.vx *= 0.995;
      }
      if (ship.wx > 420) {
        phaseRef.current = "arriving";
        phaseTimeRef.current = t;
      }
    } else if (phaseRef.current === "arriving") {
      ship.vx *= 0.98;
      ship.wx += ship.vx * 0.3;
      if (t - phaseTimeRef.current > 2) {
        phaseRef.current = "walking";
        phaseTimeRef.current = t;
      }
    } else if (phaseRef.current === "walking") {
      if (t - phaseTimeRef.current > 3) {
        phaseRef.current = "planting";
        phaseTimeRef.current = t;
      }
    } else if (phaseRef.current === "planting") {
      if (t - phaseTimeRef.current > 2) {
        phaseRef.current = "done";
      }
    }

    const shipWy = waveHeight(ship.wx, ship.wz, t);
    const shipPt = project(ship.wx, shipWy, ship.wz);

    if (shipPt) {
      const s = fov / ship.wz;
      const bob = Math.sin(t * 1.5) * 3 * s;

      // Hull
      ctx.strokeStyle = `rgba(${rgb},0.3)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(shipPt[0] - 25 * s, shipPt[1] + bob);
      ctx.lineTo(shipPt[0] - 30 * s, shipPt[1] + 8 * s + bob);
      ctx.lineTo(shipPt[0] + 30 * s, shipPt[1] + 8 * s + bob);
      ctx.lineTo(shipPt[0] + 25 * s, shipPt[1] + bob);
      ctx.closePath();
      ctx.fillStyle = "rgba(20,60,160,0.04)";
      ctx.fill();
      ctx.stroke();

      // Mast
      ctx.beginPath();
      ctx.moveTo(shipPt[0], shipPt[1] + bob);
      ctx.lineTo(shipPt[0], shipPt[1] - 35 * s + bob);
      ctx.stroke();

      // Sail
      ctx.fillStyle = "rgba(37,99,235,0.08)";
      ctx.strokeStyle = `rgba(${rgb},0.2)`;
      ctx.lineWidth = 1;
      const sailWave = Math.sin(t * 1.2) * 2 * s;
      ctx.beginPath();
      ctx.moveTo(shipPt[0], shipPt[1] - 33 * s + bob);
      ctx.quadraticCurveTo(shipPt[0] + 20 * s + sailWave, shipPt[1] - 20 * s + bob, shipPt[0], shipPt[1] - 5 * s + bob);
      ctx.fill();
      ctx.stroke();

      // Stick figures on ship (if not yet walking)
      if (phaseRef.current === "sailing" || phaseRef.current === "arriving") {
        const drawFigure = (fx: number) => {
          const figX = shipPt[0] + fx * s;
          const figY = shipPt[1] - 2 * s + bob;
          ctx.strokeStyle = `rgba(${rgb},0.25)`;
          ctx.lineWidth = 1;
          // Head
          ctx.beginPath();
          ctx.arc(figX, figY - 10 * s, 2.5 * s, 0, Math.PI * 2);
          ctx.stroke();
          // Body
          ctx.beginPath();
          ctx.moveTo(figX, figY - 7 * s);
          ctx.lineTo(figX, figY);
          ctx.stroke();
          // Legs
          const legPhase = Math.sin(t * 3 + fx) * 0.3;
          ctx.beginPath();
          ctx.moveTo(figX, figY);
          ctx.lineTo(figX - 3 * s * Math.sin(legPhase), figY + 5 * s);
          ctx.moveTo(figX, figY);
          ctx.lineTo(figX + 3 * s * Math.sin(legPhase), figY + 5 * s);
          ctx.stroke();
        };
        drawFigure(-8);
        drawFigure(5);
      }

      // Walking figures (from ship to island)
      if (phaseRef.current === "walking" || phaseRef.current === "planting" || phaseRef.current === "done") {
        const walkElapsed = phaseRef.current === "walking" ? t - phaseTimeRef.current : 3;
        const walkProgress = Math.min(1, walkElapsed / 3);

        for (let f = 0; f < 2; f++) {
          const fp = Math.min(1, walkProgress + f * -0.15);
          if (fp <= 0) continue;
          const figWx = ship.wx + (islandWx - 30 - ship.wx) * fp;
          const figWz = ship.wz + (islandWz - ship.wz) * fp * 0.3;
          const figPt = project(figWx, fp > 0.7 ? 0 : waveHeight(figWx, figWz, t), figWz);
          if (!figPt) continue;

          const fs = fov / figWz;
          ctx.strokeStyle = `rgba(${rgb},0.25)`;
          ctx.lineWidth = 1;
          // Head
          ctx.beginPath();
          ctx.arc(figPt[0], figPt[1] - 10 * fs, 2.5 * fs, 0, Math.PI * 2);
          ctx.stroke();
          // Body
          ctx.beginPath();
          ctx.moveTo(figPt[0], figPt[1] - 7 * fs);
          ctx.lineTo(figPt[0], figPt[1]);
          ctx.stroke();
          // Walking legs
          const legP = Math.sin(t * 4 + f * 2) * 0.4;
          ctx.beginPath();
          ctx.moveTo(figPt[0], figPt[1]);
          ctx.lineTo(figPt[0] - 3 * fs * Math.sin(legP), figPt[1] + 5 * fs);
          ctx.moveTo(figPt[0], figPt[1]);
          ctx.lineTo(figPt[0] + 3 * fs * Math.sin(legP), figPt[1] + 5 * fs);
          ctx.stroke();
          // Arms
          const armP = Math.sin(t * 4 + f * 2 + Math.PI) * 0.35;
          ctx.beginPath();
          ctx.moveTo(figPt[0], figPt[1] - 5 * fs);
          ctx.lineTo(figPt[0] - 4 * fs * Math.sin(armP), figPt[1] - 2 * fs);
          ctx.moveTo(figPt[0], figPt[1] - 5 * fs);
          ctx.lineTo(figPt[0] + 4 * fs * Math.sin(armP), figPt[1] - 2 * fs);
          ctx.stroke();
        }
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: "50vh", minHeight: 350 }}
    />
  );
}
