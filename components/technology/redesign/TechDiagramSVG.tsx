import React from "react";

export interface TechDiagramSVGProps extends React.SVGProps<SVGSVGElement> {
  activeTitle?: string | null;
}

const pathCircle_iso  = "M 0 -6 L 8 -4 L 12 0 L 8 4 L 0 6 L -8 4 L -12 0 L -8 -4 Z";
const pathStar_iso    = "M 0 -7 L 4 -2 L 14 0 L 4 2 L 0 7 L -4 2 L -14 0 L -4 -2 Z";
const pathDiamond_iso = "M 0 -7 L 7 -3.5 L 14 0 L 7 3.5 L 0 7 L -7 3.5 L -14 0 L -7 -3.5 Z";
const pathHex_iso     = "M -6 -6 L 6 -6 L 12 -3 L 12 3 L 6 6 L -6 6 L -12 3 L -12 -3 Z";
const pathTri_iso     = "M 0 -7 L 5 -1.5 L 10 4 L 0 4 L -10 4 L -5 -1.5 L 0 -7 L 0 -7 Z";

const BUBBLES_L1 = [
  { delay: 0,   duration: 2.3, x: 200, startY: 217, endY: 404, pathStart: pathStar_iso },
  { delay: 0.4, duration: 1.7, x: 250, startY: 243, endY: 377, pathStart: pathCircle_iso },
  { delay: 0.8, duration: 1.0, x: 300, startY: 270, endY: 350, pathStart: pathDiamond_iso },
  { delay: 1.2, duration: 1.7, x: 350, startY: 243, endY: 377, pathStart: pathHex_iso },
  { delay: 1.6, duration: 2.3, x: 400, startY: 217, endY: 404, pathStart: pathTri_iso },
];

const AnimatedShapes = ({ bubbles, isVisible, border }: { bubbles: any[], isVisible: boolean, border: string }) => {
  const pathSquare = "M -10 -10 L 0 -10 L 10 -10 L 10 0 L 10 10 L 0 10 L -10 10 L -10 0 Z";
  
  return (
    <g style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.4s ease", pointerEvents: "none" }}>
      {bubbles.map((b, i) => {
        const startPath = b.pathStart || pathDiamond_iso;
        return (
          <g key={`shape-${i}`} opacity="0">
            <animateTransform
              attributeName="transform"
              type="translate"
              from={`${b.x} ${b.startY}`}
              to={`${b.x} ${b.endY}`}
              dur={`${b.duration}s`}
              repeatCount="indefinite"
              begin={`${b.delay}s`}
            />
            <animate
              attributeName="opacity"
              values="0; 1; 1; 0"
              keyTimes="0; 0.1; 0.95; 1"
              dur={`${b.duration}s`}
              repeatCount="indefinite"
              begin={`${b.delay}s`}
            />
            <path fill={border} d={startPath}>
              <animate
                attributeName="d"
                values={`${startPath}; ${pathSquare}; ${pathSquare}`}
                keyTimes="0; 0.5; 1"
                dur={`${b.duration}s`}
                repeatCount="indefinite"
                begin={`${b.delay}s`}
              />
            </path>
          </g>
        );
      })}
    </g>
  );
};

const FusionLines = ({ isVisible, offsetL2 }: { isVisible: boolean, offsetL2: number }) => {
  const dur = 5;

  // Colored lines: wide sweeping beziers, converge at ~75% of the track (x≈390).
  // At x=390 the box right face is at y≈438; floating 12px below → y≈450.
  // Control points are spread far apart so the arc is gradual with no deceleration at the curve.
  // C1 continuity at convergence (390,450):
  //   last cp of colored lines ≈ (340,504) → reflected first cp of blue = (440,396).
  // Linear timing (no calcMode/keySplines) keeps constant speed through the corner.
  // Straight L segments on both sides, single Q bezier for the corner turn.
  // All 3 colored lines converge at (390, 450) — 75% of the track.
  // Blue continues straight from there. Linear timing = no slowdown at corner.
  const coloredDash = 330;
  const blueDash = 115;
  const leftPaths: { color: string; d: string; qY: number; exitY: number }[] = [
    { color: "#e9c46a", qY: 498, exitY: 488, d: "" },
    { color: "#e63946", qY: 506, exitY: 496, d: "" },
    { color: "#2a9d8f", qY: 514, exitY: 504, d: "" },
  ].map((l, i) => ({
    ...l,
    d: `M 118 ${400 + i * 8} L 280 ${l.exitY} Q 300 ${l.qY} 325 ${l.exitY} L 390 450`,
  }));

  return (
    <g style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.4s ease", pointerEvents: "none" }} transform={`translate(0, ${offsetL2})`}>
      {leftPaths.map(({ color, d }) => (
        <path key={color} d={d} fill="none" stroke={color} strokeWidth="2.5"
          strokeDasharray={coloredDash} strokeDashoffset={coloredDash}
          strokeLinecap="round" strokeLinejoin="round" opacity="0"
        >
          <animate attributeName="stroke-dashoffset" values={`${coloredDash}; ${coloredDash}; 0; 0`} keyTimes="0; 0.05; 0.75; 1" dur={`${dur}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0; 0.92; 0.92; 0" keyTimes="0; 0.05; 0.88; 1" dur={`${dur}s`} repeatCount="indefinite" />
        </path>
      ))}

      <path d="M 390 450 L 482 400" fill="none" stroke="#1e2e7a" strokeWidth="2.5"
        strokeDasharray={blueDash} strokeDashoffset={blueDash}
        strokeLinecap="round" strokeLinejoin="round" opacity="0"
      >
        <animate attributeName="stroke-dashoffset" values={`${blueDash}; ${blueDash}; 0; 0`} keyTimes="0; 0.72; 0.88; 1" dur={`${dur}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0; 0.92; 0.92; 0" keyTimes="0; 0.72; 0.88; 1" dur={`${dur}s`} repeatCount="indefinite" />
      </path>
    </g>
  );
};

const PuzzleLayer = ({ isVisible }: { isVisible: boolean }) => {
  const S = 257.38;
  const N = 24; // Much finer grid (24x24 = 576 squares)
  const W = S / N;
  const dark = "#1e2e7a";

  const SQUARES = [
    // Staggered pairs to ensure exactly 2 pieces move at any given time in a 10s cycle
    { r: 2, c: 5, dx: 1, dy: 0, delay: 0 },
    { r: 18, c: 10, dx: 0, dy: -1, delay: 0 },
    { r: 5, c: 20, dx: -1, dy: 0, delay: 0.5 },
    { r: 14, c: 4, dx: 0, dy: 1, delay: 0.5 },
    { r: 8, c: 8, dx: 1, dy: 0, delay: 1.0 },
    { r: 20, c: 16, dx: 0, dy: -1, delay: 1.0 },
    { r: 10, c: 2, dx: 0, dy: 1, delay: 1.5 },
    { r: 3, c: 15, dx: -1, dy: 0, delay: 1.5 },
    { r: 21, c: 6, dx: 1, dy: 0, delay: 2.0 },
    { r: 7, c: 22, dx: 0, dy: -1, delay: 2.0 },
    { r: 15, c: 11, dx: -1, dy: 0, delay: 2.5 },
    { r: 1, c: 9, dx: 0, dy: 1, delay: 2.5 },
    { r: 12, c: 19, dx: 1, dy: 0, delay: 3.0 },
    { r: 6, c: 13, dx: 0, dy: -1, delay: 3.0 },
    { r: 17, c: 3, dx: 0, dy: 1, delay: 3.5 },
    { r: 9, c: 21, dx: -1, dy: 0, delay: 3.5 },
    { r: 22, c: 18, dx: 1, dy: 0, delay: 4.0 },
    { r: 4, c: 7, dx: 0, dy: -1, delay: 4.0 },
    { r: 11, c: 14, dx: -1, dy: 0, delay: 4.5 },
    { r: 19, c: 5, dx: 0, dy: 1, delay: 4.5 },
  ];

  const isAnimated = (r: number, c: number) => SQUARES.some(sq => (sq.r === r && sq.c === c) || (sq.r + sq.dy === r && sq.c + sq.dx === c));

  const getCellColor = (r: number, c: number) => {
    // Deterministic pseudo-random noise to mimic "conglomerations"
    const x = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
    const val = x - Math.floor(x);
    return val > 0.45 ? dark : null;
  };

  const dur = 10; // 10 second total cycle

  return (
    <g clipPath="url(#clip-l3)">
      <g transform="translate(300, 500) scale(1, 0.53846) rotate(45)">
        {[...Array(N)].map((_, r) =>
          [...Array(N)].map((_, c) => {
            if (isAnimated(r, c)) return null;
            const color = getCellColor(r, c);
            if (!color) return null;
            return <rect key={`static-${r}-${c}`} x={c * W} y={r * W} width={W - 1} height={W - 1} fill={color} />;
          })
        )}
        
        {SQUARES.map((sq, i) => {
          const startX = sq.c * W;
          const startY = sq.r * W;
          const endX = (sq.c + sq.dx) * W;
          const endY = (sq.r + sq.dy) * W;
          const color = dark; // Force dynamic pieces to be dark so they are visible
          
          return (
            <rect key={`anim-${i}`} x={startX} y={startY} width={W - 1} height={W - 1} fill={color}>
              {isVisible && <animate attributeName="x" values={`${startX}; ${endX}; ${endX}; ${startX}; ${startX}`} keyTimes="0; 0.05; 0.5; 0.55; 1" dur={`${dur}s`} repeatCount="indefinite" begin={`${sq.delay}s`} />}
              {isVisible && <animate attributeName="y" values={`${startY}; ${endY}; ${endY}; ${startY}; ${startY}`} keyTimes="0; 0.05; 0.5; 0.55; 1" dur={`${dur}s`} repeatCount="indefinite" begin={`${sq.delay}s`} />}
            </rect>
          );
        })}
      </g>
    </g>
  );
};

const TetrisBlocks = ({ isVisible }: { isVisible: boolean }) => {
  const dark = "#1e2e7a";
  const dur = 6;

  const blocks = [
    { x: 300, y: 760, drop: 80, delay: 0, type: 'T' },
    { x: 220, y: 810, drop: 70, delay: 1.5, type: 'L' },
    { x: 380, y: 840, drop: 90, delay: 3.0, type: 'O' },
    { x: 270, y: 880, drop: 60, delay: 4.5, type: 'I' },
  ];

  return (
    <g style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.4s ease", pointerEvents: "none" }}>
      {blocks.map((b, i) => (
        <g key={`tetris-${i}`}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`${b.x} ${b.y - b.drop}; ${b.x} ${b.y}; ${b.x} ${b.y}; ${b.x} ${b.y - b.drop}`}
            keyTimes="0; 0.15; 0.85; 1"
            dur={`${dur}s`}
            repeatCount="indefinite"
            begin={`${b.delay}s`}
          />
          <animate
            attributeName="opacity"
            values="0; 1; 1; 0"
            keyTimes="0; 0.15; 0.85; 1"
            dur={`${dur}s`}
            repeatCount="indefinite"
            begin={`${b.delay}s`}
          />
          <g transform="scale(1, 0.53846) rotate(45)">
            {b.type === 'T' && (
              <g fill={dark}>
                <rect x="-8" y="-8" width="15" height="15" />
                <rect x="8" y="-8" width="15" height="15" />
                <rect x="-24" y="-8" width="15" height="15" />
                <rect x="-8" y="8" width="15" height="15" />
              </g>
            )}
            {b.type === 'L' && (
              <g fill={dark}>
                <rect x="-8" y="-24" width="15" height="15" />
                <rect x="-8" y="-8" width="15" height="15" />
                <rect x="-8" y="8" width="15" height="15" />
                <rect x="8" y="8" width="15" height="15" />
              </g>
            )}
            {b.type === 'O' && (
              <g fill={dark}>
                <rect x="-8" y="-8" width="15" height="15" />
                <rect x="8" y="-8" width="15" height="15" />
                <rect x="-8" y="8" width="15" height="15" />
                <rect x="8" y="8" width="15" height="15" />
              </g>
            )}
            {b.type === 'I' && (
              <g fill={dark}>
                <rect x="-8" y="-24" width="15" height="15" />
                <rect x="-8" y="-8" width="15" height="15" />
                <rect x="-8" y="8" width="15" height="15" />
                <rect x="-8" y="24" width="15" height="15" />
              </g>
            )}
          </g>
        </g>
      ))}
    </g>
  );
};

export function TechDiagramSVG({ activeTitle, ...props }: TechDiagramSVGProps) {
  const border = "#1e2e7a";
  const bgFill = "transparent";
  const leftFace = bgFill;
  const rightFace = bgFill;
  const strokeWidth = 1.5;

  const dataCollectionProps = { href: "/TechnologyPageImages/DataCollectionLayer.png", preserveAspectRatio: "none" };
  const fusionLayerProps = { href: "/TechnologyPageImages/FusionLayer.png", preserveAspectRatio: "none" };
  const lastLayerProps = { href: "/TechnologyPageImages/LastLayer.png", preserveAspectRatio: "none" };

  const isDataCollection = activeTitle === "Data Collection";
  const isFusion = activeTitle === "Fusion";
  const isCoreReasoning = activeTitle === "Core Reasoning";
  const isAnswers = activeTitle === "Answers, insights, patterns";
  
  const activeIndex = isDataCollection ? 0 : isFusion ? 1 : isCoreReasoning ? 2 : isAnswers ? 3 : -1;

  const getOpacity = (layerIndex: number) => {
    if (activeIndex === -1) return 1;
    return activeIndex === layerIndex ? 1 : 0.45;
  };

  const getShift = (layerIndex: number) => {
    if (activeIndex === -1 || activeIndex === 3) return 0;
    return layerIndex > activeIndex ? 80 : 0;
  };

  const offsetL1 = getShift(0); // 0
  const offsetL2 = getShift(1);
  const offsetL3 = getShift(2);
  const offsetL4 = getShift(3);

  const pathTransition = { transition: "d 0.4s ease, opacity 0.4s ease" };

  const drawLine = (x1: number, y1: number, x2: number, y2: number, shift1: number, shift2: number, opacity: number) => (
    <path d={`M ${x1} ${y1 + shift1} L ${x2} ${y2 + shift2}`} style={{ ...pathTransition, opacity }} stroke={border} strokeWidth={1} strokeDasharray="6 6" />
  );

  return (
    <svg viewBox="0 0 600 1100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <clipPath id="clip-l1"><polygon points="300,6 550,138 300,270 50,138" /></clipPath>
        <clipPath id="clip-l2"><polygon points="300,270 482,368 300,466 118,368" /></clipPath>
        <clipPath id="clip-l3"><polygon points="300,500 482,598 300,696 118,598" /></clipPath>
        <clipPath id="clip-l4-center"><polygon points="300,727 482,825 300,923 118,825" /></clipPath>
      </defs>

      {/* Dashed background lines connecting the layers */}
      <g>
        {/* L1 -> L2 */}
        {drawLine(50, 138, 118, 368, offsetL1, offsetL2, getOpacity(1))}
        {drawLine(550, 138, 482, 368, offsetL1, offsetL2, getOpacity(1))}
        {drawLine(300, 6, 300, 270, offsetL1, offsetL2, getOpacity(1))}
        {drawLine(300, 270, 300, 466, offsetL1, offsetL2, getOpacity(1))}

        {/* L2 -> L3 */}
        {drawLine(118, 368, 118, 598, offsetL2, offsetL3, getOpacity(2))}
        {drawLine(482, 368, 482, 598, offsetL2, offsetL3, getOpacity(2))}
        {drawLine(300, 270, 300, 500, offsetL2, offsetL3, getOpacity(2))}
        {drawLine(300, 466, 300, 696, offsetL2, offsetL3, getOpacity(2))}

        {/* L3 -> L4 */}
        {drawLine(118, 598, 118, 825, offsetL3, offsetL4, getOpacity(3))}
        {drawLine(482, 598, 482, 825, offsetL3, offsetL4, getOpacity(3))}
        {drawLine(300, 500, 300, 727, offsetL3, offsetL4, getOpacity(3))}
        {drawLine(300, 696, 300, 923, offsetL3, offsetL4, getOpacity(3))}
      </g>

      {/* Ground Plane (Layer 4) */}
      <g id="layer4" style={{ transform: `translateY(${offsetL4}px)`, opacity: getOpacity(3), transition: "transform 0.4s ease, opacity 0.4s ease" }}>
        <polygon points="300,671 586,825 300,979 14,825" fill={bgFill} stroke={border} strokeWidth={strokeWidth} />
        <g stroke={border} strokeWidth={0.5}>
          {[...Array(12)].map((_, i) => {
            const t = i / 11;
            const p1x = 14 + 286 * t, p1y = 825 - 154 * t;
            const p2x = 300 + 286 * t, p2y = 979 - 154 * t;
            const p3x = 586 - 286 * t, p3y = 825 - 154 * t;
            const p4x = 300 - 286 * t, p4y = 979 - 154 * t;
            return (
              <React.Fragment key={`l4-grid-${i}`}>
                <line x1={p1x} y1={p1y} x2={p2x} y2={p2y} />
                <line x1={p3x} y1={p3y} x2={p4x} y2={p4y} />
              </React.Fragment>
            );
          })}
        </g>
        <g clipPath="url(#clip-l4-center)">
          <polygon points="300,727 482,825 300,923 118,825" fill={bgFill} />
          <image {...lastLayerProps} x="118" y="727" width="364" height="196" />
        </g>
        <polygon points="300,727 482,825 300,923 118,825" fill="none" stroke={border} strokeWidth={strokeWidth} />
      </g>

      {/* Layer 3 */}
      <g id="layer3" style={{ transform: `translateY(${offsetL3}px)`, opacity: getOpacity(2), transition: "transform 0.4s ease, opacity 0.4s ease" }}>
        <polygon points="118,598 300,696 300,716 118,618" fill={leftFace} stroke={border} strokeWidth={strokeWidth} />
        <polygon points="300,696 482,598 482,618 300,716" fill={rightFace} stroke={border} strokeWidth={strokeWidth} />
        <polygon points="300,500 482,598 300,696 118,598" fill={bgFill} stroke={border} strokeWidth={strokeWidth} />
        <PuzzleLayer isVisible={isCoreReasoning} />
      </g>

      {/* Layer 2 */}
      <g id="layer2" style={{ transform: `translateY(${offsetL2}px)`, opacity: getOpacity(1), transition: "transform 0.4s ease, opacity 0.4s ease" }}>
        <polygon points="118,368 300,466 300,486 118,388" fill={leftFace} stroke={border} strokeWidth={strokeWidth} />
        <polygon points="300,466 482,368 482,388 300,486" fill={rightFace} stroke={border} strokeWidth={strokeWidth} />
        <polygon points="300,270 482,368 300,466 118,368" fill={bgFill} stroke={border} strokeWidth={strokeWidth} />
        <image {...fusionLayerProps} x="118" y="270" width="364" height="196" clipPath="url(#clip-l2)" />
      </g>

      {/* Animated Shapes and Lines */}
      <AnimatedShapes bubbles={BUBBLES_L1} isVisible={isDataCollection} border={border} />
      <FusionLines isVisible={isFusion} offsetL2={offsetL2} />
      
      {/* Tetris Blocks Layer (Answers / Insights) */}
      <TetrisBlocks isVisible={isAnswers} />

      {/* Layer 1 */}
      <g id="layer1" style={{ opacity: getOpacity(0), transition: "opacity 0.4s ease" }}>
        <polygon points="50,138 300,270 300,290 50,158" fill={leftFace} stroke={border} strokeWidth={strokeWidth} />
        <polygon points="300,270 550,138 550,158 300,290" fill={rightFace} stroke={border} strokeWidth={strokeWidth} />
        <polygon points="300,6 550,138 300,270 50,138" fill={bgFill} stroke={border} strokeWidth={strokeWidth} />
        <image {...dataCollectionProps} x="50" y="6" width="500" height="264" clipPath="url(#clip-l1)" />
      </g>
    </svg>
  );
}
