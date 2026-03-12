"use client";

/**
 * Section C: Columbus scroll — faithful port from columbus-scroll-REFERENCE.html
 * One component, imperative ref-based animation, no Framer Motion / IntersectionObserver.
 */

import { useEffect, useRef } from "react";

// ─── Helpers (from reference) ─────────────────────────────────────────────
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const norm = (v: number, lo: number, hi: number) => clamp((v - lo) / (hi - lo), 0, 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;

function getProgress(track: HTMLElement, scroller: HTMLElement): number {
  let top = 0;
  let el: HTMLElement | null = track;
  while (el) {
    top += el.offsetTop;
    el = el.offsetParent as HTMLElement | null;
  }
  const range = track.offsetHeight - window.innerHeight;
  return clamp((scroller.scrollTop - top) / range, 0, 1);
}

// ─── Phase maps (from prompt) ──────────────────────────────────────────────
const PH = {
  A: [0, 180 / 1560],
  B: [180 / 1560, 460 / 1560],
  C: [460 / 1560, 840 / 1560],
  D: [840 / 1560, 1060 / 1560],
  E: [1060 / 1560, 1280 / 1560],
  F: [1280 / 1560, 1.0],
};

const PHgk = {
  G: [0, 180 / 640],
  H: [180 / 640, 420 / 640],
  IJ: [420 / 640, 1.0],
};

const PHRASE_D = "So we said bye to the noise";

// ─── Static mocks (from reference HTML) ────────────────────────────────────
function ArcGISMock() {
  return (
    <div
      className="h-full w-full grid overflow-hidden text-[10px] text-[#ccc]"
      style={{
        background: "#2b2b35",
        gridTemplateRows: "32px 1fr",
        gridTemplateColumns: "160px 1fr 140px",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      <div
        className="col-span-3 flex items-center px-2 gap-2 text-[8px] text-[#aaa]"
        style={{
          background: "linear-gradient(180deg,#3c3c50,#2e2e40)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span>ArcGIS Pro — Map1</span>
        <span className="ml-auto opacity-40">Not signed in</span>
      </div>
      <div className="p-2 overflow-hidden bg-[#252530] border-r border-white/10 text-[8px] text-[#aaa]">
        <div className="text-[9px] font-semibold mb-1">Contents</div>
        <div className="flex items-center gap-1 mb-0.5">
          <div className="w-2 h-2 rounded-sm bg-[#5a8a5a] flex-shrink-0" />
          coconut_Trees
        </div>
        <div className="flex items-center gap-1 mb-2">
          <div className="w-2 h-2 rounded-sm bg-[#4a9a4a] flex-shrink-0" />
          coconut_Stats
        </div>
        <div className="text-[7px] text-[#666] mb-1">LEGEND</div>
        <div className="flex items-center gap-1 text-[7px]">
          <div className="w-[7px] h-[7px] rounded-sm bg-[#c0392b] flex-shrink-0" />
          Needs Inspection
        </div>
        <div className="flex items-center gap-1 text-[7px]">
          <div className="w-[7px] h-[7px] rounded-sm bg-[#f39c12] flex-shrink-0" />
          Relatively healthy
        </div>
        <div className="flex items-center gap-1 text-[7px]">
          <div className="w-[7px] h-[7px] rounded-sm bg-[#27ae60] flex-shrink-0" />
          Healthy
        </div>
      </div>
      <div className="bg-[#2d3a2d] relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 30%,#3d6e3d,transparent 30%),radial-gradient(circle at 70% 60%,#4a7a4a,transparent 25%),#2d3a2d",
          }}
        />
      </div>
      <div className="p-2 bg-[#252530] border-l border-white/10 text-[8px] text-[#777]">
        <div className="text-[9px] font-semibold text-[#aaa] mb-1">Catalog</div>
        <div>📁 Maps</div>
        <div>🔧 Toolboxes</div>
        <div>🗄 Databases</div>
      </div>
    </div>
  );
}

function ColumbusUIMock() {
  return (
    <div
      className="w-full overflow-hidden grid bg-[#f7f7f9] font-['DM_Sans',sans-serif] text-[#333]"
      style={{
        gridTemplateColumns: "48px 1fr",
        gridTemplateRows: "44px 1fr",
        aspectRatio: "16/9",
        fontSize: 11,
      }}
    >
      <div className="col-span-2 flex items-center gap-2 px-3 bg-white border-b border-[#e8e8f0]">
        <span className="text-[10px] text-[#aaa]">≡</span>
        <div className="flex items-center gap-1 text-[12px] font-bold text-[#0e1f5e]">
          <div className="w-5 h-5 rounded-md bg-[#0e1f5e] flex items-center justify-center flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
          </div>
          Columbus
        </div>
        <span className="text-[10px] text-[#aaa] font-normal">/ untitled chat</span>
        <div className="ml-auto flex gap-1.5">
          <div className="px-2 py-0.5 rounded bg-white border border-[#ddd] text-[9px] text-[#444]">
            ⎘ Report View
          </div>
          <div className="px-2 py-0.5 rounded bg-white border border-[#ddd] text-[9px] text-[#444]">
            ⤢ Save Mapshot
          </div>
          <div className="px-2 py-0.5 rounded bg-[#f5f5f5] border border-[#e0e0e0] text-[9px] text-[#888]">
            Edits not saved
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 py-2 bg-white border-r border-[#e8e8f0]">
        <div className="w-7 h-7 rounded-lg bg-[#f0f0f8] flex items-center justify-center text-sm">⊞</div>
        <div className="w-7 h-7 rounded-lg bg-[#0e1f5e] text-white flex items-center justify-center text-sm">◎</div>
        <div className="w-7 h-7 rounded-lg bg-[#f0f0f8] flex items-center justify-center text-sm">✏️</div>
        <div className="w-7 h-7 rounded-lg bg-[#f0f0f8] flex items-center justify-center text-sm">🗄</div>
      </div>
      <div className="grid bg-white" style={{ gridTemplateColumns: "240px 1fr" }}>
        <div className="flex items-center justify-center font-semibold text-[11px] text-[#0e1f5e] px-4 border-r border-[#e8e8f0]">
          Where should we begin?
        </div>
        <div className="bg-[#e4ecf5] relative overflow-hidden" />
      </div>
    </div>
  );
}

function HoloDots() {
  return (
    <div
      className="absolute inset-0 opacity-80"
      style={{
        backgroundImage: "radial-gradient(circle,rgba(64,160,255,.4) 2px,transparent 2px)",
        backgroundSize: "60px 60px",
        animation: "holoDrift 8s linear infinite",
      }}
    />
  );
}

export default function SectionCScroll() {
  const scroller = typeof document !== "undefined" ? document.documentElement : null;

  const trackAF = useRef<HTMLDivElement>(null);
  const trackGK = useRef<HTMLDivElement>(null);
  const trackLM = useRef<HTMLDivElement>(null);

  const elA = useRef<HTMLParagraphElement>(null);
  const layerB = useRef<HTMLDivElement>(null);
  const elBHl = useRef<HTMLDivElement>(null);
  const elBImg = useRef<HTMLDivElement>(null);
  const layerC = useRef<HTMLDivElement>(null);
  const elCWrap = useRef<HTMLDivElement>(null);
  const cWords = useRef<(HTMLSpanElement | null)[]>([null, null, null, null, null]);
  const layerD = useRef<HTMLDivElement>(null);
  const elDGif = useRef<HTMLDivElement>(null);
  const elDText = useRef<HTMLDivElement>(null);
  const refDChars = useRef<(HTMLSpanElement | null)[]>([]);
  const layerE = useRef<HTMLDivElement>(null);
  const eWords = useRef<(HTMLSpanElement | null)[]>([null, null, null, null, null]);
  const layerF = useRef<HTMLDivElement>(null);
  const elFImg = useRef<HTMLDivElement>(null);
  const elFTxt = useRef<HTMLDivElement>(null);

  const layerG = useRef<HTMLDivElement>(null);
  const elGQuote = useRef<HTMLQuoteElement>(null);
  const elGAttr = useRef<HTMLDivElement>(null);
  const layerH = useRef<HTMLDivElement>(null);
  const elHLabels = useRef<HTMLDivElement>(null);
  const elHPanels = useRef<HTMLDivElement>(null);
  const layerIJ = useRef<HTMLDivElement>(null);
  const ijBg = useRef<HTMLDivElement>(null);
  const ijGif = useRef<HTMLDivElement>(null);
  const ijOverlay = useRef<HTMLDivElement>(null);
  const ijHl = useRef<HTMLParagraphElement>(null);
  const ijSub = useRef<HTMLParagraphElement>(null);

  const lmGifWrap = useRef<HTMLDivElement>(null);
  const lmGif = useRef<HTMLDivElement>(null);
  const lmWords = useRef<(HTMLSpanElement | null)[]>([null, null, null]);
  const lmSubs = useRef<(HTMLSpanElement | null)[]>([null, null, null, null]);

  function layoutTracks() {
    if (trackAF.current)
      trackAF.current.style.height = (1560 * window.innerHeight) / 100 + "px";
    if (trackGK.current)
      trackGK.current.style.height = (560 * window.innerHeight) / 100 + "px";
    if (trackLM.current)
      trackLM.current.style.height = (340 * window.innerHeight) / 100 + "px";
  }

  function updateAF() {
    if (!scroller || !trackAF.current) return;
    const p = getProgress(trackAF.current, scroller);
    const vh = window.innerHeight;

    const s = (el: { current: HTMLElement | null }, style: Partial<CSSStyleDeclaration>) => {
      if (el.current) Object.assign(el.current.style, style);
    };

    // ── A ──
    const pA = norm(p, PH.A[0], PH.A[1]);
    const aOp = easeOut(norm(pA, 0, 0.3)) * (1 - easeIn(norm(pA, 0.7, 1.0)));
    s(elA, { opacity: String(aOp), transform: `translateY(${lerp(28, 0, easeOut(norm(pA, 0, 0.3)))}px)` });

    // ── B ──
    const pB = norm(p, PH.B[0], PH.B[1]);
    if (layerB.current) layerB.current.style.opacity = String(easeOut(norm(pB, 0, 0.15)));
    const bIn = easeOut(norm(pB, 0, 0.22));
    s(elBHl, { opacity: String(bIn), transform: `translateY(${lerp(56, 0, bIn)}px)` });
    s(elBImg, {
      opacity: String(bIn),
      transform: `translateY(${lerp(110, 0, bIn)}px) scale(${lerp(1.5, 1.0, bIn)})`,
    });
    if (pB > 0.65) {
      const bOut = easeIn(norm(pB, 0.65, 1.0));
      s(elBHl, { opacity: String(1 - bOut), transform: `translateY(${lerp(0, -80, bOut)}px)` });
      s(elBImg, {
        opacity: String(1 - bOut),
        transform: `translateY(${lerp(0, -48, bOut)}px) scale(${lerp(1.0, 0.7, bOut)})`,
      });
    }

    // ── C ──
    const pC = norm(p, PH.C[0], PH.C[1]);
    const cIn = easeOut(norm(pC, 0, 0.07));
    if (layerC.current) layerC.current.style.opacity = String(cIn);
    if (elCWrap.current) elCWrap.current.style.opacity = String(cIn);
    const ITEM_H = vh * 0.13;
    const anchorY = vh * 0.5;
    const scrollPos = lerp(0, 4, easeOut(norm(pC, 0.04, 0.94)));
    const palette = ["#e05555", "#d44444", "#b83838", "#9a2e2e", "#7a2424"];
    cWords.current.forEach((w, i) => {
      if (!w) return;
      const dist = i - scrollPos;
      const abs = Math.abs(dist);
      w.style.color = palette[i] ?? palette[4];
      w.style.top = "0px";
      w.style.transform = `translateY(${anchorY + dist * ITEM_H}px) scaleY(${Math.max(0.4, 1 - abs * 0.18)})`;
      w.style.opacity = String(
        Math.max(0, Math.min(1, Math.max(0, 1 - abs * 0.38) * Math.max(0, 1 - dist * 0.12)))
      );
    });

    // ── D ──
    const dSlide = easeOut(norm(p, PH.D[0], PH.D[0] + (PH.D[1] - PH.D[0]) * 0.09));
    if (layerD.current) layerD.current.style.transform = `translateY(${lerp(vh, 0, dSlide)}px)`;

    const pD = norm(p, PH.D[0], PH.D[1]);
    const dPinchIn = easeOut(norm(pD, 0.09, 0.22));
    s(elDGif, { opacity: String(dPinchIn), transform: `translateY(${lerp(28, 0, dPinchIn)}px)` });
    if (pD > 0.44) {
      const dPinchOut = easeIn(norm(pD, 0.44, 0.56));
      s(elDGif, { transform: `scaleX(${1 - dPinchOut})`, opacity: String(1 - dPinchOut) });
    }
    const dTextIn = easeOut(norm(pD, 0.14, 0.28));
    s(elDText, { opacity: String(dTextIn), transform: "scaleX(1)" });
    if (pD > 0.44) {
      const dTextOut = easeIn(norm(pD, 0.44, 0.56));
      s(elDText, { transform: `scaleX(${1 - dTextOut})`, opacity: String(1 - dTextOut) });
    }
    refDChars.current.forEach((sp) => {
      if (sp) sp.style.opacity = "1";
    });

    // ── E ──
    const eSlide = easeOut(norm(p, PH.E[0], PH.E[0] + (PH.E[1] - PH.E[0]) * 0.09));
    if (layerE.current) layerE.current.style.transform = `translateY(${lerp(vh, 0, eSlide)}px)`;

    const pE = norm(p, PH.E[0], PH.E[1]);
    const eFade = easeIn(norm(p, PH.F[0], PH.F[0] + (PH.F[1] - PH.F[0]) * 0.28));
    [0.0, 0.1, 0.19, 0.27, 0.35].forEach((thr, i) => {
      const t = easeOut(norm(pE, thr, thr + 0.14));
      const el = eWords.current[i];
      if (el) {
        el.style.opacity = String(t * (1 - eFade));
        el.style.transform = `translateY(${lerp(32, 0, t)}px)`;
      }
    });

    // ── F ──
    const pF = norm(p, PH.F[0], PH.F[1]);
    if (layerF.current) layerF.current.style.opacity = String(easeOut(norm(pF, 0, 0.15)));
    const fImgT = easeOut(norm(pF, 0, 0.5));
    s(elFImg, {
      opacity: String(easeOut(norm(pF, 0, 0.2))),
      transform: `scale(${lerp(1.75, 1.0, fImgT)})`,
    });
    const fTxt = easeOut(norm(pF, 0.35, 0.62));
    s(elFTxt, { opacity: String(fTxt), transform: `translateY(${lerp(24, 0, fTxt)}px)` });
  }

  function updateGK() {
    if (!scroller || !trackGK.current) return;
    const p = getProgress(trackGK.current, scroller);
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const s = (el: { current: HTMLElement | null }, style: Partial<CSSStyleDeclaration>) => {
      if (el.current) Object.assign(el.current.style, style);
    };

    const pG = norm(p, PHgk.G[0], PHgk.G[1]);
    const gIn = easeOut(norm(pG, 0, 0.22));
    s(elGQuote, { opacity: String(gIn) });
    s(elGAttr, { opacity: String(easeOut(norm(pG, 0.1, 0.3))) });
    if (pG > 0.7) {
      const gOut = easeIn(norm(pG, 0.7, 0.88));
      s(elGQuote, { opacity: String(Math.max(0, gIn * (1 - gOut))) });
      s(elGAttr, { opacity: String(Math.max(0, gIn * (1 - gOut))) });
    }

    const hSlide = easeOut(norm(p, PHgk.H[0], PHgk.H[0] + (PHgk.H[1] - PHgk.H[0]) * 0.1));
    if (layerH.current) layerH.current.style.transform = `translateY(${lerp(vh, 0, hSlide)}px)`;

    const pH = norm(p, PHgk.H[0], PHgk.H[1]);
    const hIn = easeOut(norm(pH, 0.1, 0.3));
    s(elHLabels, { opacity: String(hIn), transform: `translateY(${lerp(60, 0, hIn)}px)` });
    s(elHPanels, { opacity: String(hIn), transform: `translateY(${lerp(80, 0, hIn)}px)` });

    const pIJ = norm(p, PHgk.IJ[0], PHgk.IJ[1]);
    if (layerIJ.current) layerIJ.current.style.opacity = String(easeOut(norm(pIJ, 0, 0.08)));

    const ijOverlayOp = Math.max(0, 1 - easeOut(norm(pIJ, 0, 0.18)) * 1.2);
    s(ijOverlay, { opacity: String(ijOverlayOp) });
    s(ijHl, { opacity: String(easeOut(norm(pIJ, 0.1, 0.28))) });

    const shrinkT = easeOut(norm(pIJ, 0.35, 0.68));
    const cardW = Math.min(vw * 0.48, 520);
    const cardH = cardW * (9 / 16);
    const gifW = lerp(vw, cardW, shrinkT);
    const gifH = lerp(vh, cardH, shrinkT);
    const gifTop = lerp(0, vh * 0.12, shrinkT);
    const gifLeft = (vw - gifW) / 2;

    if (ijGif.current) {
      Object.assign(ijGif.current.style, {
        width: gifW + "px",
        height: gifH + "px",
        left: gifLeft + "px",
        top: gifTop + "px",
        borderRadius: lerp(0, 18, shrinkT) + "px",
        boxShadow:
          shrinkT > 0.1
            ? `0 ${lerp(0, 30, shrinkT)}px ${lerp(0, 80, shrinkT)}px rgba(0,0,0,${lerp(0, 0.35, shrinkT)})`
            : "none",
      });
    }

    const bgR = Math.round(lerp(0, 240, shrinkT));
    const bgG2 = Math.round(lerp(0, 236, shrinkT));
    const bgB = Math.round(lerp(0, 228, shrinkT));
    s(ijBg, { background: `rgb(${bgR},${bgG2},${bgB})` });
    if (layerIJ.current) layerIJ.current.style.background = `rgb(${bgR},${bgG2},${bgB})`;

    const hlR = Math.round(lerp(190, 20, shrinkT));
    const hlG2 = Math.round(lerp(220, 20, shrinkT));
    const hlB = Math.round(lerp(255, 20, shrinkT));
    const hlY = lerp(vh / 2, gifTop + gifH + 20, shrinkT);
    if (ijHl.current) {
      Object.assign(ijHl.current.style, {
        color: `rgb(${hlR},${hlG2},${hlB})`,
        fontSize: `clamp(18px,${lerp(3.5, 2.2, shrinkT)}vw,${lerp(48, 28, shrinkT)}px)`,
        top: hlY + "px",
        left: "50%",
        transform: "translateX(-50%)",
      });
    }

    const subIn = easeOut(norm(pIJ, 0.68, 0.85));
    if (ijSub.current) {
      Object.assign(ijSub.current.style, {
        opacity: String(subIn),
        top: gifTop + gifH + lerp(60, 80, shrinkT) + "px",
        left: "50%",
        transform: `translateX(-50%) translateY(${lerp(20, 0, subIn)}px)`,
      });
    }
  }

  function updateLM() {
    if (!scroller || !trackLM.current) return;
    const p = getProgress(trackLM.current, scroller);

    const gifT = easeOut(norm(p, 0, 0.2));
    const gifW = Math.round(lerp(140, 400, gifT));
    const gifH = Math.round(gifW * (9 / 16));
    if (lmGif.current) {
      lmGif.current.style.width = gifW + "px";
      lmGif.current.style.height = gifH + "px";
    }
    if (lmGifWrap.current) lmGifWrap.current.style.opacity = String(easeOut(norm(p, 0, 0.15)));

    const wThresh = [0.22, 0.3, 0.37];
    lmWords.current.forEach((w, i) => {
      if (!w) return;
      const t = easeOut(norm(p, wThresh[i], wThresh[i] + 0.1));
      w.style.opacity = String(t);
      w.style.transform = `translateY(${lerp(40, 0, t)}px)`;
    });

    const sThresh = [0.48, 0.54, 0.6, 0.66];
    lmSubs.current.forEach((w, i) => {
      if (!w) return;
      const t = easeOut(norm(p, sThresh[i], sThresh[i] + 0.08));
      w.style.opacity = String(t);
      w.style.transform = `translateY(${lerp(25, 0, t)}px)`;
    });
  }

  useEffect(() => {
    let pending = false;
    const onScroll = () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          pending = false;
          updateAF();
          updateGK();
          updateLM();
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      layoutTracks();
      updateAF();
      updateGK();
      updateLM();
    });
    layoutTracks();
    updateAF();
    updateGK();
    updateLM();
    return () => window.removeEventListener("scroll", onScroll);
  });

  return (
    <>
      <style>{`
        @keyframes holoDrift { from { background-position: 0 0 } to { background-position: 60px 60px } }
        @keyframes holoSpin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .ij-holo { background-image: radial-gradient(circle,rgba(64,160,255,.4) 2px,transparent 2px); background-size: 60px 60px; animation: holoDrift 8s linear infinite; }
        .ij-ring { position: absolute; border-radius: 50%; border: 2px solid rgba(64,160,255,.5); animation: holoSpin 3s linear infinite; }
      `}</style>

      {/* ═══ Section AF ═══ */}
      <div ref={trackAF} className="relative">
        <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ position: "sticky" }}>
          {/* A */}
          <div
            className="absolute inset-0 flex items-center justify-center z-[1] bg-black"
            style={{ position: "absolute" }}
          >
            <p
              ref={elA}
              className="text-center font-light text-white/85"
              style={{
                fontSize: "clamp(16px,2vw,24px)",
                letterSpacing: "-0.01em",
                opacity: 0,
              }}
            >
              We&apos;ve simplified your GIS life.
            </p>
          </div>

          {/* B */}
          <div
            ref={layerB}
            className="absolute inset-0 flex flex-col items-center justify-center gap-7 z-[2] bg-black"
            style={{ opacity: 0 }}
          >
            <div
              ref={elBHl}
              className="text-center font-normal text-white/70"
              style={{ fontSize: "clamp(18px,2.5vw,32px)", letterSpacing: "-0.02em", opacity: 0 }}
            >
              This is your Legacy GIS
            </div>
            <div
              ref={elBImg}
              className="rounded-lg overflow-hidden border border-white/10 bg-[#1a1a1a] shadow-2xl"
              style={{
                width: "clamp(260px,52vw,660px)",
                aspectRatio: "16/10",
                boxShadow: "0 40px 120px rgba(0,0,0,0.9)",
                opacity: 0,
              }}
            >
              <ArcGISMock />
            </div>
          </div>

          {/* C */}
          <div
            ref={layerC}
            className="absolute inset-0 z-[3] bg-black items-stretch"
            style={{ opacity: 0, display: "flex", alignItems: "stretch" }}
          >
            <div
              ref={elCWrap}
              className="absolute inset-0 flex items-center pl-[8vw] gap-[clamp(20px,3.5vw,52px)]"
              style={{ opacity: 0 }}
            >
              <span
                className="text-white font-bold whitespace-nowrap flex-shrink-0"
                style={{ fontSize: "clamp(26px,3.8vw,50px)", letterSpacing: "-0.03em" }}
              >
                Legacy GIS is
              </span>
              <div
                className="relative h-screen w-[60vw] max-w-[860px] overflow-hidden"
                style={{
                  WebkitMaskImage: "linear-gradient(to bottom,transparent 0%,black 22%,black 78%,transparent 100%)",
                  maskImage: "linear-gradient(to bottom,transparent 0%,black 22%,black 78%,transparent 100%)",
                }}
              >
                {["bulky,", "poorly designed,", "lame, complex,", "high-storage occupying,", "limited"].map(
                  (word, i) => (
                    <span
                      key={i}
                      ref={(el) => {
                        if (el) cWords.current[i] = el;
                      }}
                      className="absolute left-0 font-bold whitespace-nowrap"
                      style={{
                        fontSize: "clamp(34px,5.2vw,72px)",
                        letterSpacing: "-0.04em",
                        transformOrigin: "left center",
                        willChange: "transform,opacity",
                        opacity: 0,
                        color: "#e05555",
                      }}
                    >
                      {word}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* D — card slides up */}
          <div
            ref={layerD}
            className="absolute inset-0 flex flex-col items-center justify-center gap-0 z-[4] bg-white"
            style={{ transform: "translateY(100vh)" }}
          >
            <div
              ref={elDGif}
              className="w-[clamp(220px,38vw,480px)] rounded-xl overflow-hidden flex-shrink-0 -mb-4 relative origin-center bg-[#111]"
              style={{
                aspectRatio: "16/10",
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                opacity: 0,
              }}
            >
              <HoloDots />
              <div className="absolute inset-0 flex items-center justify-center z-[2]">
                <div
                  className="w-[55%] h-[85%]"
                  style={{
                    background: "linear-gradient(180deg,#3a3a3a,#2a2a2a)",
                    clipPath: "polygon(15% 0%,85% 0%,100% 8%,100% 100%,0% 100%,0% 8%)",
                  }}
                />
              </div>
              <div
                className="ij-ring w-[70px] h-[70px] top-[18%] right-[8%]"
                style={{ position: "absolute" }}
              />
              <div
                className="ij-ring w-11 h-11 top-[28%] right-[13%]"
                style={{ position: "absolute", animationDirection: "reverse", animationDuration: "2s" }}
              />
            </div>
            <div
              ref={elDText}
              className="text-center font-bold text-[#111] origin-center"
              style={{
                fontSize: "clamp(22px,3.8vw,50px)",
                letterSpacing: "-0.04em",
                opacity: 0,
              }}
            >
              {[...PHRASE_D].map((c, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    if (el) refDChars.current[i] = el;
                  }}
                >
                  {c === " " ? "\u00A0" : c}
                </span>
              ))}
            </div>
          </div>

          {/* E — card slides up */}
          <div
            ref={layerE}
            className="absolute inset-0 flex items-center justify-center z-[5] bg-white"
            style={{ transform: "translateY(100vh)" }}
          >
            <h2
              className="font-extrabold text-[#111] text-center flex flex-wrap justify-center gap-x-[0.28em] leading-tight"
              style={{ fontSize: "clamp(48px,8.5vw,120px)", letterSpacing: "-0.04em" }}
            >
              {["And", "hello", "to", "the", "new"].map((word, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    if (el) eWords.current[i] = el;
                  }}
                  className="inline-block"
                  style={{ opacity: 0 }}
                >
                  {word}
                </span>
              ))}
            </h2>
          </div>

          {/* F */}
          <div
            ref={layerF}
            className="absolute inset-0 flex flex-col items-center justify-center gap-[clamp(16px,3vh,36px)] px-[8vw] z-[6]"
            style={{ background: "#f0f0ee", opacity: 0 }}
          >
            <div
              ref={elFImg}
              className="w-[clamp(300px,58vw,720px)] origin-center"
              style={{ opacity: 0 }}
            >
              <div className="w-full rounded-xl overflow-hidden shadow-xl border border-black/10 bg-white">
                <ColumbusUIMock />
              </div>
            </div>
            <div ref={elFTxt} className="relative z-[2] text-center" style={{ opacity: 0 }}>
              <div className="text-[#2656c7] font-semibold mb-0.5" style={{ fontSize: "clamp(14px,1.5vw,20px)" }}>
                Columbus Pro
              </div>
              <div
                className="font-extrabold text-[#111]"
                style={{ fontSize: "clamp(44px,7vw,96px)", letterSpacing: "-0.05em", lineHeight: 0.92 }}
              >
                GIS made effortless
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Section GK ═══ */}
      <div className="relative">
        <div ref={trackGK} className="relative">
          <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ position: "sticky" }}>
            {/* G */}
            <div
              ref={layerG}
              className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-[8vw] z-[1]"
              style={{ background: "#f0ece4" }}
            >
              <blockquote
                ref={elGQuote}
                className="text-center font-bold text-[#111] max-w-[820px] leading-snug"
                style={{ fontSize: "clamp(20px,2.8vw,36px)", letterSpacing: "-0.03em", opacity: 0 }}
              >
                &quot;Think of Columbus as ArcGIS and your best Data-scientist combined into one&quot;
              </blockquote>
              <div
                ref={elGAttr}
                className="flex items-center gap-2 justify-center text-[#555]"
                style={{ fontSize: "clamp(14px,1.5vw,18px)", opacity: 0 }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[13px]"
                  style={{ background: "linear-gradient(135deg,#8a6a4a,#5a4030)" }}
                >
                  👤
                </div>
                — Erick Lara
              </div>
            </div>

            {/* H */}
            <div
              ref={layerH}
              className="absolute inset-0 flex flex-col items-center justify-center gap-8 z-[2]"
              style={{ background: "#f0ece4", transform: "translateY(100vh)" }}
            >
              <div
                ref={elHLabels}
                className="flex items-center gap-[clamp(16px,4vw,60px)]"
                style={{ opacity: 0 }}
              >
                <span className="font-medium text-[#999]" style={{ fontSize: "clamp(13px,1.8vw,22px)", letterSpacing: "-0.02em" }}>
                  Complex GeoCoding
                </span>
                <span className="text-[#bbb]" style={{ fontSize: "clamp(14px,1.8vw,20px)", letterSpacing: "0.08em" }}>
                  ——›
                </span>
                <span className="font-bold text-[#111]" style={{ fontSize: "clamp(13px,1.8vw,22px)", letterSpacing: "-0.02em" }}>
                  Simple Language prompts
                </span>
              </div>
              <div
                ref={elHPanels}
                className="flex gap-4 w-[clamp(300px,75vw,900px)]"
                style={{ opacity: 0 }}
              >
                <div
                  className="flex-1 rounded-[20px] overflow-hidden p-3.5 aspect-[4/3] text-[#888]"
                  style={{ background: "linear-gradient(160deg,#1a1a2e,#0d0d1a)" }}
                >
                  <div className="text-[10px] font-bold text-[#aaa] mb-2 font-['DM_Sans',sans-serif]">
                    Route Manifest
                  </div>
                  <div className="flex gap-1.5 mb-1">
                    <div className="flex-1 text-[7px] text-[#888] bg-white/5 rounded px-1 py-0.5">Route 93</div>
                    <div className="flex-1 text-[7px] text-[#888] bg-white/5 rounded px-1 py-0.5">Monday</div>
                    <div className="flex-1 text-[7px] text-[#888] bg-white/5 rounded px-1 py-0.5">Folder 20</div>
                  </div>
                  <div className="flex gap-1.5 mb-1">
                    <div className="flex-1 text-[7px] text-[#888] bg-white/5 rounded px-1 py-0.5">03-1463</div>
                    <div className="flex-1 text-[7px] text-[#888] bg-white/5 rounded px-1 py-0.5">Stop 4</div>
                    <div className="flex-1 text-[7px] text-[#888] bg-white/5 rounded px-1 py-0.5">Seq: 12</div>
                  </div>
                  <div className="text-[7px] text-[#888] leading-relaxed mt-1.5">
                    Travel N on Main St<br />Turn right onto Olive St<br />
                    Travel on Olive St for 0.56 miles<br />Turn right onto 3rd Ave<br />
                    Turn left onto Avenue Blvd…
                  </div>
                </div>
                <div
                  className="flex-1 rounded-[20px] overflow-hidden p-3.5 aspect-[4/3] flex flex-col border border-black/10"
                  style={{ background: "linear-gradient(160deg,#e8f4e8,#f0f8f0)" }}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[#2656c7] mb-2 text-[9px]">
                    <div className="w-3.5 h-3.5 rounded bg-[#2656c7]" />
                    Columbus is thinking…
                  </div>
                  <div className="text-[8px] text-[#888] pl-2 border-l-2 border-[#dde] mb-1">Considering demographics of Miami</div>
                  <div className="text-[8px] text-[#888] pl-2 border-l-2 border-[#dde] mb-1">Considering lot prices</div>
                  <div className="text-[8px] text-[#888] pl-2 border-l-2 border-[#dde] mb-1">Considering trade area competition</div>
                  <div className="text-[8px] text-[#888] pl-2 border-l-2 border-[#dde] mb-1">Considering your customer target</div>
                  <div className="mt-auto bg-white rounded-xl p-2 text-[8px] text-[#333] shadow-md border border-[#eee] leading-snug">
                    Where best to open a new branch of my business. We&apos;re a local family owned car wash, and would like to expand to another state.
                  </div>
                </div>
              </div>
            </div>

            {/* IJ */}
            <div
              ref={layerIJ}
              className="absolute inset-0 z-[3] bg-black"
              style={{ opacity: 0 }}
            >
              <div ref={ijBg} className="absolute inset-0 z-0 pointer-events-none" />
              <div ref={ijGif} className="absolute overflow-hidden z-[1]" style={{ inset: 0 }}>
                <div
                  className="w-full h-full relative flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#0a1628,#1a2a4a)" }}
                >
                  <div className="ij-holo absolute inset-0" />
                  <div className="absolute inset-0 flex items-center justify-center z-[2]">
                    <div
                      className="w-[38%] aspect-[3/4]"
                      style={{
                        background: "linear-gradient(180deg,#3a3a3a,#222)",
                        clipPath: "polygon(12% 0%,88% 0%,100% 6%,100% 100%,0% 100%,0% 6%)",
                      }}
                    />
                  </div>
                  <div className="ij-ring w-[90px] h-[90px] top-[18%] right-[7%]" style={{ position: "absolute" }} />
                  <div
                    className="ij-ring w-[55px] h-[55px] top-[28%] right-[12%]"
                    style={{ position: "absolute", animationDirection: "reverse", animationDuration: "2s" }}
                  />
                </div>
                <div ref={ijOverlay} className="absolute inset-0 bg-black/85 z-[2] pointer-events-none" />
              </div>
              <p
                ref={ijHl}
                className="absolute z-[5] font-bold text-center whitespace-nowrap"
                style={{
                  letterSpacing: "-0.03em",
                  color: "rgb(190,220,255)",
                  fontSize: "clamp(18px,3.5vw,48px)",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                }}
              >
                This is Columbus at work.
              </p>
              <p
                ref={ijSub}
                className="absolute z-[5] text-center font-bold text-[#111] leading-snug"
                style={{
                  fontSize: "clamp(18px,2.5vw,32px)",
                  letterSpacing: "-0.03em",
                  opacity: 0,
                }}
              >
                It sees everything all at once,
                <br />
                so you don&apos;t have to.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Section K ═══ */}
      <div
        className="flex flex-col items-center justify-center gap-10 py-16 px-[10vw]"
        style={{ background: "#f0ece4" }}
      >
        <p
          className="text-center text-[#555] max-w-[580px] leading-normal"
          style={{ fontSize: "clamp(20px,2.5vw,30px)", letterSpacing: "-0.02em" }}
        >
          We&apos;ve also added abilities that will make your work <strong className="text-[#111] font-bold">faster,</strong> and your life{" "}
          <em className="font-bold not-italic text-[#2656c7]">easier.</em>
        </p>
        <div className="flex flex-wrap gap-12 justify-center">
          {[
            { emoji: "🚀", label: "Data Catalogue", bg: "linear-gradient(135deg,#3d6e3d,#4a7a4a)" },
            { emoji: "🧭", label: "Predictive Datasets", bg: "linear-gradient(135deg,#2a3a5a,#3a4a6a)" },
            { emoji: "🗺️", label: "Creative Heatmaps", bg: "linear-gradient(135deg,#b48020,#d06020)" },
            { emoji: "🔬", label: "AI Research Audits", bg: "linear-gradient(135deg,#4a5a8a,#5a6a9a)" },
          ].map(({ emoji, label, bg }) => (
            <div key={label} className="flex flex-col items-center gap-3 w-32">
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center text-4xl border-2 border-black/10 shadow-lg"
                style={{ background: bg }}
              >
                {emoji}
              </div>
              <div className="text-[13px] font-semibold text-[#333] text-center leading-snug">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Section LM ═══ */}
      <div className="relative bg-white">
        <div ref={trackLM} className="relative">
          <div
            className="sticky top-0 h-screen w-full overflow-hidden bg-white flex flex-col items-center justify-center gap-[clamp(16px,3vh,36px)] px-[8vw]"
            style={{ position: "sticky" }}
          >
            <div
              className="flex flex-wrap items-baseline justify-center gap-x-[clamp(12px,2vw,28px)]"
              id="lm-headline"
            >
              <span
                ref={(el) => {
                  if (el) lmWords.current[0] = el;
                }}
                className="inline-block font-extrabold leading-none opacity-0"
                style={{
                  fontSize: "clamp(48px,8vw,108px)",
                  letterSpacing: "-0.05em",
                  color: "#111",
                  willChange: "opacity,transform",
                }}
              >
                Use
              </span>
              <span
                ref={(el) => {
                  if (el) lmWords.current[1] = el;
                }}
                className="inline-block font-extrabold leading-none opacity-0"
                style={{
                  fontSize: "clamp(48px,8vw,108px)",
                  letterSpacing: "-0.05em",
                  color: "#2656c7",
                  willChange: "opacity,transform",
                }}
              >
                Columbus
              </span>
              <span
                ref={(el) => {
                  if (el) lmWords.current[2] = el;
                }}
                className="inline-block font-extrabold leading-none opacity-0"
                style={{
                  fontSize: "clamp(48px,8vw,108px)",
                  letterSpacing: "-0.05em",
                  color: "#2656c7",
                  willChange: "opacity,transform",
                }}
              >
                Pro,
              </span>
            </div>

            <div
              ref={lmGifWrap}
              className="flex justify-center mb-[clamp(20px,3vh,40px)]"
              style={{ opacity: 0 }}
            >
              <div
                ref={lmGif}
                className="rounded-2xl overflow-hidden shadow-xl bg-[#111] flex-shrink-0"
                style={{ width: 140, height: 79 }}
              >
                <div
                  className="w-full h-full relative flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#0d1a2e,#1a2a4a)" }}
                >
                  <div className="ij-holo absolute inset-0" />
                  <div className="absolute inset-0 flex items-center justify-center z-[2]">
                    <div
                      className="w-[52%] h-[82%]"
                      style={{
                        background: "linear-gradient(180deg,#3a3a3a,#222)",
                        clipPath: "polygon(15% 0%,85% 0%,100% 8%,100% 100%,0% 100%,0% 8%)",
                      }}
                    />
                  </div>
                  <div
                    className="ij-ring w-[40%] h-[40%] max-w-[60px] max-h-[60px] top-[15%] right-[8%]"
                    style={{ position: "absolute" }}
                  />
                  <div
                    className="ij-ring w-[26%] h-[26%] max-w-[38px] max-h-[38px] top-[25%] right-[14%]"
                    style={{ position: "absolute", animationDirection: "reverse", animationDuration: "2s" }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-baseline justify-center gap-x-[clamp(8px,1.2vw,18px)]" id="lm-sub">
              {["find", "your", "targets", "faster."].map((word, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    if (el) lmSubs.current[i] = el;
                  }}
                  className="inline-block font-medium text-[#555] opacity-0"
                  style={{
                    fontSize: "clamp(24px,3.5vw,48px)",
                    letterSpacing: "-0.03em",
                    willChange: "opacity,transform",
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
