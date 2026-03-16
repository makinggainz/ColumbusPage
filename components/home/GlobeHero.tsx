"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function WireframeGlobe() {
  const groupRef = useRef<THREE.Group>(null);

  // Latitude lines
  const latLines = useMemo(() => {
    const lines: THREE.BufferGeometry[] = [];
    const steps = 13; // number of latitude rings
    for (let i = 0; i <= steps; i++) {
      const phi = (Math.PI / steps) * i; // 0 to PI
      const radius = Math.sin(phi);
      const y = Math.cos(phi);
      if (radius < 0.01) continue;
      const points: THREE.Vector3[] = [];
      const segs = 128;
      for (let j = 0; j <= segs; j++) {
        const theta = (2 * Math.PI * j) / segs;
        points.push(new THREE.Vector3(
          Math.cos(theta) * radius,
          y,
          Math.sin(theta) * radius
        ));
      }
      lines.push(new THREE.BufferGeometry().setFromPoints(points));
    }
    return lines;
  }, []);

  // Longitude lines
  const lonLines = useMemo(() => {
    const lines: THREE.BufferGeometry[] = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const theta = (2 * Math.PI * i) / count;
      const points: THREE.Vector3[] = [];
      const segs = 128;
      for (let j = 0; j <= segs; j++) {
        const phi = (Math.PI * j) / segs;
        points.push(new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta)
        ));
      }
      lines.push(new THREE.BufferGeometry().setFromPoints(points));
    }
    return lines;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x = 0.18; // slight tilt
    }
  });

  const lineMaterial = new THREE.LineBasicMaterial({
    color: "#1396F3",
    transparent: true,
    opacity: 0.18,
  });

  const equatorMaterial = new THREE.LineBasicMaterial({
    color: "#1396F3",
    transparent: true,
    opacity: 0.38,
  });

  return (
    <group ref={groupRef}>
      {latLines.map((geo, i) => (
        <line key={`lat-${i}`} geometry={geo} material={i === Math.floor(latLines.length / 2) ? equatorMaterial : lineMaterial} />
      ))}
      {lonLines.map((geo, i) => (
        <line key={`lon-${i}`} geometry={geo} material={lineMaterial} />
      ))}
      {/* Outer glow sphere */}
      <mesh>
        <sphereGeometry args={[1.005, 64, 64]} />
        <meshBasicMaterial
          color="#1396F3"
          transparent
          opacity={0.025}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

export function GlobeHero({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      className="w-full h-full"
      style={{ minHeight: "500px", ...style }}
    >
      <Canvas
        camera={{ position: [0, 0, 2.6], fov: 45 }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <WireframeGlobe />
      </Canvas>
    </div>
  );
}
