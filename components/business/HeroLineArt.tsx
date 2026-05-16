"use client";

export function HeroLineArt({ showIslands = true }: { showIslands?: boolean }) {
  return (
    <>
      {/* ── Topographic contour lines — right side only ── */}
      {showIslands && (
      <svg
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{ height: "50%", zIndex: 0 }}
        viewBox="0 0 1440 500"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
        aria-hidden
      >
        {(() => {
          const islands = [
            { x: 80, y: 70, h: 1.0, sx: 90, sy: 70 },
            { x: 200, y: 120, h: 0.75, sx: 70, sy: 55 },
            { x: 50, y: 180, h: 0.55, sx: 55, sy: 65 },
            { x: 300, y: 60, h: 0.40, sx: 50, sy: 40 },
            { x: 160, y: 220, h: 0.30, sx: 40, sy: 35 },
            { x: 1350, y: 60, h: 0.90, sx: 85, sy: 65 },
            { x: 1220, y: 130, h: 0.65, sx: 65, sy: 55 },
            { x: 1400, y: 170, h: 0.50, sx: 55, sy: 60 },
            { x: 1120, y: 70, h: 0.35, sx: 45, sy: 38 },
            { x: 1280, y: 230, h: 0.28, sx: 40, sy: 45 },
            { x: 580, y: 60, h: 0.05, sx: 45, sy: 30 },
            { x: 750, y: 90, h: 0.04, sx: 40, sy: 28 },
            { x: 900, y: 45, h: 0.05, sx: 38, sy: 25 },
          ];
          const heightAt = (x: number, y: number) => {
            let h = 0;
            for (const p of islands) {
              const dx = x - p.x, dy = y - p.y;
              h += p.h * Math.exp(-(dx * dx) / (2 * p.sx * p.sx) - (dy * dy) / (2 * p.sy * p.sy));
            }
            return h;
          };
          const cell = 6;
          const nx = Math.ceil(1440 / cell);
          const ny = Math.ceil(500 / cell);
          const grid: number[][] = [];
          for (let iy = 0; iy <= ny; iy++) {
            const row: number[] = [];
            for (let ix = 0; ix <= nx; ix++) row.push(heightAt(ix * cell, iy * cell));
            grid.push(row);
          }
          const contours: { level: number; isIndex: boolean }[] = [];
          let idx = 0;
          for (let l = 0.06; l < 1.0; l += 0.04) {
            contours.push({ level: l, isIndex: idx % 5 === 0 });
            idx++;
          }
          const paths: React.ReactElement[] = [];
          for (const { level, isIndex } of contours) {
            const segs: [number, number, number, number][] = [];
            for (let iy = 0; iy < ny; iy++) {
              for (let ix = 0; ix < nx; ix++) {
                const tl = grid[iy][ix], tr = grid[iy][ix + 1];
                const br = grid[iy + 1][ix + 1], bl = grid[iy + 1][ix];
                const cfg = (tl >= level ? 8 : 0) | (tr >= level ? 4 : 0) | (br >= level ? 2 : 0) | (bl >= level ? 1 : 0);
                if (cfg === 0 || cfg === 15) continue;
                const x0 = ix * cell, y0 = iy * cell, x1 = x0 + cell, y1 = y0 + cell;
                const lerp = (a: number, b: number, va: number, vb: number) =>
                  Math.abs(vb - va) < 1e-10 ? (a + b) / 2 : a + Math.max(0, Math.min(1, (level - va) / (vb - va))) * (b - a);
                const top: [number, number] = [lerp(x0, x1, tl, tr), y0];
                const right: [number, number] = [x1, lerp(y0, y1, tr, br)];
                const bottom: [number, number] = [lerp(x0, x1, bl, br), y1];
                const left: [number, number] = [x0, lerp(y0, y1, tl, bl)];
                const add = (a: [number, number], b: [number, number]) => segs.push([a[0], a[1], b[0], b[1]]);
                const avg = (tl + tr + br + bl) / 4;
                switch (cfg) {
                  case 1: add(left, bottom); break; case 2: add(bottom, right); break;
                  case 3: add(left, right); break; case 4: add(top, right); break;
                  case 5: if (avg >= level) { add(left, top); add(bottom, right); } else { add(left, bottom); add(top, right); } break;
                  case 6: add(top, bottom); break; case 7: add(left, top); break;
                  case 8: add(top, left); break; case 9: add(top, bottom); break;
                  case 10: if (avg >= level) { add(top, right); add(left, bottom); } else { add(top, left); add(bottom, right); } break;
                  case 11: add(top, right); break; case 12: add(left, right); break;
                  case 13: add(bottom, right); break; case 14: add(left, bottom); break;
                }
              }
            }
            const EPS = 0.5;
            const k = (x: number, y: number) => `${Math.round(x / EPS)},${Math.round(y / EPS)}`;
            type Seg = { s: [number, number]; e: [number, number]; used: boolean };
            const ss: Seg[] = segs.map(([a, b, c, d]) => ({ s: [a, b], e: [c, d], used: false }));
            const endMap = new Map<string, number[]>();
            for (let i = 0; i < ss.length; i++) {
              for (const pt of [ss[i].s, ss[i].e]) {
                const key = k(pt[0], pt[1]);
                if (!endMap.has(key)) endMap.set(key, []);
                endMap.get(key)!.push(i);
              }
            }
            for (let i = 0; i < ss.length; i++) {
              if (ss[i].used) continue;
              ss[i].used = true;
              const chain: [number, number][] = [ss[i].s, ss[i].e];
              for (const pickHead of [false, true]) {
                let grew = true;
                while (grew) {
                  grew = false;
                  const tip = pickHead ? chain[0] : chain[chain.length - 1];
                  const cands = endMap.get(k(tip[0], tip[1]));
                  if (!cands) break;
                  for (const j of cands) {
                    if (ss[j].used) continue;
                    const match = k(ss[j].s[0], ss[j].s[1]) === k(tip[0], tip[1]);
                    const pt = match ? ss[j].e : ss[j].s;
                    if (pickHead) chain.unshift(pt); else chain.push(pt);
                    ss[j].used = true;
                    grew = true;
                    break;
                  }
                }
              }
              if (chain.length < 3) continue;
              const d = chain.map((p, pi) => `${pi === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
              paths.push(
                <path
                  key={`c${level.toFixed(2)}-${i}`}
                  d={d}
                  stroke={`rgba(37,99,235,${isIndex ? 0.22 : 0.11})`}
                  strokeWidth={isIndex ? 1.2 : 0.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              );
            }
          }
          return paths;
        })()}
      </svg>
      )}

      {/* ── 3D wireframe mesh mountains — bottom ── */}
      <svg
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{ height: "52%", zIndex: 0 }}
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        aria-hidden
      >
        {Array.from({ length: 40 }, (_, row) => {
          const baseY = 140 + row * 12;
          const depth = row / 40;
          const perspective = 1 - depth * 0.6;
          const pts = Array.from({ length: 145 }, (_, col) => {
            const x = col * 10;
            const p1x = 360, p1y = 320, h1 = 180, s1 = 35000;
            const p2x = 720, p2y = 290, h2 = 220, s2 = 50000;
            const p3x = 1060, p3y = 340, h3 = 150, s3 = 30000;
            const p4x = 540, p4y = 380, h4 = 100, s4 = 20000;
            const p5x = 900, p5y = 350, h5 = 120, s5 = 25000;
            const d1 = (x - p1x) ** 2 + (baseY - p1y) ** 2;
            const d2 = (x - p2x) ** 2 + (baseY - p2y) ** 2;
            const d3 = (x - p3x) ** 2 + (baseY - p3y) ** 2;
            const d4 = (x - p4x) ** 2 + (baseY - p4y) ** 2;
            const d5 = (x - p5x) ** 2 + (baseY - p5y) ** 2;
            const elev = (
              h1 * Math.exp(-d1 / s1) + h2 * Math.exp(-d2 / s2) + h3 * Math.exp(-d3 / s3) +
              h4 * Math.exp(-d4 / s4) + h5 * Math.exp(-d5 / s5) +
              8 * Math.sin(x * 0.008 + baseY * 0.006)
            ) * perspective;
            return `${x},${(baseY - elev).toFixed(1)}`;
          }).join(" ");
          const opacity = (0.04 + perspective * 0.20).toFixed(2);
          return <polyline key={`mh${row}`} points={pts} stroke={`rgba(37,99,235,${opacity})`} strokeWidth={0.7} fill="none" />;
        })}
        {Array.from({ length: 73 }, (_, col) => {
          const x = col * 20;
          const pts = Array.from({ length: 40 }, (_, row) => {
            const baseY = 140 + row * 12;
            const depth = row / 40;
            const perspective = 1 - depth * 0.6;
            const p1x = 360, p1y = 320, h1 = 180, s1 = 35000;
            const p2x = 720, p2y = 290, h2 = 220, s2 = 50000;
            const p3x = 1060, p3y = 340, h3 = 150, s3 = 30000;
            const p4x = 540, p4y = 380, h4 = 100, s4 = 20000;
            const p5x = 900, p5y = 350, h5 = 120, s5 = 25000;
            const d1 = (x - p1x) ** 2 + (baseY - p1y) ** 2;
            const d2 = (x - p2x) ** 2 + (baseY - p2y) ** 2;
            const d3 = (x - p3x) ** 2 + (baseY - p3y) ** 2;
            const d4 = (x - p4x) ** 2 + (baseY - p4y) ** 2;
            const d5 = (x - p5x) ** 2 + (baseY - p5y) ** 2;
            const elev = (
              h1 * Math.exp(-d1 / s1) + h2 * Math.exp(-d2 / s2) + h3 * Math.exp(-d3 / s3) +
              h4 * Math.exp(-d4 / s4) + h5 * Math.exp(-d5 / s5) +
              8 * Math.sin(x * 0.008 + baseY * 0.006)
            ) * perspective;
            return `${x},${(baseY - elev).toFixed(1)}`;
          }).join(" ");
          return <polyline key={`mv${col}`} points={pts} stroke="rgba(37,99,235,0.05)" strokeWidth={0.4} fill="none" />;
        })}
      </svg>
    </>
  );
}
