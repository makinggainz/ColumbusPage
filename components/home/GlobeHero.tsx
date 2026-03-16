"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// ─── Data ────────────────────────────────────────────────────────────────────

interface DataPoint {
  id: number;
  lat: number;
  lon: number;
  label: string;
  type: string;
  value: string;
}

const TYPE_COLOR: Record<string, string> = {
  HQ:         "#ffffff",
  Urban:      "#1396F3",
  Finance:    "#22d3ee",
  Climate:    "#4ade80",
  Defence:    "#f87171",
  Logistics:  "#a78bfa",
  Seismic:    "#fb923c",
  Monitoring: "#94a3b8",
};

const NAMED_POINTS: DataPoint[] = [
  { id: 0,  lat:  38.9, lon:  -77.0, label: "Washington D.C.",  type: "HQ",        value: "GeoContext-1 Origin" },
  { id: 1,  lat:  40.7, lon:  -74.0, label: "New York",          type: "Finance",   value: "CRE delta: +2.3%" },
  { id: 2,  lat:  51.5, lon:   -0.1, label: "London",            type: "Finance",   value: "Asset exposure: $4.2T" },
  { id: 3,  lat:  48.9, lon:    2.3, label: "Paris",             type: "Climate",   value: "Heat anomaly: +1.8 °C" },
  { id: 4,  lat:  35.7, lon:  139.7, label: "Tokyo",             type: "Urban",     value: "Infrastructure score: 94.1" },
  { id: 5,  lat:  22.3, lon:  114.2, label: "Hong Kong",         type: "Logistics", value: "Port throughput: +12%" },
  { id: 6,  lat: -33.9, lon:  151.2, label: "Sydney",            type: "Climate",   value: "Coastal erosion: 0.8 m/yr" },
  { id: 7,  lat:  19.4, lon:  -99.1, label: "Mexico City",       type: "Urban",     value: "Subsidence: 28 cm/yr" },
  { id: 8,  lat: -23.5, lon:  -46.6, label: "São Paulo",         type: "Urban",     value: "Deforestation alert active" },
  { id: 9,  lat:  55.8, lon:   37.6, label: "Moscow",            type: "Defence",   value: "Sat pass: 14:22 UTC" },
  { id: 10, lat:   1.3, lon:  103.8, label: "Singapore",         type: "Logistics", value: "Vessel density: HIGH" },
  { id: 11, lat:  30.0, lon:   31.2, label: "Cairo",             type: "Climate",   value: "Nile delta: −4 cm H₂O" },
  { id: 12, lat:  28.6, lon:   77.2, label: "New Delhi",         type: "Urban",     value: "PM2.5 index: 187" },
  { id: 13, lat:  -1.3, lon:   36.8, label: "Nairobi",           type: "Climate",   value: "Drought severity: 0.72" },
  { id: 14, lat:  37.8, lon: -122.4, label: "San Francisco",     type: "Seismic",   value: "Seismic risk score: 8.2" },
  { id: 15, lat:  59.9, lon:   10.7, label: "Oslo",              type: "Climate",   value: "Arctic melt: 14 km²/mo" },
  { id: 16, lat: -34.6, lon:  -58.4, label: "Buenos Aires",      type: "Urban",     value: "Urban sprawl: +3.1%/yr" },
  { id: 17, lat:  41.0, lon:   29.0, label: "Istanbul",          type: "Logistics", value: "Strait: 48 k vessels/yr" },
  { id: 18, lat:  31.2, lon:  121.5, label: "Shanghai",          type: "Logistics", value: "Port rank: #1 globally" },
  { id: 19, lat:  25.2, lon:   55.3, label: "Dubai",             type: "Urban",     value: "Active construction: 412" },
  { id: 20, lat:  52.5, lon:   13.4, label: "Berlin",            type: "Urban",     value: "Smart grid nodes: 8,200" },
  { id: 21, lat:  43.7, lon:   -79.4, label: "Toronto",          type: "Urban",     value: "Permafrost boundary shift" },
  { id: 22, lat:  -26.2, lon:  28.0, label: "Johannesburg",      type: "Monitoring",value: "Mining footprint: +1.4%" },
  { id: 23, lat:  39.9, lon:  116.4, label: "Beijing",           type: "Defence",   value: "Infrastructure activity ↑" },
  { id: 24, lat:  -4.3, lon:   15.3, label: "Kinshasa",          type: "Climate",   value: "Deforestation: 0.9 Mha/yr" },
];

// Stable random points seeded by index so they don't regenerate on re-render
const RAND_TYPES = ["Monitoring", "Climate", "Urban", "Logistics", "Defence"];
const RAND_VALUES = [
  "Anomaly detected",
  "Change: +2.1%",
  "Activity nominal",
  "Pattern shift identified",
  "Baseline established",
  "Signal confidence: 91%",
  "Coverage gap closed",
];

function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const RANDOM_POINTS: DataPoint[] = Array.from({ length: 55 }, (_, i) => {
  const lat = seededRand(i * 3)     * 160 - 80;
  const lon = seededRand(i * 3 + 1) * 360 - 180;
  const typeIdx  = Math.floor(seededRand(i * 3 + 2) * RAND_TYPES.length);
  const valueIdx = Math.floor(seededRand(i * 7 + 5) * RAND_VALUES.length);
  const latStr = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? "N" : "S"}`;
  const lonStr = `${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? "E" : "W"}`;
  return {
    id: 100 + i,
    lat,
    lon,
    label: `${latStr}, ${lonStr}`,
    type:  RAND_TYPES[typeIdx],
    value: RAND_VALUES[valueIdx],
  };
});

const ALL_POINTS: DataPoint[] = [...NAMED_POINTS, ...RANDOM_POINTS];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function latLonToVec3(lat: number, lon: number, r = 1.01): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -Math.sin(phi) * Math.cos(theta),
     Math.cos(phi),
     Math.sin(phi) * Math.sin(theta),
  ).multiplyScalar(r);
}

// ─── Single dot ──────────────────────────────────────────────────────────────

function Dot({ point, onHover }: { point: DataPoint; onHover: (id: number | null) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const pos = useMemo(() => latLonToVec3(point.lat, point.lon), [point.lat, point.lon]);
  const color = TYPE_COLOR[point.type] ?? "#ffffff";
  const isNamed = point.id < 100;

  const handleOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    onHover(point.id);
  }, [point.id, onHover]);

  const handleOut = useCallback(() => {
    setHovered(false);
    onHover(null);
  }, [onHover]);

  useFrame(() => {
    if (!meshRef.current) return;
    const scale = hovered ? 2.2 : 1;
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, scale, 0.12)
    );
  });

  return (
    <mesh
      ref={meshRef}
      position={pos}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
    >
      <sphereGeometry args={[isNamed ? 0.018 : 0.011, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={hovered ? 1 : isNamed ? 0.75 : 0.45} />
      {hovered && (
        <Html
          center
          distanceFactor={4}
          style={{ pointerEvents: "none" }}
          zIndexRange={[100, 0]}
        >
          <div
            style={{
              background: "rgba(7, 7, 9, 0.92)",
              border: `1px solid ${color}33`,
              borderLeft: `2px solid ${color}`,
              padding: "10px 14px",
              borderRadius: "2px",
              minWidth: "180px",
              backdropFilter: "blur(12px)",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            <p style={{ color, fontSize: "9px", fontFamily: "monospace", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "4px", opacity: 0.9 }}>
              {point.type}
            </p>
            <p style={{ color: "#EDEDEA", fontSize: "13px", fontWeight: 500, marginBottom: "4px", lineHeight: 1.3 }}>
              {point.label}
            </p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px", fontFamily: "monospace" }}>
              {point.value}
            </p>
          </div>
        </Html>
      )}
    </mesh>
  );
}

// ─── Globe ───────────────────────────────────────────────────────────────────

function WireframeGlobe() {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const latLines = useMemo(() => {
    const lines: THREE.BufferGeometry[] = [];
    const steps = 13;
    for (let i = 0; i <= steps; i++) {
      const phi = (Math.PI / steps) * i;
      const radius = Math.sin(phi);
      const y = Math.cos(phi);
      if (radius < 0.01) continue;
      const pts: THREE.Vector3[] = [];
      for (let j = 0; j <= 128; j++) {
        const theta = (2 * Math.PI * j) / 128;
        pts.push(new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius));
      }
      lines.push(new THREE.BufferGeometry().setFromPoints(pts));
    }
    return lines;
  }, []);

  const lonLines = useMemo(() => {
    const lines: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 18; i++) {
      const theta = (2 * Math.PI * i) / 18;
      const pts: THREE.Vector3[] = [];
      for (let j = 0; j <= 128; j++) {
        const phi = (Math.PI * j) / 128;
        pts.push(new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta),
        ));
      }
      lines.push(new THREE.BufferGeometry().setFromPoints(pts));
    }
    return lines;
  }, []);

  const lineMat    = useMemo(() => new THREE.LineBasicMaterial({ color: "#1396F3", transparent: true, opacity: 0.14 }), []);
  const equatorMat = useMemo(() => new THREE.LineBasicMaterial({ color: "#1396F3", transparent: true, opacity: 0.32 }), []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x = 0.18;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Wireframe lines */}
      {latLines.map((geo, i) => (
        <primitive key={`lat-${i}`} object={new THREE.Line(geo, i === Math.floor(latLines.length / 2) ? equatorMat : lineMat)} />
      ))}
      {lonLines.map((geo, i) => (
        <primitive key={`lon-${i}`} object={new THREE.Line(geo, lineMat)} />
      ))}

      {/* Depth occluder — blocks hover on back-facing dots */}
      <mesh renderOrder={-1}>
        <sphereGeometry args={[0.995, 32, 32]} />
        <meshBasicMaterial colorWrite={false} />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[1.02, 64, 64]} />
        <meshBasicMaterial color="#1396F3" transparent opacity={0.022} side={THREE.BackSide} />
      </mesh>

      {/* Data points */}
      {ALL_POINTS.map((pt) => (
        <Dot key={pt.id} point={pt} onHover={setHoveredId} />
      ))}
    </group>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export function GlobeHero({ style }: { style?: React.CSSProperties }) {
  return (
    <div className="w-full h-full" style={{ minHeight: "500px", ...style }}>
      <Canvas
        camera={{ position: [0, 0, 2.6], fov: 45 }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <WireframeGlobe />
      </Canvas>
    </div>
  );
}
