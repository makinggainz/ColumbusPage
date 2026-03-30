"use client";

import { useRef, useEffect, useCallback } from "react";

interface MapsGPTGlobeProps {
  size?: number;
}

/* ─── WebGL helpers ─── */

const VERT = `
  attribute vec3 aPos;
  uniform mat4 uMVP;
  varying vec3 vNorm;
  void main(){
    vNorm = normalize(aPos);
    gl_Position = uMVP * vec4(aPos, 1.0);
  }
`;

const FRAG = `
  precision mediump float;
  uniform sampler2D uTex;
  uniform float     uHasTex;
  varying vec3 vNorm;
  void main(){
    vec3 n = normalize(vNorm);

    // Local-space lighting — fixed to sphere surface, rotation-independent
    vec3 keyDir  = normalize(vec3(0.0, 0.5, 1.0));
    float key    = max(dot(n, keyDir), 0.0);
    vec3 fillDir = normalize(vec3(0.0, 0.0, -1.0));
    float fill   = max(dot(n, fillDir), 0.0) * 0.4;
    float amb    = 0.55;
    float lit    = amb + key * 0.4 + fill;

    // Front-face decal projection
    vec2 decalUV = vec2(-n.x * 0.5 + 0.5, -n.y * 0.5 + 0.5);
    vec4 texCol  = texture2D(uTex, decalUV);

    // Only show texture on front hemisphere (facing camera after PI rotation)
    float front = smoothstep(0.0, 0.3, -n.z);

    // Base color: light blue matching logo
    vec3 base = vec3(0.4, 0.7, 0.85);
    vec3 col  = mix(base, texCol.rgb, front * uHasTex);

    // Subtle specular
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(keyDir + viewDir);
    float spec   = pow(max(dot(n, halfDir), 0.0), 32.0) * 0.2;

    // Rim glow — light blue tint
    float rim = 1.0 - max(dot(n, viewDir), 0.0);
    rim = pow(rim, 3.0) * 0.25;

    gl_FragColor = vec4(col * lit + vec3(spec) + vec3(rim * 0.5, rim * 0.7, rim * 0.85), 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(s));
  }
  return s;
}

function createProgram(gl: WebGLRenderingContext) {
  const p = gl.createProgram()!;
  gl.attachShader(p, createShader(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, createShader(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(p));
  }
  return p;
}

/** Build a UV sphere mesh. Returns {positions, uvs, indices}. */
function buildSphere(rings: number, sectors: number) {
  const pos: number[] = [];
  const idx: number[] = [];

  for (let r = 0; r <= rings; r++) {
    const phi = (Math.PI * r) / rings;
    const sinP = Math.sin(phi);
    const cosP = Math.cos(phi);
    for (let s = 0; s <= sectors; s++) {
      const theta = (2 * Math.PI * s) / sectors;
      const x = sinP * Math.cos(theta);
      const y = cosP;
      const z = sinP * Math.sin(theta);
      pos.push(x, y, z);
    }
  }
  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < sectors; s++) {
      const a = r * (sectors + 1) + s;
      const b = a + sectors + 1;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  return {
    positions: new Float32Array(pos),
    indices: new Uint16Array(idx),
  };
}

/** 4×4 matrix helpers (column-major) */
function mat4Identity(): Float32Array {
  const m = new Float32Array(16);
  m[0] = m[5] = m[10] = m[15] = 1;
  return m;
}
function mat4Perspective(fov: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fov / 2);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = (far + near) / (near - far);
  m[11] = -1;
  m[14] = (2 * far * near) / (near - far);
  return m;
}
function mat4Mul(a: Float32Array, b: Float32Array) {
  const o = new Float32Array(16);
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[i + k * 4] * b[k + j * 4];
      o[i + j * 4] = s;
    }
  return o;
}
function mat4RotX(a: number) {
  const m = mat4Identity();
  const c = Math.cos(a), s = Math.sin(a);
  m[5] = c; m[6] = s; m[9] = -s; m[10] = c;
  return m;
}
function mat4RotY(a: number) {
  const m = mat4Identity();
  const c = Math.cos(a), s = Math.sin(a);
  m[0] = c; m[2] = -s; m[8] = s; m[10] = c;
  return m;
}

export default function MapsGPTGlobe({ size = 67 }: MapsGPTGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rotRef = useRef({ x: 0, y: 0 });         // target rotation (radians)
  const curRef = useRef({ x: 0, y: 0 });          // current (smoothed)
  const rafRef = useRef<number>(0);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const texLoadedRef = useRef(false);
  const indexCountRef = useRef(0);

  /* ── mouse tracking ── */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (window.innerWidth / 2);
    const dy = (e.clientY - cy) / (window.innerHeight / 2);
    const max = 0.45; // ~25 degrees in radians
    rotRef.current = {
      x:  Math.max(-1, Math.min(1, dy)) * max,
      y:  Math.max(-1, Math.min(1, dx)) * max,
    };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  /* ── WebGL init + render loop ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;
    glRef.current = gl;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);

    // Program
    const prog = createProgram(gl);
    gl.useProgram(prog);
    programRef.current = prog;

    // Sphere geometry
    const sphere = buildSphere(32, 32);
    indexCountRef.current = sphere.indices.length;

    const posBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, sphere.positions, gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    const idxBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere.indices, gl.STATIC_DRAW);

    // Texture
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    // 1×1 placeholder
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([15, 25, 40, 255]));
    gl.uniform1f(gl.getUniformLocation(prog, "uHasTex"), 0);

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.uniform1f(gl.getUniformLocation(prog, "uHasTex"), 1);
      texLoadedRef.current = true;
    };
    img.src = "/MapsGPT-logo.png";

    // Projection matrix (stays constant)
    const proj = mat4Perspective(Math.PI / 6, 1, 0.1, 10);
    // Camera at z=3.2 looking at origin
    const view = mat4Identity();
    view[14] = -3.2; // translate z

    const uMVP = gl.getUniformLocation(prog, "uMVP");

    // Render loop
    const lerp = 0.12;
    function frame() {
      if (!gl) return;
      // Smooth interpolation toward target rotation
      curRef.current.x += (rotRef.current.x - curRef.current.x) * lerp;
      curRef.current.y += (rotRef.current.y - curRef.current.y) * lerp;

      // Base PI rotation flips the textured hemisphere toward the camera
      const base = mat4RotY(Math.PI);
      const model = mat4Mul(mat4RotY(curRef.current.y), mat4Mul(mat4RotX(curRef.current.x), base));
      const mvp = mat4Mul(proj, mat4Mul(view, model));

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(uMVP, false, mvp);
      gl.drawElements(gl.TRIANGLES, indexCountRef.current, gl.UNSIGNED_SHORT, 0);

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [size]);

  return (
    <div
      ref={containerRef}
      style={{
        width: size,
        height: size,
        display: "inline-block",
        flexShrink: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          display: "block",
        }}
      />
    </div>
  );
}
