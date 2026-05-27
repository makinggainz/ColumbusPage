/**
 * Minimalist world map using white lines and dots
 * Simplified line art representation of continents and key locations
 */

export function WorldMapLineArt() {
  return (
    <svg
      viewBox="0 0 1000 600"
      width="100%"
      height="100%"
      style={{
        maxWidth: "100%",
        height: "auto",
      }}
      aria-hidden="true"
    >
      {/* North America */}
      <path
        d="M 120 180 L 140 160 L 160 170 L 180 150 L 190 180 L 170 200 L 150 210 L 120 200 Z"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />

      {/* South America */}
      <path
        d="M 160 280 L 180 260 L 190 300 L 185 340 L 165 350 L 155 310 Z"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />

      {/* Europe */}
      <path
        d="M 360 140 L 380 130 L 400 140 L 390 160 L 370 165 L 350 155 Z"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />

      {/* Africa */}
      <path
        d="M 400 200 L 430 190 L 450 210 L 460 260 L 440 300 L 410 310 L 400 280 L 390 240 Z"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />

      {/* Asia */}
      <path
        d="M 480 100 L 550 90 L 600 110 L 620 140 L 580 160 L 520 150 L 480 130 Z"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M 580 160 L 620 140 L 650 180 L 640 220 L 600 200 Z"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />

      {/* Australia */}
      <path
        d="M 720 320 L 750 310 L 760 340 L 740 360 L 710 350 Z"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />

      {/* Dots representing major cities/locations */}
      <circle cx="140" cy="190" r="3" fill="white" />
      <circle cx="370" cy="150" r="3" fill="white" />
      <circle cx="420" cy="250" r="3" fill="white" />
      <circle cx="520" cy="120" r="3" fill="white" />
      <circle cx="610" cy="170" r="3" fill="white" />
      <circle cx="740" cy="330" r="3" fill="white" />
      <circle cx="170" cy="300" r="3" fill="white" />

      {/* Connecting latitude/longitude lines */}
      <line x1="200" y1="0" x2="200" y2="600" stroke="white" strokeWidth="1" opacity="0.3" />
      <line x1="400" y1="0" x2="400" y2="600" stroke="white" strokeWidth="1" opacity="0.3" />
      <line x1="600" y1="0" x2="600" y2="600" stroke="white" strokeWidth="1" opacity="0.3" />
      <line x1="0" y1="150" x2="1000" y2="150" stroke="white" strokeWidth="1" opacity="0.3" />
      <line x1="0" y1="300" x2="1000" y2="300" stroke="white" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}
